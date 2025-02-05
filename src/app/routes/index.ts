import type { App } from "~/app";
import chat from "~/app/routes/chat";
import home from "~/app/routes/home";
import joinRoom from "~/app/routes/joinRoom";
import registerPOST from "~/app/routes/registerPOST";
import sendMessage from "~/app/routes/sendMessage";
import staticFiles from "~/app/routes/staticFiles";

export const routes: ((app: App) => void)[] = [
  registerPOST,
  home,
  sendMessage,
  staticFiles,
  chat,
  joinRoom,
];
