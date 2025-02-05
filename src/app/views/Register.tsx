import type { FC } from "hono/jsx";
import DefaultHead from "~/app/components/head/DefaultHead";

const Register: FC<{ error?: string }> = ({ error }) => (
  <html lang="en">
    <head>
      <DefaultHead />
    </head>
    <body class="grid place-items-center bg-zinc-950 font-family-inter text-zinc-50">
      <div class="w-full max-w-md rounded-md bg-zinc-900 p-4">
        <h1 class="pb-2 text-center font-family-poppins font-semibold text-2xl">
          Choose a name
        </h1>
        {error && <p class="pb-2 text-center text-red-400">Error: {error}</p>}
        <form
          action="/"
          method="post"
          class="mx-auto w-full max-w-[12rem] pt-2"
        >
          <input
            id="name"
            name="name"
            autofocus={true}
            autoComplete="off"
            class="mb-2 block w-full rounded-md border-2 border-zinc-700 bg-zinc-800 px-2 py-1 outline-none placeholder:text-zinc-600"
            placeholder="awesomename123"
          />
          <button
            class="w-full rounded-md bg-purple-300 py-1 font-family-poppins font-semibold text-purple-950 hover:bg-purple-200"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </body>
  </html>
);

export default Register;
