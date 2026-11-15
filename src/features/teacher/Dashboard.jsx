import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import TopBar from "@/components/TopBar";
import Tabs from "@/components/Tabs";
import { ENDED, getTestStatus } from "@/constants/testStatus";
import TeacherTestCard from "./TeacherTestCard";
import NewTestForm from "./NewTestForm";
import MonthlyReport from "./MonthlyReport";
import TestDetail from "./test-detail/TestDetail";

export default function Dashboard({ out }) {
  const [tab, setTab] = useState(0);
  const [tests, setTests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");

  const load = () =>
    sb
      .from("tests")
      .select("*")
      .then(({ data }) => setTests(data || []));
  useEffect(() => {
    load();
  }, []);

  if (selected)
    return (
      <TestDetail
        test={selected}
        back={() => {
          setSelected(null);
          load();
        }}
      />
    );

  // en-CA formats dates as YYYY-MM-DD, matching the date input's value.
  const matches = (t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) &&
    (!day || new Date(t.start_at).toLocaleDateString("en-CA") === day);
  const upcoming = tests
    .filter((t) => getTestStatus(t) < ENDED && matches(t))
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
  const past = tests
    .filter((t) => getTestStatus(t) === ENDED && matches(t))
    .sort((a, b) => new Date(b.start_at) - new Date(a.start_at));

  return (
    <div>
      <TopBar
        left="QUIZ MASTER 5 · චාමර සර්"
        right={
          <span onClick={out} style={{ fontSize: 14 }}>
            ඉවත් වන්න
          </span>
        }
      />
      <div className="wrap">
        <Tabs
          items={["ඉදිරි පරීක්ෂණ", "අවසන් පරීක්ෂණ", "මාසික"]}
          active={tab}
          onChange={setTab}
        />
        {tab < 2 && (
          <div className="row">
            <input
              placeholder="🔍 නමෙන් සොයන්න"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>
        )}
        {tab === 0 && (
          <>
            <button
              className={showForm ? "w" : ""}
              style={{ width: "100%" }}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✖ වසන්න" : "➕ නව පරීක්ෂණයක් schedule කරන්න"}
            </button>
            {showForm && (
              <NewTestForm
                done={() => {
                  setShowForm(false);
                  load();
                }}
              />
            )}
            {!upcoming.length && <p>ඉදිරි පරීක්ෂණ නැත.</p>}
            {upcoming.map((t) => (
              <TeacherTestCard key={t.id} test={t} onOpen={setSelected} />
            ))}
          </>
        )}
        {tab === 1 && (
          <>
            {!past.length && <p>අවසන් පරීක්ෂණ නැත.</p>}
            {past.map((t) => (
              <TeacherTestCard key={t.id} test={t} onOpen={setSelected} />
            ))}
          </>
        )}
        {tab === 2 && <MonthlyReport />}
      </div>
    </div>
  );
}
