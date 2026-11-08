export interface MotionState {
  enabled: boolean;
  paused: boolean;
  reduced: boolean;
}
const storageKey = "portfolio-motion-paused";
const subscribers = new Set<(state: MotionState) => void>();
let state: MotionState = { enabled: false, paused: true, reduced: false };
let initialized = false;
let userPaused = false;
let preference: MediaQueryList;
function applyMotion() {
  state = {
    enabled: !userPaused && !preference.matches,
    paused: userPaused || preference.matches || document.hidden,
    reduced: preference.matches,
  };
  document.documentElement.dataset.motion = state.paused ? "paused" : "running";
  subscribers.forEach((listener) => listener(state));
  document.dispatchEvent(new CustomEvent("portfolio:motion-change"));
}
export function initializeMotion() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  try {
    userPaused = localStorage.getItem(storageKey) === "true";
  } catch {
    /* Storage is optional. */
  }
  preference.addEventListener("change", applyMotion);
  document.addEventListener("visibilitychange", applyMotion);
  document.addEventListener("astro:page-load", applyMotion);
  document.addEventListener("astro:before-swap", (event) => {
    const { newDocument } = event as Event & { newDocument: Document };
    newDocument.documentElement.dataset.motion =
      userPaused || preference.matches ? "paused" : "running";
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    userPaused = event.newValue === "true";
    applyMotion();
  });
  applyMotion();
}
export function subscribeMotion(listener: (state: MotionState) => void) {
  initializeMotion();
  subscribers.add(listener);
  listener(state);
  return () => {
    subscribers.delete(listener);
  };
}
export function toggleMotion() {
  initializeMotion();
  if (preference.matches) return;
  userPaused = !userPaused;
  try {
    localStorage.setItem(storageKey, String(userPaused));
  } catch {
    /* Keep the in-memory choice. */
  }
  applyMotion();
}
