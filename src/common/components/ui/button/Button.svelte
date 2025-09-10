<script lang="ts">
  import { cn } from "@/lib/utils/styles";
  import type { Snippet } from "svelte";
  import { variantsCss } from "./styles";
  import type { ButtonVariant } from "./types";

  let {
    href,
    variant = "bordered",
    children,
    class: className,
    disabled,
    external,
  }: {
    children: Snippet;
    href?: string;
    variant?: ButtonVariant;
    class: string;
    disabled?: boolean;
    external?: boolean;
  } = $props();
</script>

<button
  class={cn(
    variantsCss.root[variant],
    `relative  rounded-full
        font-medium text-base group z-0`,
    disabled ? "grayscale" : "cursor-pointer",
    className
  )}
  {disabled}
>
  {#if href && !disabled}
    <a
      {href}
      target={external ? "_blank" : "_self"}
      class="absolute inset-0 z-20 opacity-0">.</a
    >
  {/if}
  <span
    class={cn(
      variantsCss.text[variant],
      `inline-block px-7 py-3 rounded-full z-10 relative`
    )}
  >
    {@render children()}
  </span>
  {#if !disabled}
    <i class={cn(variantsCss.i[variant])}></i>
  {/if}
</button>
