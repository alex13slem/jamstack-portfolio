<script lang="ts">
  import { onMount, tick } from "svelte";
  import Swiper from "swiper";
  import { A11y, Zoom } from "swiper/modules";
  import { subscribeMotion } from "@/common/scripts/motion";
  import "swiper/css";
  import "swiper/css/zoom";
  type Image = {
    image: string;
    alt: string;
    caption?: string;
    width: number;
    height: number;
  };
  type Labels = {
    title: string;
    of: string;
    open: string;
    close: string;
    previous: string;
    next: string;
    zoomIn: string;
    zoomOut: string;
  };
  let { images, labels }: { images: Image[]; labels: Labels } = $props();
  let ready = $state(false);
  let pageIndex = $state(0);
  let viewerIndex = $state(0);
  let zoomed = $state(false);
  let showing = $state(false);
  let root: HTMLDivElement,
    inlineElement: HTMLDivElement,
    viewerElement: HTMLDivElement,
    dialog: HTMLDialogElement;
  let closeButton: HTMLButtonElement, zoomButton: HTMLButtonElement;
  let inlinePrevious: HTMLButtonElement,
    inlineNext: HTMLButtonElement,
    viewerPrevious: HTMLButtonElement,
    viewerNext: HTMLButtonElement;
  let links: HTMLAnchorElement[] = [];
  let inline: Swiper | undefined, viewer: Swiper | undefined;
  let createViewer: ((index: number) => Swiper) | undefined;
  let speed = 0;
  let disposed = false;

  onMount(() => {
    const unsubscribe = subscribeMotion((state) => {
      speed = state.paused ? 0 : 250;
      if (inline) inline.params.speed = speed;
      if (viewer) viewer.params.speed = speed;
    });
    async function initialize() {
      const a11y = {
        slideLabelMessage: `{{index}} ${labels.of} {{slidesLength}}`,
        containerRoleDescriptionMessage: labels.title,
        scrollOnFocus: false,
        wrapperLiveRegion: false,
      };
      ready = true;
      await tick();
      if (disposed) return;
      inline = new Swiper(inlineElement, {
        modules: [A11y],
        a11y,
        speed,
        slidesPerView: 1,
        spaceBetween: 16,
        on: {
          slideChange: (swiper) => {
            pageIndex = swiper.activeIndex;
          },
        },
      });
      createViewer = (index) =>
        new Swiper(viewerElement, {
          modules: [A11y, Zoom],
          a11y,
          speed,
          slidesPerView: 1,
          spaceBetween: 16,
          initialSlide: index,
          zoom: { maxRatio: 4, limitToOriginalSize: true },
          on: {
            slideChange: (swiper) => {
              viewerIndex = swiper.activeIndex;
            },
            zoomChange: (_, scale) => {
              zoomed = scale > 1;
            },
          },
        });
    }
    void initialize();
    return () => {
      disposed = true;
      unsubscribe();
      if (dialog.open) dialog.close();
      viewer?.destroy(true, true);
      inline?.destroy(true, true);
    };
  });

  async function open(event: MouseEvent, index: number) {
    if (
      !ready ||
      !createViewer ||
      !inline?.allowClick ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      !dialog.showModal
    )
      return;
    event.preventDefault();
    viewerIndex = index;
    showing = true;
    dialog.showModal();
    await tick();
    if (disposed) return;
    viewer ??= createViewer(index);
    viewer.update();
    viewer.slideTo(index, 0);
    closeButton.focus();
  }
  async function closed() {
    showing = false;
    if (disposed) return;
    viewer?.zoom.out();
    zoomed = false;
    inline?.slideTo(viewerIndex, 0);
    await tick();
    if (!disposed) links[pageIndex]?.focus({ preventScroll: true });
  }
  async function move(direction: number) {
    const focused = document.activeElement;
    const swiper = showing ? viewer : inline;
    if (direction > 0) swiper?.slideNext();
    else swiper?.slidePrev();
    await tick();
    if (disposed) return;
    if (focused instanceof HTMLButtonElement && focused.disabled) {
      const controls = showing
        ? [viewerPrevious, viewerNext, zoomButton, closeButton]
        : [inlinePrevious, inlineNext];
      controls
        .find((button) => !button.disabled && !button.hidden)
        ?.focus({ preventScroll: true });
    } else if (!showing && links.includes(focused as HTMLAnchorElement))
      links[pageIndex]?.focus({ preventScroll: true });
  }
  function keydown(event: KeyboardEvent) {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      !(event.target instanceof Node) ||
      !root.contains(event.target)
    )
      return;
    if (showing && event.key === "Tab") {
      const controls = [
        viewerPrevious,
        viewerNext,
        zoomButton,
        closeButton,
      ].filter((button) => !button.disabled && !button.hidden);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      void move(event.key === "ArrowRight" ? 1 : -1);
    }
  }
  function backdrop(event: MouseEvent) {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
</script>

<svelte:document onkeydown={keydown} />
{#snippet arrow(previous = false)}
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    class:gallery-arrow-previous={previous}><path d="m9 5 7 7-7 7" /></svg
  >
{/snippet}
<div
  bind:this={root}
  class="project-gallery-content block min-w-0"
  data-gallery-ready={ready || undefined}
>
  <div
    bind:this={inlineElement}
    class="swiper gallery-inline"
    data-gallery-inline
  >
    <div class="swiper-wrapper">
      {#each images as item, index}
        <figure class="swiper-slide" inert={ready && index !== pageIndex}>
          <a
            bind:this={links[index]}
            href={item.image}
            data-gallery-item
            aria-label={`${labels.open}: ${item.alt}`}
            onclick={(event) => open(event, index)}
          >
            <img
              src={item.image}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading="lazy"
              decoding="async"
            />
          </a>
          {#if item.caption}<figcaption>{item.caption}</figcaption>{/if}
        </figure>
      {/each}
    </div>
  </div>
  <div
    class="gallery-controls mt-4 flex min-w-0 items-center justify-between gap-2"
    data-gallery-controls
    hidden={!ready || images.length < 2}
  >
    <span data-gallery-counter aria-live="polite" aria-atomic="true"
      >{pageIndex + 1} {labels.of} {images.length}</span
    >
    <div class="gallery-actions flex gap-1.5">
      <button
        bind:this={inlinePrevious}
        type="button"
        data-inline-previous
        aria-label={labels.previous}
        disabled={pageIndex === 0}
        onclick={() => move(-1)}>{@render arrow(true)}</button
      >
      <button
        bind:this={inlineNext}
        type="button"
        data-inline-next
        aria-label={labels.next}
        disabled={pageIndex === images.length - 1}
        onclick={() => move(1)}>{@render arrow()}</button
      >
    </div>
  </div>
  <dialog
    bind:this={dialog}
    data-gallery-dialog
    aria-label={labels.title}
    onclose={closed}
    onclick={backdrop}
  >
    <div class="gallery-viewer">
      <div
        class="gallery-controls flex min-w-0 items-center justify-between gap-2"
      >
        <span data-viewer-counter aria-live="polite" aria-atomic="true"
          >{viewerIndex + 1} {labels.of} {images.length}</span
        >
        <div class="gallery-actions flex gap-1.5">
          <button
            bind:this={viewerPrevious}
            type="button"
            data-viewer-previous
            aria-label={labels.previous}
            hidden={images.length < 2}
            disabled={viewerIndex === 0}
            onclick={() => move(-1)}>{@render arrow(true)}</button
          >
          <button
            bind:this={viewerNext}
            type="button"
            data-viewer-next
            aria-label={labels.next}
            hidden={images.length < 2}
            disabled={viewerIndex === images.length - 1}
            onclick={() => move(1)}>{@render arrow()}</button
          >
          <button
            bind:this={zoomButton}
            type="button"
            data-gallery-zoom
            aria-label={zoomed ? labels.zoomOut : labels.zoomIn}
            aria-pressed={zoomed}
            onclick={() => viewer?.zoom.toggle()}
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              ><circle cx="10" cy="10" r="6" /><path
                d="m15 15 6 6M7 10h6"
              />{#if !zoomed}<path d="M10 7v6" />{/if}</svg
            >
          </button>
          <button
            bind:this={closeButton}
            type="button"
            data-gallery-close
            aria-label={labels.close}
            onclick={() => dialog.close()}
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"><path d="m6 6 12 12M18 6 6 18" /></svg
            >
          </button>
        </div>
      </div>
      <figure class="gallery-viewer-figure flex min-h-0 flex-1 flex-col">
        <div
          bind:this={viewerElement}
          class="swiper gallery-fullscreen"
          data-gallery-viewer
        >
          <div class="swiper-wrapper">
            {#each images as item, index}
              <div class="swiper-slide" inert={index !== viewerIndex}>
                <div class="swiper-zoom-container">
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            {/each}
          </div>
        </div>
        <!-- Keep captions outside Swiper so they do not change zoom/pan bounds. -->
        {#if images[viewerIndex]?.caption}<figcaption data-viewer-caption>
            {images[viewerIndex].caption}
          </figcaption>{/if}
      </figure>
    </div>
  </dialog>
</div>

<style>
  .gallery-inline {
    overflow: hidden;
    border-radius: 0.5rem;
  }
  .gallery-inline .swiper-wrapper {
    align-items: flex-start;
  }
  .gallery-inline .swiper-slide {
    height: auto;
  }
  figure {
    margin: 0;
    min-width: 0;
  }
  .gallery-inline a {
    display: block;
    aspect-ratio: 4 / 3;
    border-radius: 0.5rem;
    background: #0d1420;
  }
  .gallery-inline a:focus-visible {
    outline-offset: -3px;
  }
  .gallery-inline img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 0.5rem;
  }
  figcaption {
    margin-top: 0.75rem;
    color: #c8c8c3;
    font-size: 0.875rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
    text-wrap: pretty;
  }
  .gallery-controls > span {
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
  }
  .gallery-actions button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid #ffffff24;
    background: #ffffff05;
    color: #dfe5ec;
    cursor: pointer;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }
  .gallery-actions button:hover:not(:disabled) {
    background: #ffffff12;
    border-color: #ffffff55;
  }
  .gallery-actions button:disabled {
    opacity: 0.35;
    cursor: default;
  }
  .gallery-arrow-previous {
    transform: rotate(180deg);
  }
  [hidden] {
    display: none !important;
  }
  dialog {
    width: min(76rem, calc(100vw - 2rem));
    max-width: none;
    max-height: calc(100dvh - 2rem);
    margin: auto;
    padding: 1rem;
    border: 1px solid #ffffff30;
    border-radius: 0.75rem;
    color: #dfe5ec;
    background: #0c141e;
    overscroll-behavior: contain;
  }
  dialog::backdrop {
    background: #03070ce8;
  }
  :global(html:has(dialog[data-gallery-dialog][open])) {
    overflow: hidden;
  }
  .gallery-viewer {
    height: min(48rem, calc(100dvh - 4rem - 2px));
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .gallery-fullscreen {
    flex: 1;
    width: 100%;
    min-height: 0;
  }
  .gallery-fullscreen .swiper-slide {
    height: 100%;
    overflow: hidden;
  }
  /* This container moves during panning; clip only the stationary slide. */
  .gallery-fullscreen .swiper-zoom-container {
    width: 100%;
    height: 100%;
  }
  .gallery-fullscreen img {
    object-fit: contain;
  }
  .gallery-fullscreen :global(.swiper-slide-zoomed) {
    cursor: grab;
  }
  .gallery-fullscreen :global(.swiper-slide-zoomed):active {
    cursor: grabbing;
  }
  .gallery-viewer-figure > figcaption {
    flex-shrink: 0;
    margin-bottom: 0.25rem;
  }
  @media (max-width: 639px) {
    .gallery-viewer {
      height: min(28rem, calc(100dvh - 4rem - 2px));
    }
  }
  .project-gallery-content:not([data-gallery-ready])
    .gallery-inline
    .swiper-wrapper {
    display: grid;
    height: auto;
    gap: 1.5rem;
  }
</style>
