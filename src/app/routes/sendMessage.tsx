import { type App, state } from "~/app";
import { render } from "~/app/util";
import SubmitForm from "~/app/views/SubmitForm";
import SubmitFormError from "~/app/views/SubmitFormError";

export default (app: App) => {
  app.post("/api/message", async (c) => {
    const formData = await c.req.formData();

    const session = state.getSessionFromCtx(c);
    if (!session) {
      return c.html(render(<SubmitFormError error="Invalid session" />));
    }

    if (!session.markedAsConnected) {
      return c.html(
        render(<SubmitFormError error="You are not connected to the server" />),
      );
    }

    const roomId = formData.get("room");
    if (!roomId || typeof roomId !== "string") {
      return c.html(render(<SubmitFormError error="Invalid room" />));
    }

    if (!session.rooms.has(roomId)) {
      return c.html(
        render(<SubmitFormError error="You are not part of this room" />),
      );
    }

    const room = state.getOrCreateRoom(roomId);

    const messageContent = formData.get("message");
    if (!messageContent || typeof messageContent !== "string") {
      return c.html(render(<SubmitForm roomId={roomId as string} />));
    }

    state.broadcastMessage({
      room: room,
      message: {
        author: session.name,
        message: messageContent,
        type: "user",
      },
      addToHistory: true,
    });

    return c.html(render(<SubmitForm roomId={roomId as string} />));
  });
};
