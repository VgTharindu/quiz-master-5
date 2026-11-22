import { sb } from "@/lib/supabase";
import { calcScore } from "@/utils/score";

export const nameKey = (name) => name.trim().toLowerCase();

const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

// Unfinished attempts are timed up to now, or up to the test end if it has passed.
export function attemptSeconds(attempt, test) {
  const end = attempt.finished_at
    ? new Date(attempt.finished_at)
    : new Date(Math.min(Date.now(), new Date(test.end_at)));
  return Math.max(0, (end - new Date(attempt.started_at)) / 1000);
}

// coinMap: Map(nameKey -> coins), undefined while loading, null when unavailable.
export const coinsOf = (coinMap, name) =>
  coinMap === undefined ? undefined : coinMap ? coinMap.get(nameKey(name)) ?? 0 : null;
export const coinsLoading = (rows) => rows.some((r) => r.coins === undefined);

// Everything the result sheet and analysis need for one test.
export function buildTestReport(test, questions, attempts, coinMap = null) {
  const qs = questions.filter((q) => q.test_id === test.id);
  const totalMarks = qs.reduce((s, q) => s + q.marks, 0);
  const qCount = qs.length || 1;
  const rows = attempts
    .filter((a) => a.test_id === test.id)
    .map((a) => {
      const score = calcScore(a, qs);
      const sec = attemptSeconds(a, test);
      return {
        name: a.student,
        score,
        pct: totalMarks ? Math.round((score * 100) / totalMarks) : 0,
        sec,
        perQ: sec / qCount,
        coins: coinsOf(coinMap, a.student),
      };
    })
    .sort((a, b) => b.score - a.score || a.sec - b.sec);
  // Same rule as get_result: rank = 1 + number of students with a higher score.
  rows.forEach((r) => (r.rank = 1 + rows.filter((x) => x.score > r.score).length));

  const scores = rows.map((r) => r.score);
  const stats = {
    count: rows.length,
    avg: avg(scores),
    avgPct: avg(rows.map((r) => r.pct)),
    max: rows.length ? Math.max(...scores) : 0,
    min: rows.length ? Math.min(...scores) : 0,
    avgSec: avg(rows.map((r) => r.sec)),
    avgPerQ: avg(rows.map((r) => r.perQ)),
  };
  const testAttempts = attempts.filter((a) => a.test_id === test.id);
  const perQuestion = qs.map((q) => {
    const correct = testAttempts.filter((a) => a.answers?.[q.id]?.a === q.correct).length;
    const times = testAttempts.map((a) => a.answers?.[q.id]?.s).filter((s) => s > 0);
    return {
      q,
      correct,
      pct: testAttempts.length ? Math.round((correct * 100) / testAttempts.length) : 0,
      avgSec: avg(times),
    };
  });
  return { test, totalMarks, qCount: qs.length, rows, stats, perQuestion };
}

// One student's month: a row for every test of their grade that has started, attended or not.
export function buildStudentMonth(name, tests, questions, attempts) {
  const key = nameKey(name);
  const now = new Date();
  const items = tests
    .filter((t) => new Date(t.start_at) <= now)
    .map((t) => {
      const report = buildTestReport(t, questions, attempts);
      const row = report.rows.find((r) => nameKey(r.name) === key) || null;
      const classAvgPct = report.stats.count ? Math.round(report.stats.avgPct) : null;
      return { test: t, report, row, classAvgPct };
    });
  const attended = items.filter((i) => i.row);
  return {
    items,
    attended: attended.length,
    avgPct: Math.round(avg(attended.map((i) => i.row.pct))),
    avgScore: avg(attended.map((i) => i.row.score)),
    avgSec: avg(attended.map((i) => i.row.sec)),
    avgPerQ: avg(attended.map((i) => i.row.perQ)),
    displayName: attended[0]?.row.name || name.trim(),
  };
}

export function monthRange(year, month) {
  return { from: new Date(year, month, 1), to: new Date(year, month + 1, 1) };
}

// grade = null loads every grade.
export async function fetchMonthTests({ grade, year, month }) {
  const { from, to } = monthRange(year, month);
  let q = sb
    .from("tests")
    .select("*")
    .gte("start_at", from.toISOString())
    .lt("start_at", to.toISOString())
    .order("start_at");
  if (grade) q = q.eq("grade", grade);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

const PAGE = 1000;
const ID_CHUNK = 100;

// Supabase returns at most 1000 rows per request, so larger tables are read page by page.
async function selectAll(build) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build().range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < PAGE) return rows;
  }
}

// Long id lists are split so the request URL stays short.
async function selectIn(table, columns, column, ids, order = "id") {
  const chunks = [];
  for (let i = 0; i < ids.length; i += ID_CHUNK) chunks.push(ids.slice(i, i + ID_CHUNK));
  const parts = await Promise.all(
    chunks.map((part) => selectAll(() => sb.from(table).select(columns).in(column, part).order(order).order("id"))),
  );
  return parts.flat();
}

export async function fetchTestsData(testIds) {
  if (!testIds.length) return { questions: [], attempts: [] };
  const [questions, attempts] = await Promise.all([
    selectIn("questions", "*", "test_id", testIds, "pos"),
    selectIn("attempts", "*", "test_id", testIds),
  ]);
  return { questions, attempts };
}

export async function fetchStudentNames(grade) {
  const data = await selectAll(() => sb.from("attempts").select("student").eq("grade", grade).order("id")).catch(() => []);
  const seen = new Map();
  data.forEach((r) => seen.set(nameKey(r.student), r.student.trim()));
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

// Same rule as the coin_board SQL function, worked out in the browser.
// Used when that migration has not been run on the database yet.
export async function computeCoinBoard(grade) {
  const attempts = await selectAll(() =>
    sb.from("attempts").select("test_id, student, finished, answers").eq("grade", grade).order("id"),
  );
  const testIds = [...new Set(attempts.map((a) => a.test_id))];
  if (!testIds.length) return new Map();
  const [questions, tests] = await Promise.all([
    selectIn("questions", "id, test_id, correct", "test_id", testIds),
    selectIn("tests", "id, end_at", "id", testIds),
  ]);
  const now = new Date();
  const ended = new Set(tests.filter((t) => new Date(t.end_at) <= now).map((t) => t.id));
  const byTest = new Map();
  questions.forEach((q) => byTest.set(q.test_id, [...(byTest.get(q.test_id) || []), q]));
  const board = new Map();
  for (const a of attempts) {
    if (!a.finished && !ended.has(a.test_id)) continue;
    const correct = (byTest.get(a.test_id) || []).filter((q) => {
      const picked = a.answers?.[q.id]?.a;
      return picked !== undefined && picked !== null && +picked === q.correct;
    }).length;
    const key = nameKey(a.student);
    board.set(key, (board.get(key) || 0) + correct);
  }
  return board;
}
