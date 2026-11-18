import { useState } from "react";
import GradeSelect from "@/components/GradeSelect";
import MonthPicker, { currentMonth } from "@/components/MonthPicker";
import PdfButton from "@/components/PdfButton";
import { MONTHS } from "@/utils/format";
import { calcScore } from "@/utils/score";
import { exportExcel } from "@/utils/excel";
import { coinsOf, fetchMonthTests, fetchTestsData, nameKey } from "./reports/reportData";
import { useCoinBoard } from "./reports/useCoinBoard";
import { MonthlyAverageSheet } from "./reports/sheets";
import CoinValue from "./reports/CoinValue";

// Average marks per student for a month and grade.
export default function MonthlyReport() {
  const [grade, setGrade] = useState(5);
  const [period, setPeriod] = useState(currentMonth);
  const [result, setResult] = useState(null); // { rows, grade, year, month }
  const coinMap = useCoinBoard(grade);

  async function load() {
    const tests = await fetchMonthTests({ grade, ...period });
    if (!tests.length) return setResult({ rows: [], grade, ...period });
    const { questions, attempts } = await fetchTestsData(tests.map((t) => t.id));
    // Students are identified by name only, so group by the lower-cased name.
    const byStudent = new Map();
    attempts.forEach((a) => {
      const k = nameKey(a.student);
      const s = byStudent.get(k) || { name: a.student.trim(), n: 0, sum: 0 };
      s.n++;
      s.sum += calcScore(a, questions);
      byStudent.set(k, s);
    });
    const rows = [...byStudent.values()]
      .map((s) => ({ name: s.name, attended: s.n, total: tests.length, avg: +(s.sum / s.n).toFixed(1) }))
      .sort((a, b) => b.avg - a.avg)
      .map((r, i) => ({ rank: i + 1, ...r }));
    setResult({ rows, grade, ...period });
  }

  const rows = result?.rows.map((r) => ({ ...r, coins: coinsOf(coinMap, r.name) })) || [];

  return (
    <div>
      <div className="card t-form">
        <label>
          පන්තිය
          <GradeSelect value={grade} onChange={setGrade} />
        </label>
        <label>
          මාසය
          <MonthPicker {...period} onChange={setPeriod} />
        </label>
        <button style={{ width: "100%" }} onClick={load}>
          ලැයිස්තුව ගන්න
        </button>
      </div>
      {result &&
        (!rows.length ? (
          <p>මෙම මාසයේ පරීක්ෂණ නැත.</p>
        ) : (
          <>
            <div className="t-actions">
              <PdfButton
                fileName={`Monthly_Grade${result.grade}_${result.year}-${String(result.month + 1).padStart(2, "0")}`}
                render={() => <MonthlyAverageSheet {...result} rows={rows} />}
              />
              <button
                className="g"
                onClick={() =>
                  exportExcel(
                    rows.map((r) => ({
                      ස්ථානය: r.rank,
                      නම: r.name,
                      "සහභාගී වූ පරීක්ෂණ": r.attended,
                      "මුළු පරීක්ෂණ": r.total,
                      "සාමාන්‍ය ලකුණු": r.avg,
                      "රන් කාසි": r.coins ?? "",
                    })),
                    `${MONTHS[result.month]}_${result.year}_${result.grade}වසර`,
                  )
                }
              >
                📥 Excel
              </button>
            </div>
            <ol className="rank-list">
              {rows.map((r) => (
                <li key={r.name} className={"rank-row r" + r.rank}>
                  <span className="rank-badge">{r.rank}</span>
                  <span>
                    <span className="rank-name">{r.name}</span>
                    <span className="rank-meta">
                      {" "}
                      · පරීක්ෂණ {r.attended}/{r.total}
                    </span>
                    <br />
                    <CoinValue value={r.coins} />
                  </span>
                  <span className="rank-score">
                    {r.avg}
                    <small>සාමාන්‍යය</small>
                  </span>
                </li>
              ))}
            </ol>
          </>
        ))}
    </div>
  );
}
