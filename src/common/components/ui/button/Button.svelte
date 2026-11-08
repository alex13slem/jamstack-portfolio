<script lang="ts">
  import { cn } from "@/lib/utils/styles";
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import { variantsCss } from "./styles";
  import type { ButtonVariant } from "./types";

  type Props = {
    children: Snippet;
    href?: string;
    variant?: ButtonVariant;
    class?: string;
    disabled?: boolean;
    external?: boolean;
    type?: "button" | "submit" | "reset";
    target?: HTMLAnchorAttributes["target"];
    rel?: string;
  } & (
    | Omit<HTMLAnchorAttributes, "children" | "class" | "type">
    | Omit<HTMLButtonAttributes, "children" | "class" | "type">
  );

  let {
    href,
    variant = "bordered",
    children,
    class: className,
    disabled = false,
    external = false,
    type = "button",
    target,
    rel,
    ...attributes
  }: Props = $props();

  const rootClass = $derived(cn(
    variantsCss.root[variant],
    "site-button inline-flex relative rounded-full font-medium text-base group z-0",
    disabled ? "grayscale cursor-not-allowed" : "cursor-pointer",
    className
  ));
</script>

{#snippet content()}
  <span class={cn(variantsCss.text[variant], "inline-block px-7 py-3 rounded-full z-10 relative")}>
    {@render children()}
  </span>
  {#if !disabled && variant !== "subtle"}
    <i aria-hidden="true" class={cn(variantsCss.i[variant])}></i>
  {/if}
{/snippet}

{#if href !== undefined}
  <a
    {...(attributes as HTMLAnchorAttributes)}
    href={disabled ? undefined : href}
    target={external ? "_blank" : target}
    rel={external || target === "_blank" ? `noopener noreferrer ${rel ?? ""}`.trim() : rel}
    aria-disabled={disabled || undefined}
    tabindex={disabled ? -1 : attributes.tabindex}
    data-variant={variant}
    class={rootClass}
  >
    {@render content()}
  </a>
{:else}
  <button {...(attributes as HTMLButtonAttributes)} {type} {disabled} data-variant={variant} class={rootClass}>
    {@render content()}
  </button>
{/if}
