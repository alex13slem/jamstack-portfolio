<script lang="ts">
  import type HoverEffect from "hover-effect";
  import type { HoverEffectOptions } from "hover-effect";
  import { onMount } from "svelte";
  import displacement4 from "./displacement4.png";

  let {
    intensity1 = 0.1,
    intensity2 = 0.1,
    angle2 = Math.PI / 2,
    imagesRatio = 9 / 16,
    displacementImage = displacement4.src,
    class: className,
    hoverEffect = $bindable(),
    ...props
  }: Omit<HoverEffectOptions, "displacementImage" | "parent"> & {
    class: string;
    displacementImage?: string;
    hoverEffect?: HoverEffect;
  } = $props();

  onMount(async () => {
    try {
      const HoverEffect = (await import("hover-effect")).default;
      hoverEffect = new HoverEffect({
        parent: rootEl,
        intensity1,
        intensity2,
        angle2,
        imagesRatio,
        displacementImage,
        ...props,
      });
    } catch (error) {
      console.error(error);
    }
  });

  let rootEl: HTMLElement;
</script>

<div bind:this={rootEl} class={className}></div>
