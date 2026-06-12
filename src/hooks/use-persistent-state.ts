import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { loadJson, saveJson } from "../lib/storage";

export function usePersistentState<T>(
  key: string,
  fallbackFactory: () => T
): [T, Dispatch<SetStateAction<T>>] {
  const [entry, setEntry] = useState(() => ({
    key,
    value: loadJson(key, fallbackFactory())
  }));

  useEffect(() => {
    setEntry({ key, value: loadJson(key, fallbackFactory()) });
  }, [key]);

  useEffect(() => {
    saveJson(entry.key, entry.value);
  }, [entry]);

  const setValue: Dispatch<SetStateAction<T>> = (update) => {
    setEntry((current) => ({
      ...current,
      value: typeof update === "function" ? (update as (value: T) => T)(current.value) : update
    }));
  };

  return [entry.value, setValue];
}
