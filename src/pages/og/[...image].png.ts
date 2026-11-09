import type { APIRoute, GetStaticPaths } from "astro";
import { getSocialCards } from "@/lib/seo/social";

export const getStaticPaths = (async () =>
  (await getSocialCards()).map((card) => ({
    params: { image: card.imagePath.slice("/og/".length, -".png".length) },
    props: { png: card.png },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(new Uint8Array(props.png), {
    headers: { "Content-Type": "image/png" },
  });
