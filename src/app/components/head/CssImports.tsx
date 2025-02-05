import type { FC } from "hono/jsx";
import cssMainUrl from "~/assets/main.css?url";
import cssResetUrl from "~/assets/reset.css?url";

const CssImports: FC = () => (
  <>
    <link rel="stylesheet" href={cssResetUrl} />
    <link rel="stylesheet" href={cssMainUrl} />
  </>
);

export default CssImports;
