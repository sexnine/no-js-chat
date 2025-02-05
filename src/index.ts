import { serve } from "@hono/node-server";
import { app } from "~/app";
import { dev } from "~/env";

let exp = null;

if (dev) {
  exp = app;
} else {
  serve({
    fetch: app.fetch,
    port: 9274,
  });
}

export default exp;
