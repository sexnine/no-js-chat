import { type App, state } from "~/app";
import { render } from "~/app/util";
import Register from "~/app/views/Register";

export default (app: App) => {
  app.get("/", async (c) => {
    if (state.getSessionFromCtx(c)) {
      return c.redirect("/chat");
    }

    return c.html(render(<Register />));
  });
};
