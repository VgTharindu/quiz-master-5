import { useCallback, useEffect, useRef, useState } from "react";
import { rpc } from "@/lib/rpc";

const pendingKey = (aid) => "pend_" + aid;

export function loadPendingAnswers(aid) {
  try {
    return JSON.parse(localStorage.getItem(pendingKey(aid)) || "null");
  } catch {
    return null;
  }
}

// Resolves after `ms`, or earlier if the browser comes back online.
const waitForRetry = (ms) =>
  new Promise((resolve) => {
    const done = () => {
      clearTimeout(t);
      window.removeEventListener("online", done);
      resolve();
    };
    const t = setTimeout(done, ms);
    window.addEventListener("online", done);
  });

// status: "saved" | "saving" | "error"
// Sends answers to the server reliably on slow or flaky networks:
//  - one request at a time, so an older save can never overwrite a newer one
//  - only the latest answers are sent when several changes queue up
//  - failures retry with backoff (1s, 2s, 4s ... max 15s) until they succeed
//  - unsent answers are kept in localStorage, so a refresh does not lose them
// status: "saved" | "saving" | "error"
export function useAnswerSaver(aid) {
  const [status, setStatus] = useState("saved");
  const latest = useRef(null);
  const running = useRef(false);
  const waiters = useRef([]);
  const alive = useRef(true);

  const run = useCallback(async () => {
    if (running.current) return; // the active loop will pick up the latest answers
    running.current = true;
    let delay = 1000;
    while (latest.current && alive.current) {
      const ans = latest.current;
      setStatus("saving");
      const res = await rpc("save_answers", { aid, ans }, { retries: 0, timeout: 10000 });
      if (res.error) {
        setStatus("error");
        await waitForRetry(delay);
        delay = Math.min(delay * 2, 15000);
        continue;
      }
      delay = 1000;
      // Only clear if nothing newer arrived while this request was in flight.
      if (latest.current === ans) {
        latest.current = null;
        try {
          localStorage.removeItem(pendingKey(aid));
        } catch {}
      }
    }
    running.current = false;
    if (!latest.current) {
      setStatus("saved");
      waiters.current.splice(0).forEach((resolve) => resolve());
    }
  }, [aid]);

  const save = useCallback(
    (ans) => {
      latest.current = ans;
      try {
        localStorage.setItem(pendingKey(aid), JSON.stringify(ans));
      } catch {}
      run();
    },
    [aid, run],
  );

  const flush = useCallback(() => {
    if (!latest.current && !running.current) return Promise.resolve();
    return new Promise((resolve) => waiters.current.push(resolve));
  }, []);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (status === "saved") return;
    // Warn before closing the tab while answers are still unsent.
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  return { status, save, flush };
}
