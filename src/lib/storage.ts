export function loadJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private mode; the app remains usable without persistence.
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
}

export const storageKeys = {
  settings: "cnxh-v1:settings",
  exam: "cnxh-v1:exam:active",
  practice: (sourceId: string, chapterId: string) => `cnxh-v1:practice:${sourceId}:${chapterId}`
};
