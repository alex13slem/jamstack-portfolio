<script lang="ts">
  import HoverEffectImage from "@/common/components/hover-effect-image/HoverEffectImage.svelte";
  import type { ProjectWithTechs } from "@/lib/collections/project";
  import { cn } from "@/lib/utils/styles";
  import Icon from "@iconify/svelte";
  import type HoverEffect from "hover-effect";
  import { type HTMLAttributes } from "svelte/elements";
  let {
    class: className,
    project,
    href,
    ...props
  }: HTMLAttributes<HTMLElement> & {
    project: ProjectWithTechs;
    href?: string;
  } = $props();

  let rootEl = $state<HTMLElement>();

  let hoverEffect = $state<HoverEffect>();
</script>

<article
  bind:this={rootEl}
  onmouseenter={() => {
    hoverEffect?.next();
  }}
  onmouseleave={() => {
    hoverEffect?.previous();
  }}
  class={cn(
    `p-[2px] overflow-hidden z-10
    rounded-[0.80rem] animate-gradient__rotate animate-gradient__activeXs
    relative group`,
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
      <a {href} class="absolute inset-0 opacity-0">.</a>
    {/if}
    <HoverEffectImage
      image1={project.image_cover}
      image2={project.image_preview}
      bind:hoverEffect
      class={cn(`
               bg-[#0D1420]
               h-[300px] w-full
               rounded-xl
               overflow-clip pointer-events-none
               `)}
    />

    <div class="flex-1 px-3 py-4 flex flex-col gap-6">
      <div class="flex-1">
        <p
          class={`
          text-base text-gray-300 group-hover:text-opacity-100
          text-opacity-80 font-medium
          transition-all duration-200
          `}
        >
          {project.role}
        </p>
        <h3
          class={`
          white_gradient
          font-bold bg-clip-text text-transparent text-3xl
          `}
        >
          {project.name}
        </h3>
      </div>

      <hr class="border-white opacity-10" />

      <div
        class="flex items-center justify-between gap-3 relative z-20 flex-col lg:flex-row"
      >
        <div class="flex items-center gap-3 flex-wrap">
          {#each project.techs as t}
            <a
              href={t.url}
              target="_blank"
              class={cn(`
                text-xl opacity-60
                hover:opacity-90 transition-all duration-200
              `)}
            >
              <Icon ssr icon={t.iconify_id} />
            </a>
          {/each}
        </div>
        <div>
          <a
            href={project.github_url}
            class={cn(`text-xl opacity-60
              hover:opacity-90 transition-all duration-200`)}
            target="_blank"
          >
            <Icon icon="octicon:logo-github-24" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <i></i>
</article>
