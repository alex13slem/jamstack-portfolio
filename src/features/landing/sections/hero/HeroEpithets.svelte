<script lang="ts">
  import { onMount } from "svelte";
  import { subscribeMotion } from "@/common/scripts/motion";
  let { epithets }: { epithets: string[] } = $props();
  let index = $state(0);
  onMount(() => {
    let timer: ReturnType<typeof setInterval>;
    const unsubscribe = subscribeMotion((state) => {
      clearInterval(timer);
      if (state.reduced) index = 0;
      if (!state.paused && epithets.length > 1)
        timer = setInterval(() => {
          index = (index + 1) % epithets.length;
        }, 3000);
    });
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  });
</script>

<span class="hero-epithets">
  <span class="sr-only">{epithets[0] ?? ""}</span>
  <span class="hero-epithets__visual" aria-hidden="true">
    {#each epithets as epithet, wordIndex}
      <span
        data-active={index === wordIndex}
        class="hero-epithet animated-colors__gradient bg-clip-text text-transparent"
        >{epithet}</span
      >
    {/each}
  </span>
</span>
