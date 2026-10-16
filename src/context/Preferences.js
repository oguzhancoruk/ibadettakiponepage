import { useSyncExternalStore } from "react";
import moment from "moment";
import "moment/locale/tr";
import english from "../translations/en.json";
const listeners = new Set();
const normalize = (value) => ({
  language: value?.language === "en" ? "en" : "tr",
  theme: ["light", "dark", "system"].includes(value?.theme)
    ? value.theme
    : "system",
});
let preferences;
try {
  preferences = normalize(JSON.parse(localStorage.getItem("pt-preferences")));
} catch {
  preferences = normalize(null);
}
moment.locale(preferences.language);
const subscribe = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};
export function t(text, values) {
  if (typeof text !== "string") return text;
  const trimmed = text.trim();
  let result =
    preferences.language === "en"
      ? english[text] ||
        (english[trimmed] ? text.replace(trimmed, english[trimmed]) : text)
      : text;
  for (const [key, value] of Object.entries(values || {}))
    result = result.replaceAll(`{${key}}`, String(value));
  return result;
}
export const getPreferences = () => preferences;
export function setPreferences(update) {
  preferences = normalize({ ...preferences, ...update });
  moment.locale(preferences.language);
  try {
    localStorage.setItem("pt-preferences", JSON.stringify(preferences));
  } catch {
    /* Session-only preferences still work. */
  }
  listeners.forEach((callback) => callback());
}
export function usePreferences() {
  return {
    ...useSyncExternalStore(subscribe, getPreferences, getPreferences),
    t,
    setPreferences,
  };
}
window.addEventListener("storage", (event) => {
  if (event.key === "pt-preferences") {
    try {
      preferences = normalize(JSON.parse(event.newValue));
    } catch {
      preferences = normalize(null);
    }
    moment.locale(preferences.language);
    listeners.forEach((callback) => callback());
  }
});
