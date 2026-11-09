<script lang="ts">
  import type HoverEffect from "hover-effect";
  import type { HoverEffectOptions } from "hover-effect";
  import { projectPreviewMedia } from "@/common/scripts/motion";
  import type { ResponsiveProjectImage } from "@/lib/media/project-images";
  import { onMount } from "svelte";
  import displacement4 from "./displacement4.webp";

  let {
    intensity1 = 0.1,
    intensity2 = 0.1,
    angle2 = Math.PI / 2,
    imagesRatio,
    cover,
    preview,
    alt = "",
    displacementImage = displacement4.src,
    class: className,
    hoverEffect = $bindable(),
    ...props
  }: Omit<
    HoverEffectOptions,
    "displacementImage" | "parent" | "image1" | "image2"
  > & {
    class: string;
    cover: ResponsiveProjectImage;
    preview: ResponsiveProjectImage;
    alt?: string;
    displacementImage?: string;
    hoverEffect?: HoverEffect;
  } = $props();

  let rootEl: HTMLElement;

  async function loadTexture(source: ResponsiveProjectImage) {
    const texture = new Image();
    texture.sizes = source.sizes;
    texture.srcset = source.srcset;
    texture.src = source.src;
    await texture.decode();
    return texture.currentSrc || source.src;
  }

  onMount(() => {
    const supportsPreview = window.matchMedia(projectPreviewMedia);
    let cancelled = false;
    let initialized = false;
    let effect: HoverEffect | undefined;
    const canAnimate = () =>
      !cancelled &&
      supportsPreview.matches &&
      document.documentElement.dataset.motion === "running";

    async function initialize() {
      if (!canAnimate() || initialized) return;
      initialized = true;
      try {
        const [image1, image2] = await Promise.all([
          loadTexture(cover),
          loadTexture(preview),
        ]);
        const HoverEffect = (await import("hover-effect")).default;
        if (!canAnimate()) {
          initialized = false;
          return;
        }
        effect = new HoverEffect({
          ...props,
          parent: rootEl,
          intensity1,
          intensity2,
          angle2,
          imagesRatio: imagesRatio ?? cover.height / cover.width,
          image1,
          image2,
          displacementImage,
          hover: false,
        });
        hoverEffect = {
          next: () => {
            if (canAnimate()) effect?.next();
          },
          previous: () => {
            if (canAnimate()) effect?.previous();
          },
        };
      } catch (error) {
        // The server-rendered image remains visible when WebGL cannot start.
        console.warn("Image preview effect unavailable", error);
      }
    }

    function onMotionChange() {
      if (!canAnimate()) return;
      if (!effect) void initialize();
      else if (
        rootEl.closest(".project-card")?.matches(":hover, :focus-within")
      )
        effect.next();
      else effect.previous();
    }

    supportsPreview.addEventListener("change", onMotionChange);
    document.addEventListener("portfolio:motion-change", onMotionChange);
    void initialize();

    return () => {
      cancelled = true;
      supportsPreview.removeEventListener("change", onMotionChange);
      document.removeEventListener("portfolio:motion-change", onMotionChange);
      hoverEffect = undefined;
    };
  });
</script>

<div class={`relative ${className}`}>
  <img
    {...cover}
    {alt}
    loading="lazy"
    class="absolute inset-0 h-full w-full object-cover"
  />
  <div
    bind:this={rootEl}
    aria-hidden="true"
    class="hover-effect-canvas absolute inset-0"
  ></div>
</div>
