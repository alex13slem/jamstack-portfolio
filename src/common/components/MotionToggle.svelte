<script lang="ts">
  import { onMount } from "svelte";
  import {
    subscribeMotion,
    toggleMotion,
    type MotionState,
  } from "@/common/scripts/motion";
  let {
    labels,
  }: {
    labels: {
      label: string;
      short: string;
      on: string;
      off: string;
      reduced: string;
    };
  } = $props();
  let motionState = $state<MotionState>({
    enabled: false,
    paused: true,
    reduced: false,
  });
  let ready = $state(false);
  let revealed = $state(false);
  let compact: MediaQueryList;
  let timer: ReturnType<typeof setTimeout>;
  function clearReveal() {
    clearTimeout(timer);
    revealed = false;
  }
  function toggle() {
    toggleMotion();
    clearReveal();
    if (compact.matches) {
      revealed = true;
      timer = setTimeout(clearReveal, 2000);
    }
  }
  onMount(() => {
    const unsubscribe = subscribeMotion((value) => {
      motionState = value;
    });
    compact = window.matchMedia(
      "(hover: none), (pointer: coarse), (max-width: 640px)",
    );
    compact.addEventListener("change", clearReveal);
    const visibility = () => {
      if (document.hidden) clearReveal();
    };
    document.addEventListener("visibilitychange", visibility);
    ready = true;
    return () => {
      unsubscribe();
      clearReveal();
      compact.removeEventListener("change", clearReveal);
      document.removeEventListener("visibilitychange", visibility);
    };
  });
</script>

<button
  type="button"
  role="switch"
  class="motion-toggle animate-gradient__rotate animate-gradient__activeXs"
  data-motion-toggle
  hidden={!ready}
  data-reveal={revealed || undefined}
  onclick={toggle}
  aria-label={labels.label}
  aria-checked={motionState.enabled}
  disabled={motionState.reduced}
  title={motionState.reduced ? labels.reduced : undefined}
>
  <span class="motion-toggle__icon" aria-hidden="true">
    <svg
      class="motion-toggle__pause"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg
    >
    <svg
      class="motion-toggle__play"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"><path d="m8 4 12 8-12 8z" /></svg
    >
  </span>
  <span class="motion-toggle__label" aria-hidden="true"
    ><span
      >{labels.short}:
      <span class="motion-toggle__status" data-motion-status
        >{motionState.enabled ? labels.on : labels.off}</span
      ></span
    ></span
  >
  <i aria-hidden="true"></i>
</button>
