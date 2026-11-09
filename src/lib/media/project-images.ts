import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import sharp from "sharp";

const widths = [320, 480, 720, 960, 1200, 1600];
const quality = 84;

export const cardImageSizes =
  "(min-width: 1024px) 422px, (min-width: 768px) calc(50vw - 90px), calc(100vw - 102px)";
export const caseImageSizes =
  "(min-width: 1280px) 832px, (min-width: 1024px) 66vw, calc(100vw - 2rem)";

async function prepareImage(src: string) {
  const publicRoot = resolve("public");
  const file = resolve(publicRoot, `.${decodeURIComponent(src)}`);
  if (!src.startsWith("/media/") || !file.startsWith(publicRoot + sep)) {
    throw new Error(`Invalid project media path: ${src}`);
  }

  const input = await readFile(file);
  const { autoOrient } = await sharp(input).metadata();
  const limit =
    Math.floor(Math.min(autoOrient.width, (autoOrient.height * 4) / 3) / 4) * 4;
  if (limit < 4) throw new Error(`Project image is too small: ${src}`);
  const hash = createHash("sha256")
    .update(input)
    .update(`4:3:webp:${quality}`)
    .digest("hex")
    .slice(0, 16);
  const candidates = [
    ...new Set(widths.map((width) => Math.min(width, limit))),
  ];

  return candidates.map((width) => {
    const height = (width * 3) / 4;
    const id = `${hash}-${width}`;
    return {
      id,
      width,
      height,
      src: `/project-images/${id}.webp`,
      render: () =>
        sharp(input)
          .autoOrient()
          .resize(width, height, { fit: "cover" })
          .webp({ quality })
          .toBuffer(),
    };
  });
}

const buildImages = new Map<string, ReturnType<typeof prepareImage>>();
export function getProjectImageVariants(src: string) {
  if (import.meta.env.DEV) return prepareImage(src);
  const result = buildImages.get(src) ?? prepareImage(src);
  buildImages.set(src, result);
  return result;
}

export async function getResponsiveProjectImage(src: string, sizes: string) {
  const variants = await getProjectImageVariants(src);
  const fallback =
    variants.find((variant) => variant.width >= 480) ?? variants.at(-1)!;
  return {
    src: fallback.src,
    width: fallback.width,
    height: fallback.height,
    srcset: variants
      .map((variant) => `${variant.src} ${variant.width}w`)
      .join(", "),
    sizes,
  };
}

export type ResponsiveProjectImage = Awaited<
  ReturnType<typeof getResponsiveProjectImage>
>;
