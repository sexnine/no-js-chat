import { serveStatic } from "@hono/node-server/serve-static";
import type { App } from "~/app";

const STATIC_ROOT_PATH = "./build";

export default (app: App) => {
  app.get(
    "/static/*",
    serveStatic({
      root: STATIC_ROOT_PATH,
      onFound: async (path, c) => {
        if (path.startsWith(`${STATIC_ROOT_PATH}/static/immutable/`)) {
          c.header("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );
};
