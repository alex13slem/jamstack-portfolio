const storageKey = "portfolio-motion-paused";
const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactControl = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 640px)");
let revealTimer: number | undefined;
let revealedButton: HTMLButtonElement | undefined;
let userPaused = false;
try { userPaused = localStorage.getItem(storageKey) === "true"; } catch { /* Storage is optional. */ }

function clearReveal() {
  window.clearTimeout(revealTimer);
  revealedButton?.removeAttribute("data-reveal");
  revealedButton = undefined;
}

function showFeedback(button: HTMLButtonElement) {
  clearReveal();
  if (!compactControl.matches) return;
  revealedButton = button;
  button.dataset.reveal = "true";
  revealTimer = window.setTimeout(clearReveal, 2000);
}

function applyMotion() {
  const paused = userPaused || preference.matches || document.hidden;
  document.documentElement.dataset.motion = paused ? "paused" : "running";
  document.querySelectorAll<HTMLButtonElement>("[data-motion-toggle]").forEach((button) => {
    const enabled = !userPaused && !preference.matches;
    button.hidden = false;
    button.disabled = preference.matches;
    button.setAttribute("aria-checked", String(enabled));
    const status = button.querySelector<HTMLElement>("[data-motion-status]");
    if (status) status.textContent = (enabled ? button.dataset.onLabel : button.dataset.offLabel) ?? "";
    if (preference.matches) button.title = button.dataset.reducedLabel ?? "";
    else button.removeAttribute("title");
  });
  document.dispatchEvent(new CustomEvent("portfolio:motion-change"));
}

document.addEventListener("click", (event) => {
  const button = event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>("[data-motion-toggle]") : null;
  if (!button || button.disabled) return;
  userPaused = !userPaused;
  try { localStorage.setItem(storageKey, String(userPaused)); } catch { /* Keep the in-memory choice. */ }
  applyMotion();
  showFeedback(button);
});
preference.addEventListener("change", applyMotion);
compactControl.addEventListener("change", clearReveal);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearReveal();
  applyMotion();
});
document.addEventListener("astro:page-load", applyMotion);
document.addEventListener("astro:before-swap", (event) => {
  clearReveal();
  // Carry the preference into the next document before its effects can start.
  const { newDocument } = event as Event & { newDocument: Document };
  newDocument.documentElement.dataset.motion = userPaused || preference.matches ? "paused" : "running";
});
window.addEventListener("storage", (event) => {
  if (event.key !== storageKey && event.key !== null) return;
  userPaused = event.newValue === "true";
  applyMotion();
});
applyMotion();
