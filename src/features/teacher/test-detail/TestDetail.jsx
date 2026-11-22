import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import TopBar from "@/components/TopBar";
import Tabs from "@/components/Tabs";
import BackButton from "@/components/BackButton";
import RetryMessage from "@/components/RetryMessage";
import StatusTag from "@/components/StatusTag";
import { ENDED, LIVE, UPCOMING, getTestStatus } from "@/constants/testStatus";
import { formatDateTime } from "@/utils/format";
import TestForm from "../TestForm";
import { buildTestReport } from "../reports/reportData";
import { useCoinBoard } from "../reports/useCoinBoard";
import QuestionsTab from "./QuestionsTab";
import ResultsTab from "./ResultsTab";
import AnalysisTab from "./AnalysisTab";

export default function TestDetail({ test: initialTest, initialTab, back, onOpenTest }) {
  const [test, setTest] = useState(initialTest);
  const status = getTestStatus(test);
  const [tab, setTab] = useState(initialTab ?? (status === ENDED ? 1 : 0));
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [panel, setPanel] = useState(null); // "edit" | "republish" | null
  const [loadError, setLoadError] = useState(false);
  const coinMap = useCoinBoard(test.grade);

  // On failure the previous data is kept and a retry message is shown,
  // instead of an empty list that looks like "nobody took the test".
  const loadQuestions = () =>
    sb
      .from("questions")
      .select("*")
      .eq("test_id", test.id)
      .order("pos")
      .then(({ data, error }) => (error ? setLoadError(true) : setQuestions(data || [])));
  const loadAttempts = () =>
    sb
      .from("attempts")
      .select("*")
      .eq("test_id", test.id)
      .then(({ data, error }) => (error ? setLoadError(true) : setAttempts(data || [])));
  const reload = () => {
    setLoadError(false);
    loadQuestions();
    loadAttempts();
  };
  useEffect(reload, []);

  const report = buildTestReport(test, questions, attempts, coinMap);

  async function saveEdit(row) {
    // Once a test is live only its name and end time may change.
    const patch = status === UPCOMING ? row : { name: row.name, end_at: row.end_at };
    if (status === LIVE && new Date(patch.end_at) <= new Date())
      return "අවසන් වෙලාව දැන් වෙලාවට පසුව විය යුතුයි";
    const { data, error } = await sb.from("tests").update(patch).eq("id", test.id).select().single();
    if (error) return error.message;
    setTest(data);
    setPanel(null);
  }

  // Copies the test and its questions into a brand-new test. The original keeps its own results.
  async function republish(row) {
    const { data: copy, error } = await sb.from("tests").insert(row).select().single();
    if (error) return error.message;
    if (questions.length) {
      const rows = questions.map(({ id, test_id, created_at, ...q }) => ({ ...q, test_id: copy.id }));
      const { error: qError } = await sb.from("questions").insert(rows);
      if (qError) {
        await sb.from("tests").delete().eq("id", copy.id);
        return qError.message;
      }
    }
    alert(`"${copy.name}" නැවත publish කළා. ප්‍රශ්න ${questions.length}ක් copy වුණා.`);
    onOpenTest(copy, 0);
  }

  return (
    <div>
      <TopBar left={test.name} right={<span style={{ fontSize: 14 }}>{test.grade} වසර</span>} />
      <div className="wrap">
        <BackButton onClick={back} />
        <p>
          {formatDateTime(test.start_at)} සිට {formatDateTime(test.end_at)} · <StatusTag status={status} />
        </p>
        <div className="t-actions">
          {status !== ENDED && (
            <button className="w" onClick={() => setPanel(panel === "edit" ? null : "edit")}>
              ✏ නම / වෙලාව වෙනස් කරන්න
            </button>
          )}
          <button className="w" onClick={() => setPanel(panel === "republish" ? null : "republish")}>
            🔁 නැවත publish කරන්න
          </button>
        </div>
        {panel === "edit" && (
          <TestForm
            initial={test}
            lock={status === LIVE ? { grade: true, start: true } : {}}
            submitLabel="වෙනස්කම් සුරකින්න"
            onSubmit={saveEdit}
            onCancel={() => setPanel(null)}
          />
        )}
        {panel === "republish" && (
          <>
            <p className="t-hint">
              මේ පරීක්ෂණයේ ප්‍රශ්න {questions.length} අලුත් පරීක්ෂණයකට copy වෙනවා. පරණ පරීක්ෂණය සහ එහි ප්‍රතිඵල ඒ
              විදිහටම ඉතිහාසයේ තියෙනවා.
            </p>
            <TestForm
              initial={{ name: test.name, grade: test.grade }}
              submitLabel="නැවත publish කරන්න"
              onSubmit={republish}
              onCancel={() => setPanel(null)}
            />
          </>
        )}
        {status === LIVE && <div className="card warn">⚠ පරීක්ෂණය දැන් පවතී. ප්‍රශ්න වෙනස් කළ නොහැක.</div>}
        <Tabs
          items={["ප්‍රශ්න", "ප්‍රතිඵල", "විශ්ලේෂණය"]}
          active={tab}
          onChange={(i) => {
            setTab(i);
            loadAttempts(); // fetch fresh results on every tab switch
          }}
        />
        {loadError && <RetryMessage onRetry={reload} />}
        {!loadError && tab === 0 && (
          <QuestionsTab
            test={test}
            status={status}
            questions={questions}
            totalMarks={report.totalMarks}
            reload={loadQuestions}
            onTestDeleted={back}
          />
        )}
        {!loadError && tab === 1 && <ResultsTab report={report} />}
        {!loadError && tab === 2 && <AnalysisTab report={report} />}
      </div>
    </div>
  );
}
