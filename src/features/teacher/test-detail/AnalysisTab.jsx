export default function AnalysisTab({ rows, questions, attempts }) {
  if (!rows.length) return <p>දත්ත නැත.</p>;
  const scores = rows.map((r) => r.ලකුණු);
  const stats = [
    ["සහභාගී", rows.length],
    ["සාමාන්‍ය", (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)],
    ["ඉහළම", Math.max(...scores)],
    ["අඩුම", Math.min(...scores)],
  ];
  return (
    <>
      <div className="row">
        {stats.map(([label, value]) => (
          <div className="card stat" key={label}>
            <b>{value}</b>
            {label}
          </div>
        ))}
      </div>
      <h2>ප්‍රශ්න අනුව නිවැරදි ප්‍රතිශතය</h2>
      {questions.map((q, k) => {
        const correct = attempts.filter((r) => r.answers?.[q.id]?.a === q.correct).length,
          pc = Math.round((correct * 100) / attempts.length);
        return (
          <div className="card" key={q.id}>
            <b>
              {k + 1}. {q.body}
            </b>
            <div className="pb" style={{ margin: "6px 0" }}>
              <div
                style={{
                  width: pc + "%",
                  background: pc >= 70 ? "#16a34a" : pc >= 40 ? "#facc15" : "#dc2626",
                }}
              />
            </div>
            <small>
              {correct} / {attempts.length} දෙනා නිවැරදියි ({pc}%)
            </small>
          </div>
        );
      })}
    </>
  );
}
