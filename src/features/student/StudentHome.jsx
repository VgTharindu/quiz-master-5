import { useEffect, useRef, useState } from "react";
import { isNetworkError, rpc } from "@/lib/rpc";
import TopBar from "@/components/TopBar";
import Tabs from "@/components/Tabs";
import { useTicker } from "@/hooks/useTicker";
import StudentTestCard from "./StudentTestCard";

// ළමයාගේ මුල් පිටුව: දැන්/ඉදිරි සහ පසුගිය පරීක්ෂණ ලැයිස්තුව
export default function StudentHome({ me, go, change, exit }) {
  // අන්තිමට ලැබුණ ලැයිස්තුව phone එකේ cache එකේ තියෙනවා නම් ඒක එවෙලේම පෙන්වනවා,
  // ඊට පස්සේ යටින් server එකෙන් අලුත් එක ගන්නවා (slow network එකේ "රැඳී සිටින්න" බලාගෙන ඉන්න ඕන නැහැ)
  const [cached] = useState(() => readCache(me.grade)); // පළමු render එකේදී විතරක් කියවනවා
  const [tests, setTests] = useState(cached?.tests || []);
  const [tab, setTab] = useState(0);
  // server එකේ වෙලාව සහ phone එකේ වෙලාව අතර වෙනස (ms)
  const offset = useRef(cached?.offset || 0);
  useTicker(1000); // countdown එක තත්පරයෙන් තත්පරයට යාවත්කාලීන වෙන්න

  const load = () =>
    rpc("list_tests", { g: me.grade }).then(({ data, error }) => {
      if (error) return; // network නැත්නම් cache එකේ තියෙන ලැයිස්තුවම පෙන්වනවා
      if (data?.length) offset.current = new Date(data[0].now_ts) - Date.now();
      setTests(data || []);
      writeCache(me.grade, { tests: data || [], offset: offset.current });
    });
  useEffect(() => {
    load();
    // තත්පර 30කට වරක් ලැයිස්තුව අලුත් කරනවා. app එක පසුබිමේ (වෙනත් app එකක්) තියෙද්දී data නාස්ති නොකරන්න නවත්වනවා
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, 30000);
    // app එකට ආපහු ආපු ගමන් අලුත් කරනවා
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

  // page = "test" හෝ "result". attempt එක හදලා (හෝ තිබුණ එක අරන්) ඒ පිටුවට යනවා
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
    <div>
      <TopBar
        left={`👤 ${me.name} · ${me.grade} වසර`}
        right={
          <span onClick={exit} style={{ fontSize: 14 }}>
            ඉවත් වන්න
          </span>
        }
      />
      <div className="wrap">
        <Tabs
          items={["දැන් සහ ඉදිරි පරීක්ෂණ", "පසුගිය පරීක්ෂණ"]}
          active={tab}
          onChange={setTab}
        />
        {!list.length && (
          <p>{tab ? "පසුගිය පරීක්ෂණ නැත." : "දැනට පරීක්ෂණ නැත."}</p>
        )}
        {list.map((t) => (
          <StudentTestCard key={t.id} test={t} now={now} onOpen={open} />
        ))}
        <button
          className="w"
          onClick={change}
          style={{ width: "100%", marginTop: 10 }}
        >
          නම / පන්තිය වෙනස් කරන්න
        </button>
      </div>
    </div>
  );
}

// පන්තිය අනුව පරීක්ෂණ ලැයිස්තුවේ cache එක (localStorage)
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
