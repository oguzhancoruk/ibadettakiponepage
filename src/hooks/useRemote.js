import { useCallback, useEffect, useRef, useState } from "react";
import { request, errorMessage } from "../services/api";

export function useRemote(path, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const optionsKey = JSON.stringify(options);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError("");
    setLoading(Boolean(path));
    if (path)
      request(path, { ...JSON.parse(optionsKey), signal: controller.signal })
        .then((result) => {
          if (!controller.signal.aborted) setData(result);
        })
        .catch((e) => {
          if (!controller.signal.aborted) setError(errorMessage(e));
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    return () => controller.abort();
  }, [path, optionsKey, revision]);
  return { data, setData, loading, error, refresh };
}

export function useMutation() {
  const locked = useRef(false);
  const active = useRef(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const run = async (key, task, successMessage = "") => {
    if (locked.current) return { ok: false };
    locked.current = true;
    setBusy(key);
    setError("");
    setMessage("");
    try {
      const value = await task();
      if (active.current) setMessage(successMessage);
      return { ok: true, value };
    } catch (e) {
      if (active.current) setError(errorMessage(e));
      return { ok: false };
    } finally {
      locked.current = false;
      if (active.current) setBusy("");
    }
  };
  return { busy, error, message, run, setMessage };
}
