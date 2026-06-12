import { useEffect, useState } from "react";

export function useClockSeconds(startedAt: number, paused = false): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [paused]);

  return Math.max(0, Math.floor((now - startedAt) / 1000));
}
