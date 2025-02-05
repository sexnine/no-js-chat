import type { FC } from "hono/jsx";
import ChannelIcon from "~/app/components/ChannelIcon";
import FormHiddenDisabledSubmit from "~/app/components/FormHiddenDisabledSubmit";
import WarningIcon from "~/app/components/WarningIcon";
import CssImports from "~/app/components/head/CssImports";
import { render } from "~/app/util";
import SubmitForm from "~/app/views/SubmitForm";

const RoomListItem: FC<{ id: string; current: boolean }> = ({ id, current }) =>
  current ? (
    <div class="mb-1 flex items-center rounded-md bg-purple-300 px-1 text-purple-900">
      <ChannelIcon class="mr-1 inline align-middle" />
      <span>{id}</span>
    </div>
  ) : (
    <a
      class="mb-1 flex items-center rounded-md px-1 hover:bg-zinc-700"
      href={`/${id}`}
    >
      <ChannelIcon class="mr-1 inline align-middle" />
      <span>{id}</span>
    </a>
  );

const AppPartialView: FC<{ roomId: string; rooms: string[] }> = ({
  roomId,
  rooms,
}) => (
  <template shadowrootmode="open">
    <CssImports />
    <div
      id="app"
      class="flex h-screen w-full flex-col p-2 font-family-inter text-zinc-50"
    >
      <header class="mb-2 rounded-md bg-zinc-900 px-4 py-2 font-family-poppins font-semibold text-2xl">
        No JS Chat{" "}
        <span class="pl-2 align-middle text-base text-zinc-500">#{roomId}</span>
      </header>
      <div class="flex min-h-0 grow justify-center">
        <div class="pretty-scrollbar mr-2 w-48 shrink-0 overflow-y-auto rounded-md bg-zinc-900 p-4">
          <h2 class="font-family-poppins font-semibold text-lg">
            Rooms{" "}
            <span class="pl-2 align-middle font-family-inter text-sm text-zinc-500">
              {rooms.length}/50
            </span>
          </h2>
          {rooms.map((id) => (
            <RoomListItem id={id} current={id === roomId} />
          ))}
          <form
            class="mt-4 border-zinc-700 border-t pt-4"
            action={`/${roomId}`}
            method="post"
          >
            <FormHiddenDisabledSubmit />
            <div class="relative pb-2" id="new-room-input">
              <input
                name="room"
                class="w-full rounded-md bg-zinc-800 py-0.5 pr-1 pl-5.5 lowercase outline-0 ring-red-400 invalid:ring"
                placeholder="new-channel"
                spellcheck={false}
                autocomplete="off"
                pattern="[a-zA-Z\-]{1,12}"
                maxlength={12}
              />
              <ChannelIcon class="absolute top-0 mt-1.5 ml-1 text-[#909092]" />
            </div>
            <p class="hidden text-red-400 text-xs [form:has(div>input:invalid)>&]:block">
              <WarningIcon class="mr-1 inline" />
              Room name must only contain letters and hyphens
            </p>
            <button
              type="submit"
              class="w-full shrink-0 cursor-pointer rounded-md bg-purple-300 text-center font-family-poppins font-semibold text-purple-950 hover:bg-purple-200 [form:has(div>input:invalid)>&]:hidden [form:has(div>input:placeholder-shown)>&]:hidden"
            >
              Join
            </button>
          </form>
        </div>
        <div class="flex max-w-4xl grow flex-col">
          <div
            class="pretty-scrollbar mb-2 flex w-full grow flex-col-reverse overflow-y-auto rounded-md bg-zinc-900 p-4 outline-0"
            tabindex={-1}
          >
            <div>
              <slot name="message-list" />
            </div>
          </div>
          <div class="h-10 w-full rounded-md bg-zinc-900">
            <iframe
              title="Send Message"
              srcdoc={render(<SubmitForm roomId={roomId} />)}
              class="h-10 w-full"
            />
          </div>
        </div>
        <div class="pretty-scrollbar ml-2 w-48 shrink-0 overflow-y-auto rounded-md bg-zinc-900 p-4">
          <h2 class="font-family-poppins font-semibold text-lg">Here now</h2>
          <slot name="member-list" />
        </div>
      </div>
    </div>
  </template>
);

export default AppPartialView;
