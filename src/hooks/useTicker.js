import { useEffect, useState } from "react";

// ms වලින් වරක් component එක නැවත render කරනවා (countdown/timer යාවත්කාලීන කරන්න)
export function useTicker(ms) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}
