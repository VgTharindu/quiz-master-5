import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import NewTestForm from "../NewTestForm";
import TeacherTestCard from "../TeacherTestCard";

// Upcoming and live tests.
export default function ScheduledSection({ onOpen }) {
  const [tests, setTests] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    sb.from("tests")
      .select("*")
      .gt("end_at", new Date().toISOString())
      .order("start_at")
      .then(({ data }) => setTests(data || []));
  }, []);

  // en-CA formats dates as YYYY-MM-DD, matching the date input's value.
  const list = (tests || []).filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      (!day || new Date(t.start_at).toLocaleDateString("en-CA") === day),
  );

  return (
    <>
      <h1 className="t-section-title">ඉදිරි සහ දැනට පවතින පරීක්ෂණ</h1>
      <button className={showForm ? "w" : ""} style={{ width: "100%" }} onClick={() => setShowForm(!showForm)}>
        {showForm ? "✖ වසන්න" : "➕ නව පරීක්ෂණයක් schedule කරන්න"}
      </button>
      {showForm && <NewTestForm done={(test) => onOpen(test, 0)} />}
      <div className="row" style={{ marginTop: 10 }}>
        <input placeholder="🔍 නමෙන් සොයන්න" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
      </div>
      {tests === null && <p>රැඳී සිටින්න…</p>}
      {tests && !list.length && <p>ඉදිරි පරීක්ෂණ නැත.</p>}
      {list.map((t) => (
        <TeacherTestCard key={t.id} test={t} onOpen={(test) => onOpen(test, 0)} />
      ))}
    </>
  );
}
