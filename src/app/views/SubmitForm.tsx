import type { FC } from "hono/jsx";
import DefaultHead from "~/app/components/head/DefaultHead";

const SubmitForm: FC<{ roomId: string }> = ({ roomId }) => (
  <html lang="en">
    <head>
      <DefaultHead />
    </head>
    <body>
      <form method="post" action="/api/message">
        <input
          // biome-ignore lint/a11y/noAutofocus: n/a
          autoFocus={true}
          maxLength={128}
          name="message"
          autoComplete="off"
          placeholder="Send a message..."
          class="w-full px-4 py-2 font-family-inter text-zinc-50 outline-none"
        />
        <input type="hidden" name="room" value={roomId} />
      </form>
    </body>
  </html>
);

export default SubmitForm;
