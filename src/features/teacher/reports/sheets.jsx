import LineChart from "@/components/LineChart";
import { MONTHS, formatDateTime, formatDuration } from "@/utils/format";
import ReportSheet, { SheetStats } from "./ReportSheet";
import CoinValue from "./CoinValue";

const barColor = (pc) => (pc >= 70 ? "#16a34a" : pc >= 40 ? "#facc15" : "#dc2626");
const shortDate = (d) => {
  const x = new Date(d);
  return `${x.getMonth() + 1}/${x.getDate()}`;
};

function TestMeta({ report }) {
  const { test, qCount, totalMarks } = report;
  return (
    <div className="rs-meta" data-pdf-block>
      <div>
        පරීක්ෂණය: <b>{test.name}</b>
      </div>
      <div>
        පන්තිය: <b>{test.grade} වසර</b>
      </div>
      <div>
        ආරම්භය: <b>{formatDateTime(test.start_at)}</b>
      </div>
      <div>
        අවසානය: <b>{formatDateTime(test.end_at)}</b>
      </div>
      <div>
        ප්‍රශ්න: <b>{qCount}</b>
      </div>
      <div>
        මුළු ලකුණු: <b>{totalMarks}</b>
      </div>
    </div>
  );
}

function testStats(report) {
  const s = report.stats;
  return [
    ["සහභාගී වූ ළමුන්", s.count],
    ["සාමාන්‍ය ලකුණු", `${s.avg.toFixed(1)} (${Math.round(s.avgPct)}%)`],
    ["ඉහළම / අඩුම", `${s.max} / ${s.min}`],
    ["පේපර් එකකට සාමාන්‍ය කාලය", formatDuration(s.avgSec)],
    ["ප්‍රශ්නයකට සාමාන්‍ය කාලය", formatDuration(s.avgPerQ)],
  ];
}

export function TestResultSheet({ report }) {
  return (
    <ReportSheet title="ප්‍රතිඵල පත්‍රය" subtitle={report.test.name}>
      <TestMeta report={report} />
      <SheetStats items={testStats(report)} />
      <table>
        <thead>
          <tr data-pdf-block>
            <th>ස්ථානය</th>
            <th>නම</th>
            <th className="num">ලකුණු</th>
            <th className="num">%</th>
            <th className="num">ගතවූ කාලය</th>
            <th className="num">ප්‍රශ්නයකට</th>
            <th className="num">Coins</th>
          </tr>
        </thead>
        <tbody>
          {report.rows.map((r, i) => (
            <tr key={i} data-pdf-block>
              <td>{r.rank}</td>
              <td>{r.name}</td>
              <td className="num">
                {r.score}/{report.totalMarks}
              </td>
              <td className="num">{r.pct}%</td>
              <td className="num">{formatDuration(r.sec)}</td>
              <td className="num">{formatDuration(r.perQ)}</td>
              <td className="num">
                <CoinValue value={r.coins} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!report.rows.length && <p className="muted">තවම කිසිවෙක් සහභාගී වී නැත.</p>}
    </ReportSheet>
  );
}

export function TestAnalysisSheet({ report }) {
  return (
    <ReportSheet title="පරීක්ෂණ විශ්ලේෂණය" subtitle={report.test.name}>
      <TestMeta report={report} />
      <SheetStats items={testStats(report)} />
      <h2 data-pdf-block>ප්‍රශ්න අනුව නිවැරදි ප්‍රතිශතය</h2>
      <table>
        <thead>
          <tr data-pdf-block>
            <th>#</th>
            <th>ප්‍රශ්නය</th>
            <th className="num">නිවැරදි</th>
            <th>ප්‍රතිශතය</th>
            <th className="num">සාමාන්‍ය කාලය</th>
          </tr>
        </thead>
        <tbody>
          {report.perQuestion.map((p, k) => (
            <tr key={p.q.id} data-pdf-block>
              <td>{k + 1}</td>
              <td>{p.q.body}</td>
              <td className="num">
                {p.correct}/{report.stats.count}
              </td>
              <td>
                <div className="rs-bar">
                  <div style={{ width: p.pct + "%", background: barColor(p.pct) }} />
                </div>
                {p.pct}%
              </td>
              <td className="num">{p.avgSec ? formatDuration(p.avgSec) : "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 data-pdf-block>ළමුන්ගේ ස්ථාන</h2>
      <table>
        <thead>
          <tr data-pdf-block>
            <th>ස්ථානය</th>
            <th>නම</th>
            <th className="num">ලකුණු</th>
            <th className="num">%</th>
            <th className="num">Coins</th>
          </tr>
        </thead>
        <tbody>
          {report.rows.map((r, i) => (
            <tr key={i} data-pdf-block>
              <td>{r.rank}</td>
              <td>{r.name}</td>
              <td className="num">
                {r.score}/{report.totalMarks}
              </td>
              <td className="num">{r.pct}%</td>
              <td className="num">
                <CoinValue value={r.coins} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportSheet>
  );
}

export function StudentMonthSheet({ grade, year, month, data, coins }) {
  return (
    <ReportSheet
      title="ළමයාගේ මාසික වාර්තාව"
      subtitle={`${year} ${MONTHS[month]} · ${grade} වසර`}
    >
      <div className="rs-meta" data-pdf-block>
        <div>
          නම: <b>{data.displayName}</b>
        </div>
        <div>
          Coins: <CoinValue value={coins} size={18} />
        </div>
      </div>
      <SheetStats items={studentStats(data)} />
      <h2 data-pdf-block>ලකුණු වර්ධනය (%)</h2>
      <div className="rs-chart" data-pdf-block>
        <StudentGrowthChart data={data} />
      </div>
      <h2 data-pdf-block>පරීක්ෂණ අනුව ලකුණු</h2>
      <table>
        <thead>
          <tr data-pdf-block>
            <th>දිනය</th>
            <th>පරීක්ෂණය</th>
            <th className="num">ලකුණු</th>
            <th className="num">%</th>
            <th className="num">ස්ථානය</th>
            <th className="num">ගතවූ කාලය</th>
            <th className="num">ප්‍රශ්නයකට</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((it) => (
            <tr key={it.test.id} data-pdf-block>
              <td>{shortDate(it.test.start_at)}</td>
              <td>{it.test.name}</td>
              {it.row ? (
                <>
                  <td className="num">
                    {it.row.score}/{it.report.totalMarks}
                  </td>
                  <td className="num">{it.row.pct}%</td>
                  <td className="num">
                    {it.row.rank}/{it.report.stats.count}
                  </td>
                  <td className="num">{formatDuration(it.row.sec)}</td>
                  <td className="num">{formatDuration(it.row.perQ)}</td>
                </>
              ) : (
                <td colSpan={5} className="muted">
                  සහභාගී වී නැත
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </ReportSheet>
  );
}

export function studentStats(data) {
  return [
    ["සහභාගී වූ පරීක්ෂණ", `${data.attended} / ${data.items.length}`],
    ["මාසික සාමාන්‍යය", data.attended ? `${data.avgPct}%` : "–"],
    ["පේපර් එකකට සාමාන්‍ය කාලය", data.attended ? formatDuration(data.avgSec) : "–"],
    ["ප්‍රශ්නයකට සාමාන්‍ය කාලය", data.attended ? formatDuration(data.avgPerQ) : "–"],
  ];
}

export function StudentGrowthChart({ data }) {
  return (
    <LineChart
      labels={data.items.map((it) => shortDate(it.test.start_at))}
      series={[
        { name: "ළමයාගේ ලකුණු", color: "#1a4bae", values: data.items.map((it) => (it.row ? it.row.pct : null)) },
        { name: "පන්තියේ සාමාන්‍යය", color: "#f7931e", dashed: true, values: data.items.map((it) => it.classAvgPct) },
      ]}
    />
  );
}

export function MonthlyAverageSheet({ grade, year, month, rows }) {
  return (
    <ReportSheet title="මාසික සාමාන්‍යය" subtitle={`${year} ${MONTHS[month]} · ${grade} වසර`}>
      <table>
        <thead>
          <tr data-pdf-block>
            <th>ස්ථානය</th>
            <th>නම</th>
            <th className="num">පරීක්ෂණ</th>
            <th className="num">සාමාන්‍ය ලකුණු</th>
            <th className="num">Coins</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} data-pdf-block>
              <td>{r.rank}</td>
              <td>{r.name}</td>
              <td className="num">
                {r.attended}/{r.total}
              </td>
              <td className="num">{r.avg}</td>
              <td className="num">
                <CoinValue value={r.coins} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportSheet>
  );
}
