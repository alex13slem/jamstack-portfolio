import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import type { Font } from "satori";

// Node's resolver also works in Vite's dev runner, unlike import.meta.resolve.
const resolvePackage = createRequire(import.meta.url).resolve;
type FontSource = Omit<Font, "data"> & { file: string };
const sources: FontSource[] = [
  {
    name: "Shadows Into",
    weight: 400,
    style: "normal",
    file: resolve("src/assets/fonts/ShadowsIntoLight.woff"),
  },
  {
    name: "Source Sans",
    weight: 600,
    style: "normal",
    file: resolvePackage(
      "@fontsource/source-sans-3/files/source-sans-3-latin-600-normal.woff",
    ),
  },
  {
    name: "Source Sans Cyrillic",
    weight: 600,
    style: "normal",
    file: resolvePackage(
      "@fontsource/source-sans-3/files/source-sans-3-cyrillic-600-normal.woff",
    ),
  },
];
let fonts: Promise<Font[]> | undefined;
export function getSocialFonts() {
  return (fonts ??= Promise.all(
    sources.map(async ({ file, ...font }) => ({
      ...font,
      data: await readFile(file),
    })),
  ).catch((error) => {
    fonts = undefined;
    throw error;
  }));
}
