// A random id kept on this phone. The server ties a running test attempt to it, so another
// child typing the same name on a different phone cannot change this child's answers.
const KEY = "qm_device";

export function deviceKey() {
  try {
    let key = localStorage.getItem(KEY);
    if (!key) {
      key = crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(KEY, key);
    }
    return key;
  } catch {
    return null;
  }
}
