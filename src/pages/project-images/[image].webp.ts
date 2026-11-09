import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { getProjectImageVariants } from "@/lib/media/project-images";

export const getStaticPaths = (async () => {
  const projects = await getCollection("project");
  const sources = new Set(
    projects.flatMap(({ data }) => [data.image_cover, data.image_preview]),
  );
  const variants = (
    await Promise.all([...sources].map(getProjectImageVariants))
  ).flat();
  return [
    ...new Map(variants.map((variant) => [variant.id, variant])).values(),
  ].map((variant) => ({
    params: { image: variant.id },
    props: { variant },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await props.variant.render()), {
    headers: { "Content-Type": "image/webp" },
  });
