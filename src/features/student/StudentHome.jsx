import { useEffect, useRef, useState } from "react";
import { isNetworkError, rpc } from "@/lib/rpc";
import { useTicker } from "@/hooks/useTicker";
import StudentTestCard from "./StudentTestCard";
import StudentHeader from "./ui/StudentHeader";
import { CheerBanner } from "./ui/Decor";
import { PetsMeadow, ReadingOwl } from "./ui/illustrations";
import Art from "./ui/Art";
import { CalendarCheckIcon, CheckBadge, TrophyIcon } from "./ui/icons";
import { useCoinTotal } from "@/features/coins/useCoins";

const TABS = [
  ["දැන් සහ ඉදිරි පරීක්ෂණ", <TrophyIcon size={34} />],
  ["පසුගිය පරීක්ෂණ", <CalendarCheckIcon size={34} />],
];

export default function StudentHome({ me, go, change, exit }) {
  // Stale-while-revalidate: show the last cached list immediately, then refresh in the background.
  const [cached] = useState(() => readCache(me.grade));
  const [tests, setTests] = useState(cached?.tests || []);
  const [tab, setTab] = useState(0);
  const offset = useRef(cached?.offset || 0); // server time minus device time (ms)
  const coins = useCoinTotal(me);
  useTicker(1000);

  const load = () =>
    rpc("list_tests", { g: me.grade }).then(({ data, error }) => {
      if (error) return; // keep showing the cached list while offline
      if (data?.length) offset.current = new Date(data[0].now_ts) - Date.now();
      setTests(data || []);
      writeCache(me.grade, { tests: data || [], offset: offset.current });
    });
  useEffect(() => {
    load();
    // Poll every 30s, but skip while the app is in the background to save mobile data.
    // Refresh immediately when the student comes back or reconnects.
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, 30000);
    const onVisible = () => !document.hidden && load();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", load);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", load);
    };
  }, []);

  const now = Date.now() + offset.current;
  const upcoming = tests
    .filter((t) => new Date(t.end_at) > now)
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
  const past = tests
    .filter((t) => new Date(t.end_at) <= now)
    .sort((a, b) => new Date(b.end_at) - new Date(a.end_at));
  const list = tab ? past : upcoming;

  async function open(test, page) {
    const res = await rpc("start_attempt", {
      tid: test.id,
      nm: me.name,
      g: me.grade,
    });
    if (!res.error) return go({ page, aid: res.data });
    alert(
      isNetworkError(res)
        ? "සම්බන්ධතාවය දුර්වලයි. Internet පරීක්ෂා කර නැවත උත්සාහ කරන්න."
        : "ඔබ මෙම පරීක්ෂණයට සහභාගී වී නැත",
    );
  }

  return (
    <div className="st-bg aqua">
      <StudentHeader me={me} coins={coins} onExit={exit} />
      <div className="st-page">
        <div className="st-tabs" role="tablist">
          {TABS.map(([label, icon], i) => (
            <button
              key={label}
              role="tab"
              aria-selected={tab === i}
              className={"st-tab" + (tab === i ? " on" : "")}
              onClick={() => setTab(i)}
            >
              {tab === i && (
                <span className="st-tab-check">
                  <CheckBadge size={26} />
                </span>
              )}
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
        {!list.length && (
          <div className="st-empty owl">
            <Art name="owl" size={92} fallback={<ReadingOwl size={92} />} />
            <p>{tab ? "පසුගිය පරීක්ෂණ තවම නැහැ." : "දැනට පරීක්ෂණ නැහැ. සර් අලුත් පරීක්ෂණයක් දාපු ගමන් මෙතන පෙනෙයි!"}</p>
          </div>
        )}
        {list.map((t, i) => (
          <StudentTestCard key={t.id} test={t} index={i} now={now} onOpen={open} />
        ))}
        <button className="st-cta purple" onClick={change}>
          නම / පන්තිය වෙනස් කරන්න
        </button>
      </div>
      <PetsMeadow />
      <CheerBanner />
    </div>
  );
}

const cacheKey = (grade) => "qm_tests_" + grade;
function readCache(grade) {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(grade)) || "null");
  } catch {
    return null;
  }
}
function writeCache(grade, value) {
  try {
    localStorage.setItem(cacheKey(grade), JSON.stringify(value));
  } catch {}
}
