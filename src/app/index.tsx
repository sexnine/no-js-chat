import type { HttpBindings } from "@hono/node-server";
import { type Context, Hono } from "hono";
import { getCookie } from "hono/cookie";
import type { StreamingApi } from "hono/utils/stream";
import { nanoid } from "nanoid";
import MemberListItem from "~/app/components/MemberListItem";
import MemberListRemoveUpdate from "~/app/components/MemberListRemoveUpdate";
import MessageComponent from "~/app/components/Message";
import { routes } from "~/app/routes";
import { iterFilter, iterSome, render } from "~/app/util";
import Iterator = NodeJS.Iterator;

type Bindings = HttpBindings;

const app = new Hono<{ Bindings: Bindings }>();
export type App = typeof app;

const SESSION_EXPIRY = 1000 * 60 * 60 * 48;

export interface Message {
  type: "system" | "user";
  author: string;
  message: string;
}

export interface Room {
  name: string;
  messages: Message[];
  userMembershipIds: Map<Session, string>;
}

export interface Session {
  id: string;
  name: string;
  rooms: Set<string>;
  expiry: Date;
  connectedClientsCount: number;
  markedAsConnected: boolean;
}

export interface ClientInfo {
  roomId: string;
  sessionId: string;
}

class State {
  private _rooms: Map<string, Room> = new Map();
  private _sessions: Map<string, Session> = new Map();
  private _clients: Map<StreamingApi, ClientInfo> = new Map();
  private _clientDisconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this._createRoom("general");
  }

  getOrCreateRoom(name: string) {
    return this._rooms.get(name) ?? this._createRoom(name);
  }

  isNameTaken(name: string) {
    return iterSome(
      this._sessions.values(),
      (s) => s.name === name && s.expiry > new Date(),
    );
  }

  /**
   * Creates a new session.  Nickname is not checked for uniqueness.
   * @returns The newly created session
   */
  createSession(nick: string) {
    const sessionId = nanoid();
    const expiry = new Date(Date.now() + SESSION_EXPIRY);
    const session: Session = {
      id: sessionId,
      name: nick,
      rooms: new Set(["general"]),
      expiry,
      connectedClientsCount: 0,
      markedAsConnected: false,
    };

    this._sessions.set(sessionId, session);
    return session;
  }

  getSessionFromCtx(c: Context, refresh = true) {
    const sessionId = getCookie(c, "session");

    if (!sessionId) {
      return null;
    }

    const session = this._sessions.get(sessionId);

    if (!session) {
      return null;
    }

    if (session?.expiry < new Date()) {
      this._sessions.delete(sessionId);
      return null;
    }

    if (refresh) {
      session.expiry = new Date(Date.now() + SESSION_EXPIRY);
    }

    return session;
  }

  getMemberListItems(room: Room) {
    // TODO: prolly rework this lol
    return Array.from(this._sessions.values())
      .filter(
        ({ rooms, markedAsConnected }) =>
          markedAsConnected && rooms.has(room.name),
      )
      .map((session) => {
        const membershipId = room.userMembershipIds.get(session);
        return membershipId ? (
          <MemberListItem id={membershipId} name={session.name} />
        ) : null;
      });
  }

  /**
   * @throws {Error} If session is not found
   */
  addClient(stream: StreamingApi, sessionId: string, info: { roomId: string }) {
    const session = this._sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    const timeout = this._clientDisconnectTimeouts.get(session.id);
    if (timeout) {
      clearTimeout(timeout);
    }

    this._clients.set(stream, {
      sessionId,
      roomId: info.roomId,
    });

    const shouldBroadcastJoinMessage = !session.markedAsConnected;
    session.connectedClientsCount++;
    session.markedAsConnected = true;

    if (shouldBroadcastJoinMessage) {
      for (const roomId of session.rooms) {
        this._doMembershipUpdateJoin(session, this._rooms.get(roomId) as Room);
        this.broadcastMessage({
          room: roomId,
          message: {
            author: "SYSTEM",
            message: `${session.name} joined the chat`,
            type: "system",
          },
        });
      }
    }
  }

  addSessionToRoom(sessionId: string, roomId: string) {
    const session = this._sessions.get(sessionId);
    if (!session) {
      return;
    }

    if (session.rooms.has(roomId)) {
      return;
    }

    session.rooms.add(roomId);
    if (session.markedAsConnected) {
      this._doMembershipUpdateJoin(session, this.getOrCreateRoom(roomId));
      this.broadcastMessage({
        room: roomId,
        message: {
          type: "system",
          author: "SYSTEM",
          message: `${session.name} has joined #${roomId}`,
        },
      });
    }
  }

  /**
   * @throws {Error} If session is not found
   */
  clientDisconnecting(stream: StreamingApi) {
    const sessionId = this._clients.get(stream)?.sessionId;
    if (!sessionId) {
      throw new Error("Client not registered");
    }

    this._clients.delete(stream);

    const session = this._sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    session.connectedClientsCount--;

    if (session.connectedClientsCount > 0) {
      return;
    }

    const timeout = setTimeout(() => {
      if (session.connectedClientsCount === 0) {
        session.markedAsConnected = false;
        for (const roomId of session.rooms) {
          this._doMembershipUpdateLeave(
            session,
            this._rooms.get(roomId) as Room,
          );
          this.broadcastMessage({
            room: roomId,
            message: {
              author: "SYSTEM",
              message: `${session.name} left the chat`,
              type: "system",
            },
          });
        }
      }
    }, 5000);

    this._clientDisconnectTimeouts.set(session.id, timeout);
  }

  private _broadcastElement(
    el: Element,
    config: { to: "room"; roomId: string } | { to: "all" },
  ) {
    let streamIter: Iterator<StreamingApi>;
    if (config.to === "all") {
      streamIter = this._clients.keys();
    } else if (config.to === "room") {
      // TODO: wtf
      streamIter = iterFilter(
        this._clients.entries(),
        ([_, { roomId: r }]) => r === config.roomId,
      )
        .map(([stream]) => stream)
        [Symbol.iterator]();
    } else {
      return;
    }

    const rendered = render(el);
    for (const stream of streamIter) {
      stream.write(rendered).then();
    }
  }

  broadcastMessage({
    room,
    message,
    addToHistory = false,
  }:
    | {
        room: Room;
        message: Message;
        addToHistory?: boolean;
      }
    | {
        room: string;
        message: Message;
        addToHistory?: false;
      }) {
    const el = (
      <MessageComponent
        author={message.author}
        message={message.message}
        type={message.type}
      />
    );
    const isRoomId = typeof room === "string";

    this._broadcastElement(el, {
      to: "room",
      roomId: isRoomId ? room : room.name,
    });

    if (!isRoomId && addToHistory) {
      room.messages.push(message);
    }
  }

  private _doMembershipUpdateJoin(session: Session, room: Room) {
    const roomMembershipId = nanoid();
    room.userMembershipIds.set(session, roomMembershipId);

    this._broadcastElement(
      <MemberListItem id={roomMembershipId} name={session.name} />,
      { to: "room", roomId: room.name },
    );
  }

  private _doMembershipUpdateLeave(session: Session, room: Room) {
    const roomMembershipId = room.userMembershipIds.get(session);
    if (!roomMembershipId) {
      return;
    }

    this._broadcastElement(<MemberListRemoveUpdate id={roomMembershipId} />, {
      to: "room",
      roomId: room.name,
    });
  }

  private _createRoom(name: string) {
    const room: Room = {
      name,
      messages: [],
      userMembershipIds: new Map(),
    };
    this._rooms.set(name, room);

    return room;
  }
}

export const state = new State();

for (const route of routes) {
  route(app);
}

export { app };
