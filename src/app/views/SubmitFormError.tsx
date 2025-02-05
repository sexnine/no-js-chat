import type { FC } from "hono/jsx";
import DefaultHead from "~/app/components/head/DefaultHead";

const SubmitFormError: FC<{ error: string }> = ({ error }) => (
  <html lang="en">
    <head>
      <DefaultHead />
    </head>
    <body>
      <p class="px-4 py-2 font-medium text-red-400">
        Error: {error}.{" "}
        <a class="underline" href="/" target="_top">
          Reload?
        </a>
      </p>
    </body>
  </html>
);

export default SubmitFormError;
