import { useEffect } from "react";

// Deterrents only: they stop casual copying and the usual shortcuts, but anything sent to a
// browser can still be read by someone determined. The real protection is on the server
// (correct answers never reach the browser while a test is running).
const BLOCKED_KEYS = new Set(["c", "x", "a", "s", "u", "p"]);
const DEVTOOLS_KEYS = new Set(["i", "j", "c", "k"]);

function isTyping(target) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

function onKeyDown(e) {
  const key = e.key.toLowerCase();
  const mod = e.ctrlKey || e.metaKey;
  const devtools =
    e.key === "F12" || (mod && e.shiftKey && DEVTOOLS_KEYS.has(key)) || (e.metaKey && e.altKey && DEVTOOLS_KEYS.has(key));
  // Copy, cut, select-all, save, view-source and print. Inside the name box copy, cut and
  // select-all still work so a child can fix what they typed.
  const editing = isTyping(e.target) && "cxa".includes(key);
  const shortcut = mod && !e.shiftKey && BLOCKED_KEYS.has(key) && !editing;
  if (devtools || shortcut) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function blockUnlessTyping(e) {
  if (!isTyping(e.target)) e.preventDefault();
}

function blockCopy(e) {
  if (isTyping(e.target)) return;
  e.preventDefault();
  e.clipboardData?.setData("text/plain", "");
}

export function useContentProtection(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const listeners = [
      ["keydown", onKeyDown],
      ["contextmenu", blockUnlessTyping],
      ["copy", blockCopy],
      ["cut", blockCopy],
      ["dragstart", blockUnlessTyping],
      ["selectstart", blockUnlessTyping],
    ];
    listeners.forEach(([type, fn]) => document.addEventListener(type, fn, true));
    document.documentElement.classList.add("qm-protect");
    return () => {
      listeners.forEach(([type, fn]) => document.removeEventListener(type, fn, true));
      document.documentElement.classList.remove("qm-protect");
    };
  }, [enabled]);
}
