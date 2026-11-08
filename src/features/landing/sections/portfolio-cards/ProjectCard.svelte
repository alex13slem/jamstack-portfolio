<script lang="ts">
  import HoverEffectImage from "@/common/components/hover-effect-image/HoverEffectImage.svelte";
  import type { ProjectWithTechs } from "@/lib/cruds/project";
  import { cn } from "@/lib/utils/styles";
  import type { Snippet } from "svelte";
  import type HoverEffect from "hover-effect";
  import type { HTMLAttributes } from "svelte/elements";
  
  let {
    class: className,
    project,
    href,
    caseLabel,
    children,
    ...props
  }: HTMLAttributes<HTMLElement> & {
    project: ProjectWithTechs;
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
    `p-[2px] overflow-hidden z-10
    rounded-[0.80rem] animate-gradient__rotate animate-gradient__activeXs
    relative group project-card`,
    className
  )}
  {...props}
>
  <div
    class={cn(`
      flex flex-col p-4 h-full
      bg-white bg-opacity-10 backdrop-blur-sm
      rounded-xl border border-white/10
      z-10
      `)}
  >
    {#if href}
      <a {href} aria-labelledby={`project-action-${project.id} project-title-${project.id}`} class="project-card__link">
        <span id={`project-action-${project.id}`} class="sr-only">{caseLabel}:</span>
      </a>
    {/if}
    <HoverEffectImage
      image1={project.image_cover}
      image2={project.image_preview}
      alt={project.name}
      bind:hoverEffect
      class={cn(`
               bg-[#0D1420]
               aspect-[4/3] w-full
               rounded-xl
               overflow-clip pointer-events-none
               `)}
    />

    <div class="flex-1 px-3 py-4 flex flex-col gap-6 min-w-0">
      <div class="flex-1">
        <p
          class={`
          text-base text-gray-300 group-hover:text-opacity-100
          text-opacity-80 font-medium
          transition-colors duration-200
          `}
        >
          {project.role}
        </p>
        <h3
          id={`project-title-${project.id}`}
          translate="no"
          class={`
          white_gradient
          font-semibold bg-clip-text text-transparent text-2xl text-balance break-words
          `}
        >
          {project.name}
        </h3>
        <p class="mt-3 text-base leading-relaxed text-cyangrey">{project.card_summary}</p>
      </div>

      <hr class="border-white opacity-10" />

      {@render children()}
    </div>
  </div>
  <i aria-hidden="true"></i>
</article>
