import { lazy } from "react";

// React.lazy එකට සමානයි, නමුත් slow/නැවතෙන network එකක JS කොටස download වෙන්න බැරි වුණොත්
// තත්පර 1, 2, 3 ක් රැඳී සිට තුන් වතාවක් නැවත උත්සාහ කරනවා
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
