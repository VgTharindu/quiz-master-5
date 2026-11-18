import { useEffect, useState } from "react";
import { rpc } from "@/lib/rpc";
import GradeSelect from "@/components/GradeSelect";
import MonthPicker, { currentMonth } from "@/components/MonthPicker";
import PdfButton from "@/components/PdfButton";
import { MONTHS, formatDuration } from "@/utils/format";
import { buildStudentMonth, fetchMonthTests, fetchStudentNames, fetchTestsData } from "./reports/reportData";
import { StudentGrowthChart, StudentMonthSheet, studentStats } from "./reports/sheets";
import CoinValue from "./reports/CoinValue";

export default function StudentMonthReport() {
  const [grade, setGrade] = useState(5);
  const [period, setPeriod] = useState(currentMonth);
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);
  const [report, setReport] = useState(null); // { data, coins, grade, year, month }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentNames(grade).then(setNames);
  }, [grade]);

  async function load() {
    if (!name.trim()) return alert("ළමයාගේ නම ලියන්න");
    setLoading(true);
    try {
      const tests = await fetchMonthTests({ grade, ...period });
      const { questions, attempts } = await fetchTestsData(tests.map((t) => t.id));
      const data = buildStudentMonth(name, tests, questions, attempts);
      const coinsRes = await rpc("get_coins", { nm: name, g: grade }, { retries: 1 });
      setReport({ data, coins: coinsRes.error ? null : coinsRes.data, grade, ...period });
    } catch {
      alert("දත්ත ලබාගත නොහැකි විය. නැවත උත්සාහ කරන්න.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="card t-form">
        <label>
          පන්තිය
          <GradeSelect value={grade} onChange={setGrade} />
        </label>
        <label>
          ළමයාගේ නම
          <input list="student-names" placeholder="නම ලියන්න" value={name} onChange={(e) => setName(e.target.value)} />
          <datalist id="student-names">
            {names.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </label>
        <label>
          මාසය
          <MonthPicker {...period} onChange={setPeriod} />
        </label>
        <button style={{ width: "100%" }} disabled={loading} onClick={load}>
          {loading ? "රැඳී සිටින්න…" : "වාර්තාව ගන්න"}
        </button>
      </div>
      {report && <StudentMonthView report={report} />}
    </>
  );
}

function StudentMonthView({ report }) {
  const { data, coins, grade, year, month } = report;
  if (!data.items.length) return <p>මෙම මාසයේ {grade} වසරට පරීක්ෂණ නැත.</p>;
  return (
    <>
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <b style={{ fontSize: 19 }}>{data.displayName}</b>
          <div className="t-hint">
            {year} {MONTHS[month]} · {grade} වසර
          </div>
        </div>
        <CoinValue value={coins} size={24} />
      </div>
      {!data.attended && <p className="warn">මෙම නමින් මේ මාසයේ කිසිම පරීක්ෂණයකට සහභාගී වී නැත. නම නිවැරදිද බලන්න.</p>}
      <div className="stat-grid">
        {studentStats(data).map(([label, value]) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <h2>ලකුණු වර්ධනය (%)</h2>
      <div className="chart-card">
        <StudentGrowthChart data={data} />
      </div>
      <div className="t-actions">
        <PdfButton
          fileName={`Student_${data.displayName}_${year}-${String(month + 1).padStart(2, "0")}`}
          render={() => <StudentMonthSheet grade={grade} year={year} month={month} data={data} coins={coins} />}
        />
      </div>
      <h2>පරීක්ෂණ අනුව ලකුණු</h2>
      {data.items.map((it) => (
        <div key={it.test.id} className={"card month-item" + (it.row ? "" : " absent")}>
          <b>{it.test.name}</b>
          <div className="t-hint">{new Date(it.test.start_at).toLocaleDateString("en-CA")}</div>
          {it.row ? (
            <div className="stat-grid" style={{ marginBottom: 0 }}>
              <div>
                <b>
                  {it.row.score}/{it.report.totalMarks}
                </b>
                <span>ලකුණු ({it.row.pct}%)</span>
              </div>
              <div>
                <b>
                  {it.row.rank}/{it.report.stats.count}
                </b>
                <span>ස්ථානය</span>
              </div>
              <div>
                <b>{formatDuration(it.row.sec)}</b>
                <span>ගතවූ කාලය</span>
              </div>
              <div>
                <b>{formatDuration(it.row.perQ)}</b>
                <span>ප්‍රශ්නයකට</span>
              </div>
            </div>
          ) : (
            <p className="t-hint" style={{ margin: 0 }}>
              සහභාගී වී නැත
            </p>
          )}
        </div>
      ))}
    </>
  );
}
