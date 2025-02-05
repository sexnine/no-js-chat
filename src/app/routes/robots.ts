import type { App } from "~/app";

export default (app: App) => {
  app.get("/robots.txt", (c) => {
    return c.text("User-agent: *\nDisallow: /");
  });
};
