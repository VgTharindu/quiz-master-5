import { useCallback, useEffect, useState } from "react";
import { rpc } from "@/lib/rpc";

// The server total is cached so the counter shows instantly and works offline.
const cacheKey = (me) => `qm_coins_${me.grade}_${me.name.trim().toLowerCase()}`;

export function readCachedCoins(me) {
  try {
    const v = localStorage.getItem(cacheKey(me));
    return v === null ? null : +v;
  } catch {
    return null;
  }
}

export function writeCachedCoins(me, value) {
  try {
    localStorage.setItem(cacheKey(me), String(value));
  } catch {}
}

// Returns the student's total coins. refresh() resolves to the server total,
// or null when the server can't be reached (or the get_coins migration isn't installed).
// Pass apply=false to read the total without updating the displayed value.
export function useCoins(me) {
  const [coins, setCoins] = useState(() => readCachedCoins(me));

  const refresh = useCallback(async (apply = true) => {
    const res = await rpc("get_coins", { nm: me.name, g: me.grade }, { retries: 2 });
    if (res.error || typeof res.data !== "number") return null;
    if (apply) setCoins(res.data);
    writeCachedCoins(me, res.data);
    return res.data;
  }, [me.name, me.grade]);

  return { coins, setCoins, refresh };
}

// Fetches once on mount; for screens that only display the total.
export function useCoinTotal(me) {
  const { coins, refresh } = useCoins(me);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return coins;
}
