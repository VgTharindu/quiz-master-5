import { useEffect, useRef } from "react";

// The app has no URL routes, so the phone's back button would leave the site.
// While any handler is active one extra history entry is kept; pressing back
// removes it and runs the handler with the highest priority (the newest one on a tie).
const handlers = [];

function topHandler() {
  let top = null;
  for (const h of handlers) if (!top || h.priority >= top.priority) top = h;
  return top;
}
let armed = false;

function arm() {
  if (armed) return;
  history.pushState({ qmBack: true }, "");
  armed = true;
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    armed = false;
    topHandler()?.run.current();
    // Re-arm after React has applied the handler's state change.
    setTimeout(() => handlers.length && arm(), 60);
  });
}

// priority: 0 = leave a whole section, 1 = close an inner page, 2 = guard a running test.
export function useBackHandler(enabled, onBack, priority = 0) {
  const run = useRef(onBack);
  run.current = onBack;
  useEffect(() => {
    if (!enabled) return;
    const entry = { run, priority };
    handlers.push(entry);
    arm();
    return () => {
      handlers.splice(handlers.indexOf(entry), 1);
    };
  }, [enabled, priority]);
}
