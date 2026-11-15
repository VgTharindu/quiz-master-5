import { useCallback, useEffect, useRef, useState } from "react";
import { rpc } from "@/lib/rpc";

// තවම server එකට යන්නේ නැති පිළිතුරු phone එකේ (localStorage) තියාගන්නා key එක
const pendingKey = (aid) => "pend_" + aid;

// කලින් යවන්න බැරි වුණ පිළිතුරු තියෙනවා නම් ඒවා ගන්නවා (උදා: offline වෙලා page එක refresh කළොත්)
export function loadPendingAnswers(aid) {
  try {
    return JSON.parse(localStorage.getItem(pendingKey(aid)) || "null");
  } catch {
    return null;
  }
}

// ms ප්‍රමාණයක් රැඳී සිටිනවා. ඒ අතරතුර internet ආපහු ආවොත් එවෙලේම නවතිනවා
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

// ළමයාගේ පිළිතුරු server එකට යවන queue එක.
//  - එකවර යවන්නේ එක request එකක් විතරයි. ඒ නිසා පරණ පිළිතුරු අලුත් ඒවා උඩින් ලියවෙන්නේ නැහැ
//  - යවන අතරතුර අලුත් පිළිතුරක් ආවොත්, අන්තිමට යවන්නේ අලුත්ම එක විතරයි
//  - යවන්න බැරි වුණොත් 1s, 2s, 4s ... (උපරිම 15s) පරතරයකින් සාර්ථක වෙනකම් නැවත උත්සාහ කරනවා
//  - යවනකම් පිළිතුරු phone එකේ තියෙන නිසා page එක refresh කළත් නැති වෙන්නේ නැහැ
// status: "saved" | "saving" | "error"
export function useAnswerSaver(aid) {
  const [status, setStatus] = useState("saved");
  const latest = useRef(null); // යවන්න තියෙන අලුත්ම පිළිතුරු (null = යවන්න දෙයක් නැහැ)
  const running = useRef(false);
  const waiters = useRef([]); // flush() එක බලාගෙන ඉන්න අය
  const alive = useRef(true);

  const run = useCallback(async () => {
    if (running.current) return; // දැනටමත් යවමින් නම් ඒ loop එකම අලුත් එකත් යවයි
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
      // යවන අතරතුර අලුත් පිළිතුරක් ආවේ නැත්නම් වැඩේ ඉවරයි
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

  // අලුත් පිළිතුරු queue එකට දානවා
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

  // queue එකේ තියෙන හැම දෙයක්ම server එකට ගිහින් ඉවර වෙනකම් බලාගෙන ඉන්නවා (ඉදිරිපත් කරන්න කලින්)
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

  // යවන්න තියෙද්දී page එක වහන්න ගියොත් browser එක අනතුරු ඇඟවීමක් පෙන්වනවා
  useEffect(() => {
    if (status === "saved") return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  return { status, save, flush };
}
