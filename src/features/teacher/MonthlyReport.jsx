import { useState } from "react";
import { sb } from "@/lib/supabase";
import GradeSelect from "@/components/GradeSelect";
import { MONTHS } from "@/utils/format";
import { calcScore } from "@/utils/score";
import { exportExcel } from "@/utils/excel";

// තෝරපු මාසයේ සහ පන්තියේ ළමුන්ගේ සාමාන්‍ය ලකුණු ලැයිස්තුව
export default function MonthlyReport() {
  const now = new Date();
  const [grade, setGrade] = useState(5);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [rows, setRows] = useState(null); // null = තාම ගත්තේ නැහැ

  async function load() {
    const from = new Date(year, month, 1),
      to = new Date(year, month + 1, 1);
    const { data: tests } = await sb
      .from("tests")
      .select("id")
      .eq("grade", grade)
      .gte("start_at", from.toISOString())
      .lt("start_at", to.toISOString());
    const ids = (tests || []).map((x) => x.id);
    if (!ids.length) return setRows([]);
    const [attempts, questions] = await Promise.all([
      sb.from("attempts").select("*").in("test_id", ids),
      sb.from("questions").select("*").in("test_id", ids),
    ]);
    // ළමයාගේ නම (simple අකුරෙන්) key එක ලෙස අරන් ලකුණු එකතු කරනවා
    const byStudent = {};
    attempts.data.forEach((r) => {
      const k = r.student.toLowerCase();
      byStudent[k] = byStudent[k] || { නම: r.student, n: 0, s: 0 };
      byStudent[k].n++;
      byStudent[k].s += calcScore(r, questions.data);
    });
    setRows(
      Object.values(byStudent)
        .map((x) => ({
          නම: x.නම,
          "සහභාගී වූ පරීක්ෂණ": x.n,
          "මුළු පරීක්ෂණ": ids.length,
          "සාමාන්‍ය ලකුණු": +(x.s / x.n).toFixed(1),
        }))
        .sort((a, b) => b["සාමාන්‍ය ලකුණු"] - a["සාමාන්‍ය ලකුණු"])
        .map((r, i) => ({ ස්ථානය: i + 1, ...r })),
    );
  }

  return (
    <div>
      <h2>මාසික සාමාන්‍යය</h2>
      <div className="row">
        <GradeSelect value={grade} onChange={setGrade} />
        <select value={year} onChange={(e) => setYear(+e.target.value)}>
          {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </select>
        <select value={month} onChange={(e) => setMonth(+e.target.value)}>
          {MONTHS.map((x, i) => (
            <option key={i} value={i}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <button onClick={load}>ලැයිස්තුව ගන්න</button>
      {rows &&
        (!rows.length ? (
          <p>මෙම මාසයේ පරීක්ෂණ නැත.</p>
        ) : (
          <>
            <button
              className="g"
              style={{ marginLeft: 8 }}
              onClick={() => exportExcel(rows, `${MONTHS[month]}_${year}_${grade}වසර`)}
            >
              📥 Excel
            </button>
            <div style={{ overflowX: "auto", marginTop: 10 }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>නම</th>
                    <th>පරීක්ෂණ</th>
                    <th>සාමාන්‍යය</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.නම}>
                      <td>{r.ස්ථානය}</td>
                      <td>{r.නම}</td>
                      <td>
                        {r["සහභාගී වූ පරීක්ෂණ"]}/{r["මුළු පරීක්ෂණ"]}
                      </td>
                      <td>{r["සාමාන්‍ය ලකුණු"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))}
    </div>
  );
}
