import { builtinModules } from "node:module";
import { resolve } from "node:path";
import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import { type UserConfig, defineConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  return {
    base: mode === "development" ? "/__vite" : "/",
    resolve: {
      alias: {
        "~": resolve(__dirname, "./src"),
      },
    },
    plugins: [
      devServer({
        entry: "src/index.ts",
        exclude: [/^\/__vite\/.*/, /^\/@.*$/, /^\/node_modules\/.*/],
        injectClientScript: false,
      }),
      tailwindcss(),
    ],
    ssr: {
      target: "node",
      noExternal: true,
    },
    build: {
      emitAssets: true,
      outDir: "build",
      emptyOutDir: true,
      ssr: true,
      rollupOptions: {
        input: ["src/index.ts"],
        external: [...builtinModules, /^node:/],
        output: {
          entryFileNames: "index.js",
          assetFileNames: "static/immutable/[name].[hash].[ext]",
        },
      },
    },
  };
});
