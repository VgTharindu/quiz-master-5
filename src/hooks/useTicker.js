import { useEffect, useState } from "react";

// Re-renders the component every `ms` milliseconds to drive countdowns and timers.
export function useTicker(ms) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}
