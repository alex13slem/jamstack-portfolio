import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { render } from "svelte/server";
import { createHash } from "node:crypto";
import type { SocialCardData } from "./types";
import { getSocialFonts } from "./fonts";
import satori from "satori";
import { html } from "satori-html";
import { decodeHTML } from "entities";
import sharp from "sharp";
import SocialCard from "./SocialCard.svelte";
import { socialImageSize } from "@/lib/seo/site";

export async function mediaDataUrl(path: string) {
  const root = resolve("public");
  const file = resolve(root, `.${decodeURIComponent(path)}`);
  if (!path.startsWith("/media/") || !file.startsWith(root + sep))
    throw new Error(`Invalid social image path: ${path}`);
  const png = await sharp(await readFile(file))
    .resize(912, 684, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

export async function portraitDataUrl() {
  const png = await sharp(
    await readFile(resolve("src/assets/img/stickers/hey.png")),
  )
    .resize(600, 676, { fit: "inside" })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

type MarkupNode = {
  type: string;
  props: {
    src?: string;
    style?: Record<string, string | number>;
    children?: string | MarkupNode | (string | MarkupNode)[];
  };
};

// Normalize HTML-adapter values and keep large data URLs out of its parser.
function prepareTree(node: MarkupNode, image: string) {
  if (node.type === "img") node.props.src = image;
  const style = node.props?.style;
  if (style?.WebkitLineClamp)
    style.WebkitLineClamp = Number(style.WebkitLineClamp);
  const children = node.props?.children;
  if (typeof children === "string") node.props.children = decodeHTML(children);
  else if (Array.isArray(children))
    node.props.children = children.map((child) => {
      if (typeof child === "string") return decodeHTML(child);
      if (child && typeof child === "object") prepareTree(child, image);
      return child;
    });
  else if (children && typeof children === "object")
    prepareTree(children, image);
}

async function renderCard(props: SocialCardData) {
  const markup = render(SocialCard, {
    props: { ...props, image: "local-image" },
  }).body;
  const tree = html(markup);
  prepareTree(tree, props.image);
  const svg = await satori(tree, {
    ...socialImageSize,
    fonts: await getSocialFonts(),
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

// Bound the dev cache and retry failed renders after the source data is fixed.
const renderedCards = new Map<string, Promise<Buffer>>();
export function renderSocialCard(props: SocialCardData) {
  const key = createHash("sha256").update(JSON.stringify(props)).digest("hex");
  let result = renderedCards.get(key);
  if (!result) {
    if (renderedCards.size >= 64) renderedCards.clear();
    result = renderCard(props).catch((error) => {
      renderedCards.delete(key);
      throw error;
    });
    renderedCards.set(key, result);
  }
  return result;
}
