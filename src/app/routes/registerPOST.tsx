import { setCookie } from "hono/cookie";
import { type App, state } from "~/app";
import { render } from "~/app/util";
import Register from "~/app/views/Register";

const COOKIE_EXPIRY = 1000 * 60 * 60 * 24 * 365;

export default (app: App) => {
  app.post("/", async (c) => {
    const formData = await c.req.formData();

    const name = formData.get("name");

    if (!name || typeof name !== "string" || name.length < 3) {
      return c.html(
        render(<Register error="Name must be at least 3 characters" />),
      );
    }

    if (state.isNameTaken(name)) {
      return c.html(render(<Register error="Name is already taken" />));
    }

    const session = state.createSession(name);
    const exp = new Date(Date.now() + COOKIE_EXPIRY);

    setCookie(c, "x-username", name, {
      path: "/",
      sameSite: "lax",
      expires: exp,
    });
    setCookie(c, "x-channels", "general", {
      path: "/",
      sameSite: "lax",
      expires: exp,
    });
    setCookie(c, "session", session.id, {
      path: "/",
      sameSite: "lax",
      expires: exp,
    });
    return c.redirect("/general");
  });
};
