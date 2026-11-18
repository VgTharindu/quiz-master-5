import { useEffect, useState } from "react";
import MonthPicker, { currentMonth } from "@/components/MonthPicker";
import { GRADES } from "@/constants/grades";
import TeacherTestCard from "../TeacherTestCard";
import { fetchMonthTests } from "../reports/reportData";

// Month + grade filtered list of every test; opens the detail page at `tab`.
export default function MonthTestList({ tab, onOpen }) {
  const [period, setPeriod] = useState(currentMonth);
  const [grade, setGrade] = useState(0); // 0 = all grades
  const [tests, setTests] = useState(null);

  useEffect(() => {
    setTests(null);
    fetchMonthTests({ grade: grade || null, ...period })
      .then(setTests)
      .catch(() => setTests([]));
  }, [period, grade]);

  return (
    <>
      <div className="t-filters">
        <select value={grade} onChange={(e) => setGrade(+e.target.value)}>
          <option value={0}>සියලු පන්ති</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g} වසර
            </option>
          ))}
        </select>
        <MonthPicker {...period} onChange={setPeriod} />
      </div>
      {tests === null && <p>රැඳී සිටින්න…</p>}
      {tests && !tests.length && <p>මෙම මාසයේ පරීක්ෂණ නැත.</p>}
      {tests && tests.length > 0 && <p className="t-hint">පරීක්ෂණ {tests.length}ක්. බැලීමට ඔබන්න.</p>}
      {tests?.map((t) => (
        <TeacherTestCard key={t.id} test={t} onOpen={(test) => onOpen(test, tab)} />
      ))}
    </>
  );
}
