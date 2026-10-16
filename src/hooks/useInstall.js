import { useSyncExternalStore } from "react";
let pending = null;
const listeners = new Set();
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  pending = event;
  listeners.forEach((fn) => fn());
});
window.addEventListener("appinstalled", () => {
  pending = null;
  listeners.forEach((fn) => fn());
});
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export function useInstall() {
  const event = useSyncExternalStore(
    subscribe,
    () => pending,
    () => null
  );
  return {
    available: Boolean(event),
    install: async () => {
      await event?.prompt();
      pending = null;
      listeners.forEach((fn) => fn());
    },
  };
}
