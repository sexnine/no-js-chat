import type { FC } from "hono/jsx";

const Message: FC<{
  author: string;
  message: string;
  type?: "user" | "system";
}> = ({ author, message, type = "user" }) => {
  return (
    <div
      class="flex rounded-md px-1 py-1 hover:bg-zinc-800"
      slot="message-list"
    >
      {type === "system" ? (
        <span class="mr-2 h-min shrink-0 text-nowrap bg-blue-500 px-1 font-bold text-blue-50">
          {author}
        </span>
      ) : (
        <span class="h-min shrink-0 text-nowrap pr-2 font-bold text-zinc-500">
          {author}
        </span>
      )}
      <p class="overflow-hidden whitespace-pre-wrap break-words">{message}</p>
    </div>
  );
};

export default Message;
