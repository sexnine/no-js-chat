/// <reference types="vite/client" />

import type { JSX } from "hono/dist/types/jsx/base";

declare global {
  type Element = JSX.Element;
  type IntrinsicElements = JSX.IntrinsicElements;
}
