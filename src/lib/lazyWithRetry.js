import { lazy } from "react";

// React.lazy with retries: a chunk download that fails on a flaky network is retried
// with a growing delay (1s, 2s, 3s) before the error reaches the ErrorBoundary.
export function lazyWithRetry(load, retries = 3) {
  const attempt = (left, wait) =>
    load().catch((err) => {
      if (left <= 0) throw err;
      return new Promise((res) => setTimeout(res, wait)).then(() =>
        attempt(left - 1, wait + 1000),
      );
    });
  return lazy(() => attempt(retries, 1000));
}
