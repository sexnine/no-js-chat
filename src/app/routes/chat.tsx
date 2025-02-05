import { stream } from "hono/streaming";
import { nanoid } from "nanoid/non-secure";
import { type App, state } from "~/app";
import MessageEl from "~/app/components/Message";
import DefaultHead from "~/app/components/head/DefaultHead";
import { render } from "~/app/util";
import AppPartialView from "~/app/views/AppPartialView";

const htmlStart = (roomId: string) =>
  `<!DOCTYPE html><html lang="en"><head>${render(<DefaultHead title={`No JS Chat - #${roomId}`} />)}</head><body class="bg-zinc-950">`;

export default (app: App) => {
  app.get("/:channel{^[-a-z]{1,12}$}", (c) => {
    const session = state.getSessionFromCtx(c);
    if (!session) {
      return c.redirect("/");
    }

    const roomId = c.req.param("channel");
    const room = state.getOrCreateRoom(roomId);
    state.addSessionToRoom(session.id, roomId);

    const username = session.name;
    const id = nanoid();

    c.header("Content-Type", "text/html; charset=utf-8");

    return stream(c, (stream) => {
      return new Promise((resolve) => {
        stream.onAbort(() => {
          state.clientDisconnecting(stream);
          resolve();
        });

        stream
          .write(
            htmlStart(roomId) +
              render(
                <>
                  <AppPartialView
                    roomId={roomId}
                    rooms={Array.from(session.rooms)}
                  />
                  {room.messages.map(({ author, message }) => (
                    <MessageEl author={author} message={message} />
                  ))}
                  <MessageEl
                    author="SYSTEM"
                    message={`Welcome to No JS Chat, ${username}!  You're currently in #${roomId}.  This in a real-time chat app which uses zero JavaScript!`}
                    type="system"
                  />
                  {state.getMemberListItems(room)}
                </>,
              ),
          )
          .then(() => {
            state.addClient(stream, session.id, { roomId });
          });
      });
    });
  });

  app.get("/:channel{^[-a-zA-Z]{1,12}$}", async (c) =>
    c.redirect(`/${c.req.param("channel").toLowerCase()}`),
  );
};
