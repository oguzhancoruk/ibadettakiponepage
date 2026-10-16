import { useCallback, useEffect, useRef, useState } from "react";
import { getSession } from "../utils/session";
export function useStoredState(name, initial) {
  const key = `pt:${getSession()?._id || "guest"}:${name}`;
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });
  const current = useRef(value);
  const [error, setError] = useState("");
  const save = useCallback(
    (update) => {
      const next =
        typeof update === "function" ? update(current.current) : update;
      current.current = next;
      try {
        localStorage.setItem(key, JSON.stringify(next));
        setError("");
      } catch {
        setError(
          "Tarayıcı kayıt alanı kullanılamıyor. Bu tercih oturum kapatıldığında kaybolabilir."
        );
      }
      setValue(next);
    },
    [key]
  );
  useEffect(() => {
    const sync = (event) => {
      if (event.key !== key) return;
      try {
        const next =
          event.newValue === null ? initial : JSON.parse(event.newValue);
        current.current = next;
        setValue(next);
      } catch {
        /* Ignore malformed changes from another tab. */
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
    // Initial value is used only when this account's key is removed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [value, save, error];
}
