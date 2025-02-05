import type { App } from "~/app";

export default (app: App) => {
  app.post("/:channel{^[-a-z]{1,12}$}", async (c) => {
    const formData = await c.req.formData();
    const roomId = formData.get("room");

    if (typeof roomId === "string" && /^[-a-zA-Z]{1,12}$/.test(roomId)) {
      return c.redirect(`/${roomId.toLowerCase()}`);
    }

    // TODO: maybe show error message to user
    const oldChannel = c.req.param("channel");
    return c.redirect(`/${oldChannel}`);
  });
};
