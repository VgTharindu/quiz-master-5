import { useEffect, useRef, useState } from "react";
import { sb } from "@/lib/supabase";
import TopBar from "@/components/TopBar";
import Tabs from "@/components/Tabs";
import { useTicker } from "@/hooks/useTicker";
import StudentTestCard from "./StudentTestCard";

// ළමයාගේ මුල් පිටුව: දැන්/ඉදිරි සහ පසුගිය පරීක්ෂණ ලැයිස්තුව
export default function StudentHome({ me, go, change, exit }) {
  const [tests, setTests] = useState([]);
  const [tab, setTab] = useState(0);
  // server එකේ වෙලාව සහ phone එකේ වෙලාව අතර වෙනස (ms)
  const offset = useRef(0);
  useTicker(1000); // countdown එක තත්පරයෙන් තත්පරයට යාවත්කාලීන වෙන්න

  const load = () =>
    sb.rpc("list_tests", { g: me.grade }).then(({ data }) => {
      if (data?.length) offset.current = new Date(data[0].now_ts) - Date.now();
      setTests(data || []);
    });
  useEffect(() => {
    load();
    const id = setInterval(load, 30000); // තත්පර 30කට වරක් ලැයිස්තුව අලුත් කරනවා
    return () => clearInterval(id);
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
    const { data, error } = await sb.rpc("start_attempt", {
      tid: test.id,
      nm: me.name,
      g: me.grade,
    });
    error ? alert("ඔබ මෙම පරීක්ෂණයට සහභාගී වී නැත") : go({ page, aid: data });
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
