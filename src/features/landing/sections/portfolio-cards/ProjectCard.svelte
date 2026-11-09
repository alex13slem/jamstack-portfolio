<script lang="ts">
  import HoverEffectImage from "@/common/components/hover-effect-image/HoverEffectImage.svelte";
  import type { ProjectWithTechs } from "@/lib/cruds/project";
  import type { ResponsiveProjectImage } from "@/lib/media/project-images";
  import { cn } from "@/lib/utils/styles";
  import type { Snippet } from "svelte";
  import type HoverEffect from "hover-effect";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    class: className,
    project,
    cover,
    preview,
    href,
    caseLabel,
    children,
    ...props
  }: HTMLAttributes<HTMLElement> & {
    project: ProjectWithTechs;
    cover: ResponsiveProjectImage;
    preview: ResponsiveProjectImage;
    href?: string;
    caseLabel: string;
    children: Snippet;
  } = $props();

  let rootEl = $state<HTMLElement>();

  let hoverEffect = $state<HoverEffect>();

  function showCover() {
    if (!rootEl?.matches(":hover, :focus-within")) hoverEffect?.previous();
  }
</script>

<article
  bind:this={rootEl}
  onmouseenter={() => {
    hoverEffect?.next();
  }}
  onmouseleave={showCover}
  onfocusin={() => hoverEffect?.next()}
  onfocusout={showCover}
  class={cn(
    `animate-gradient__rotate animate-gradient__activeXs group
    project-card relative z-10
    overflow-hidden rounded-[0.80rem] p-[2px]`,
    className,
  )}
  {...props}
>
  <div
    class={cn(`
      z-10 flex h-full
      flex-col rounded-xl border
      border-white/10 bg-white/10 p-4
      backdrop-blur-sm
      `)}
  >
    {#if href}
      <a
        {href}
        aria-labelledby={`project-action-${project.id} project-title-${project.id}`}
        class="project-card__link"
      >
        <span id={`project-action-${project.id}`} class="sr-only"
          >{caseLabel}:</span
        >
      </a>
    {/if}
    <HoverEffectImage
      {cover}
      {preview}
      alt={project.name}
      bind:hoverEffect
      class={cn(`
               pointer-events-none
               aspect-[4/3] w-full
               overflow-clip
               rounded-xl bg-[#0D1420]
               `)}
    />

    <div class="flex min-w-0 flex-1 flex-col gap-6 px-3 py-4">
      <div class="flex-1">
        <p
          class={`
          text-base font-medium text-gray-300/80 transition-colors
          duration-200 group-hover:text-gray-300
          `}
        >
          {project.role}
        </p>
        <h3
          id={`project-title-${project.id}`}
          translate="no"
          class={`
          white_gradient
          bg-clip-text text-2xl font-semibold text-balance break-words text-transparent
          `}
        >
          {project.name}
        </h3>
        <p class="mt-3 text-base leading-relaxed text-cyangrey">
          {project.card_summary}
        </p>
      </div>

      <hr class="border-white opacity-10" />

      {@render children()}
    </div>
  </div>
  <i aria-hidden="true"></i>
</article>
