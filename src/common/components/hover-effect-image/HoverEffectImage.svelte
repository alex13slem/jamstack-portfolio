<script lang="ts">
  import type HoverEffect from "hover-effect";
  import type { HoverEffectOptions } from "hover-effect";
  import { onMount } from "svelte";
  import displacement4 from "./displacement4.png";

  let {
    intensity1 = 0.1,
    intensity2 = 0.1,
    angle2 = Math.PI / 2,
    imagesRatio,
    image1,
    image2,
    alt = "",
    displacementImage = displacement4.src,
    class: className,
    hoverEffect = $bindable(),
    ...props
  }: Omit<HoverEffectOptions, "displacementImage" | "parent"> & {
    class: string;
    alt?: string;
    displacementImage?: string;
    hoverEffect?: HoverEffect;
  } = $props();

  let rootEl: HTMLElement;

  onMount(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let initialized = false;
    let effect: HoverEffect | undefined;
    const canAnimate = () =>
      !cancelled &&
      !motion.matches &&
      document.documentElement.dataset.motion === "running";

    async function initialize() {
      if (!canAnimate() || initialized) return;
      initialized = true;
      try {
        const cover = new Image();
        cover.src = image1;
        await cover.decode();
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
          imagesRatio: imagesRatio ?? cover.naturalHeight / cover.naturalWidth,
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

    motion.addEventListener("change", onMotionChange);
    document.addEventListener("portfolio:motion-change", onMotionChange);
    void initialize();

    return () => {
      cancelled = true;
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("portfolio:motion-change", onMotionChange);
      hoverEffect = undefined;
    };
  });
</script>

<div class={`relative ${className}`}>
  <img
    src={image1}
    {alt}
    width="1200"
    height="900"
    loading="lazy"
    class="absolute inset-0 h-full w-full object-cover"
  />
  <div
    bind:this={rootEl}
    aria-hidden="true"
    class="hover-effect-canvas absolute inset-0"
  ></div>
</div>
