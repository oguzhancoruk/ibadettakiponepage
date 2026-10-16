import { request } from "./api";
import config from "../config/config";
export const supportsPush = () =>
  window.isSecureContext &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;
const decodeKey = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(
    atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    (char) => char.charCodeAt(0)
  );
};
export async function enablePush(publicKey, preferences, location, language) {
  if (!supportsPush())
    throw new Error(
      "Bu tarayıcı web bildirimlerini desteklemiyor. iPhone’da siteyi ana ekrana ekleyip oradan aç."
    );
  if (
    Notification.permission !== "granted" &&
    (await Notification.requestPermission()) !== "granted"
  )
    throw new Error(
      "Bildirim izni verilmedi. Tarayıcı ayarlarından izin verebilirsin."
    );
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeKey(publicKey),
    }));
  try {
    await request("/web-push/subscription", {
      method: "post",
      jwt: true,
      data: {
        subscription: subscription.toJSON(),
        ...preferences,
        ...location,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language,
      },
    });
  } catch (error) {
    if (!existing) await subscription.unsubscribe();
    throw error;
  }
  return subscription;
}
export async function disablePush() {
  const registration = await navigator.serviceWorker?.getRegistration();
  const subscription = await registration?.pushManager?.getSubscription();
  if (!subscription) return;
  await request("/web-push/subscription", {
    method: "delete",
    jwt: true,
    data: { endpoint: subscription.endpoint },
  });
  await subscription.unsubscribe();
}
export async function revokePushOnLogout(user) {
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    const subscription = await registration?.pushManager?.getSubscription();
    if (!subscription) return;
    // Browser revocation also prevents delivery if the API is unavailable.
    await Promise.allSettled([
      subscription.unsubscribe(),
      fetch(`${config.api_base}/api/web-push/subscription`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
        keepalive: true,
      }),
    ]);
  } catch {
    /* Signing out must work offline. */
  }
}
