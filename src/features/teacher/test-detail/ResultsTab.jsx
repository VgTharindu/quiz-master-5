import PdfButton from "@/components/PdfButton";
import { exportExcel } from "@/utils/excel";
import { formatDuration } from "@/utils/format";
import { TestResultSheet } from "../reports/sheets";
import CoinValue from "../reports/CoinValue";

export default function ResultsTab({ report }) {
  const { test, rows, totalMarks } = report;
  if (!rows.length) return <p>තවම කිසිවෙක් සහභාගී වී නැත.</p>;

  const download = () =>
    exportExcel(
      rows.map((r) => ({
        ස්ථානය: r.rank,
        නම: r.name,
        ලකුණු: r.score,
        "මුළු ලකුණු": totalMarks,
        "%": r.pct,
        "මුළු කාලය (තත්පර)": Math.round(r.sec),
        "ප්‍රශ්නයකට සාමාන්‍ය (තත්පර)": Math.round(r.perQ),
        "රන් කාසි": r.coins ?? "",
      })),
      test.name,
    );

  return (
    <>
      <div className="t-actions">
        <PdfButton fileName={`Results_${test.name}`} render={() => <TestResultSheet report={report} />} />
        <button className="g" onClick={download}>
          📥 Excel
        </button>
      </div>
      <ol className="rank-list">
        {rows.map((r, i) => (
          <li key={i} className={"rank-row r" + r.rank}>
            <span className="rank-badge">{r.rank}</span>
            <span>
              <span className="rank-name">{r.name}</span>
              <br />
              <span className="rank-meta">
                ⏱ {formatDuration(r.sec)} · ප්‍රශ්නයකට {formatDuration(r.perQ)}
              </span>
              <br />
              <CoinValue value={r.coins} />
            </span>
            <span className="rank-score">
              {r.score}/{totalMarks}
              <small>{r.pct}%</small>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
