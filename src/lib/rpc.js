import { sb } from "./supabase";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// status 0 means the request never reached the server (offline or timed out).
// Database errors such as "closed" are not retried, because retrying cannot change the result.
export const isNetworkError = (res) =>
  !!res.error && (res.status === 0 || res.status >= 500 || res.status === 408 || res.status === 429);

// sb.rpc() with a timeout and exponential-backoff retries for network errors.
// Returns the same { data, error, status } shape as sb.rpc().
export async function rpc(name, params, { retries = 3, timeout = 15000 } = {}) {
  for (let i = 0; ; i++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    let res;
    try {
      res = await sb.rpc(name, params).abortSignal(ctl.signal);
    } catch (e) {
      res = { data: null, error: { message: String(e) }, status: 0 };
    } finally {
      clearTimeout(timer);
    }
    if (!isNetworkError(res) || i >= retries) return res;
    await sleep(Math.min(1000 * 2 ** i, 8000));
  }
}
