import { sb } from "./supabase";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// network එකේ ගැටලුවක්ද? status 0 = request එක server එකට ගියේම නැහැ (internet නැති වීම / timeout).
// 5xx = server එකේ තාවකාලික දෝෂයක්. 408/429 = timeout / ඕනවට වඩා requests.
// "closed", "not yet" වගේ database එකෙන් එන දෝෂ නැවත උත්සාහ කළාට වෙනස් වෙන්නේ නැති නිසා retry කරන්නේ නැහැ
export const isNetworkError = (res) =>
  !!res.error && (res.status === 0 || res.status >= 500 || res.status === 408 || res.status === 429);

// sb.rpc() වගේමයි, නමුත්:
//  - timeout එකක් තියෙනවා (slow network එකක request එකක් සදාකාලිකව එල්ලිලා තියෙන්නේ නැහැ)
//  - network දෝෂයක් නම් 1s, 2s, 4s ... ලෙස රැඳී සිට නැවත උත්සාහ කරනවා
// return කරන්නේ sb.rpc() දෙන { data, error, status } object එකමයි
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
