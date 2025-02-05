import type { FC } from "hono/jsx";
import CssImports from "~/app/components/head/CssImports";
import { dev } from "~/env";

const DefaultHead: FC<{ title?: string }> = ({ title = "No JS Chat" }) => (
  <>
    <meta charSet="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <CssImports />
    {dev && <script src="/__vite/@vite/client" type="module" />}
  </>
);

export default DefaultHead;
