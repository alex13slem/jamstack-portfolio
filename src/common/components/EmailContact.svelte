<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./ui/button/Button.svelte";
  let {
    email,
    labels,
  }: {
    email: string;
    labels: { write: string; copy: string; copied: string; error: string };
  } = $props();
  let ready = $state(false);
  let copying = $state(false);
  let feedback = $state("");
  let disposed = false;
  onMount(() => {
    ready = true;
    return () => {
      disposed = true;
    };
  });
  async function copy() {
    copying = true;
    feedback = "";
    try {
      await navigator.clipboard.writeText(email);
      if (!disposed) feedback = labels.copied;
    } catch {
      if (!disposed) feedback = labels.error;
    } finally {
      if (!disposed) copying = false;
    }
  }
</script>

<div
  class="contact-email mx-auto mt-10 block max-w-[640px] rounded-[1.25rem] border border-[#dfe5ec]/15 bg-[#090f16]/55 p-6 text-center"
  data-email={email}
>
  <a
    class="contact-email__address inline-block max-w-full text-[clamp(1.125rem,2.5vw,1.75rem)] leading-[1.4] font-semibold text-cyangrey transition-colors hover:text-white [overflow-wrap:anywhere]"
    href={`mailto:${email}`}>{email}</a
  >
  <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
    <Button variant="fill" href={`mailto:${email}`}>{labels.write}</Button>
    <Button
      variant="subtle"
      type="button"
      class="contact-copy"
      data-copy-email
      hidden={!ready}
      disabled={copying}
      onclick={copy}
    >
      <span class="inline-flex items-center gap-2">
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><rect x="8" y="8" width="12" height="12" rx="2" /><path
            d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"
          /></svg
        >
        {labels.copy}
      </span>
    </Button>
  </div>
  <p
    class="contact-copy__feedback mt-3 min-h-[1.5em] text-sm leading-normal text-cyangrey"
    data-copy-feedback
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    {feedback}
  </p>
</div>
