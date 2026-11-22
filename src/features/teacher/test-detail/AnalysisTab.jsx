import PdfButton from "@/components/PdfButton";
import { formatDuration } from "@/utils/format";
import { coinsLoading } from "../reports/reportData";
import { TestAnalysisSheet } from "../reports/sheets";

const barColor = (pc) => (pc >= 70 ? "#16a34a" : pc >= 40 ? "#facc15" : "#dc2626");

export default function AnalysisTab({ report }) {
  const { test, stats, perQuestion } = report;
  if (!stats.count) return <p>දත්ත නැත.</p>;
  const items = [
    ["සහභාගී", stats.count],
    ["සාමාන්‍ය", `${stats.avg.toFixed(1)} (${Math.round(stats.avgPct)}%)`],
    ["ඉහළම / අඩුම", `${stats.max} / ${stats.min}`],
    ["පේපර් එකකට", formatDuration(stats.avgSec)],
  ];
  return (
    <>
      <div className="t-actions">
        <PdfButton
          waiting={coinsLoading(report.rows) ? "Coins ගණන් කරමින්…" : ""}
          fileName={`Analysis_${test.name}`} render={() => <TestAnalysisSheet report={report} />} />
      </div>
      <div className="stat-grid">
        {items.map(([label, value]) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <h2>ප්‍රශ්න අනුව නිවැරදි ප්‍රතිශතය</h2>
      {perQuestion.map((p, k) => (
        <div className="card" key={p.q.id}>
          <b>
            {k + 1}. {p.q.body}
          </b>
          <div className="pb" style={{ margin: "6px 0" }}>
            <div style={{ width: p.pct + "%", background: barColor(p.pct) }} />
          </div>
          <small>
            {p.correct} / {stats.count} දෙනා නිවැරදියි ({p.pct}%)
            {p.avgSec ? ` · සාමාන්‍ය කාලය ${formatDuration(p.avgSec)}` : ""}
          </small>
        </div>
      ))}
    </>
  );
}
