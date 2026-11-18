import { useEffect, useState } from "react";
import { rpc } from "@/lib/rpc";
import { nameKey } from "./reportData";

// Map(nameKey -> coins) for a grade, or null while loading or when the
// coin_board migration has not been installed (reports then show "–").
export function useCoinBoard(grade) {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    if (!grade) return setBoard(null);
    let alive = true;
    rpc("coin_board", { g: grade }, { retries: 2 }).then(({ data, error }) => {
      if (!alive) return;
      setBoard(error || !Array.isArray(data) ? null : new Map(data.map((r) => [nameKey(r.student), r.coins])));
    });
    return () => {
      alive = false;
    };
  }, [grade]);
  return board;
}
