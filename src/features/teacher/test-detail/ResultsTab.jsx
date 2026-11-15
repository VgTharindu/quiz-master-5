import { exportExcel } from "@/utils/excel";
import { formatDuration } from "@/utils/format";

export default function ResultsTab({ test, rows, totalMarks, questionCount }) {
  if (!rows.length) return <p>තවම කිසිවෙක් සහභාගී වී නැත.</p>;

  const download = () =>
    exportExcel(
      rows.map((r, i) => ({
        ස්ථානය: i + 1,
        නම: r.නම,
        ලකුණු: r.ලකුණු,
        "මුළු ලකුණු": totalMarks,
        "මුළු කාලය (තත්පර)": Math.round(r.sec),
        "ප්‍රශ්නයකට සාමාන්‍ය (තත්පර)": Math.round(r.sec / questionCount),
      })),
      test.name,
    );

  return (
    <>
      <button className="g" onClick={download}>
        📥 Excel ලෙස ගන්න
      </button>
      <div style={{ overflowX: "auto", marginTop: 10 }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>නම</th>
              <th>ලකුණු</th>
              <th>කාලය</th>
              <th>ප්‍රශ්නයකට</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.නම}>
                <td>{i + 1}</td>
                <td>{r.නම}</td>
                <td>
                  {r.ලකුණු}/{totalMarks}
                </td>
                <td>{formatDuration(r.sec)}</td>
                <td>{formatDuration(r.sec / questionCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
