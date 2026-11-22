import { useEffect, useState } from "react";
import { rpc } from "@/lib/rpc";
import { computeCoinBoard, nameKey } from "./reportData";

// Map(nameKey -> coins) for a grade. undefined while loading,
// null when coins can't be read at all (reports then show "–").
export function useCoinBoard(grade) {
  const [board, setBoard] = useState(undefined);
  useEffect(() => {
    if (!grade) return setBoard(null);
    setBoard(undefined);
    let alive = true;
    rpc("coin_board", { g: grade }, { retries: 2 })
      .then(({ data, error }) =>
        error || !Array.isArray(data)
          ? computeCoinBoard(grade)
          : new Map(data.map((r) => [nameKey(r.student), r.coins])),
      )
      .catch(() => null)
      .then((map) => alive && setBoard(map));
    return () => {
      alive = false;
    };
  }, [grade]);
  return board;
}
