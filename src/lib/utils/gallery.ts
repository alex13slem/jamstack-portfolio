import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { imageMetadata } from "astro/assets/utils";

/** Resolve public media at build time so gallery images reserve their real space. */
export async function getGalleryImageSize(src: string) {
  const publicRoot = resolve("public");
  const file = resolve(publicRoot, `.${decodeURIComponent(src)}`);
  if (!src.startsWith("/media/") || !file.startsWith(publicRoot + sep)) {
    throw new Error(`Invalid gallery media path: ${src}`);
  }
  const { width, height } = await imageMetadata(await readFile(file), src);
  return { width, height };
}
