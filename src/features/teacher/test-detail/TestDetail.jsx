import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import TopBar from "@/components/TopBar";
import Tabs from "@/components/Tabs";
import BackButton from "@/components/BackButton";
import StatusTag from "@/components/StatusTag";
import { ENDED, LIVE, getTestStatus } from "@/constants/testStatus";
import { formatDateTime } from "@/utils/format";
import { calcScore } from "@/utils/score";
import QuestionsTab from "./QuestionsTab";
import ResultsTab from "./ResultsTab";
import AnalysisTab from "./AnalysisTab";

// එක් පරීක්ෂණයක විස්තර පිටුව: ප්‍රශ්න / ප්‍රතිඵල / විශ්ලේෂණය tabs තුන
export default function TestDetail({ test, back }) {
  const status = getTestStatus(test);
  const [tab, setTab] = useState(status === ENDED ? 1 : 0);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const loadQuestions = () =>
    sb
      .from("questions")
      .select("*")
      .eq("test_id", test.id)
      .order("pos")
      .then(({ data }) => setQuestions(data || []));
  const loadAttempts = () =>
    sb
      .from("attempts")
      .select("*")
      .eq("test_id", test.id)
      .then(({ data }) => setAttempts(data || []));
  useEffect(() => {
    loadQuestions();
    loadAttempts();
  }, []);

  const totalMarks = questions.reduce((s, q) => s + q.marks, 0),
    end = new Date(test.end_at);
  // හැම ළමයෙක්ටම ලකුණු සහ ගත කළ කාලය (තත්පර). ඉවර කරලා නැත්නම් දැනට හෝ test එක ඉවර වෙන වෙලාවට ගණන් කරනවා
  const rows = attempts
    .map((r) => {
      const sec =
        ((r.finished_at
          ? new Date(r.finished_at)
          : new Date(Math.min(Date.now(), end))) -
          new Date(r.started_at)) /
        1000;
      return { නම: r.student, ලකුණු: calcScore(r, questions), sec };
    })
    .sort((a, b) => b.ලකුණු - a.ලකුණු);

  return (
    <div>
      <TopBar
        left={test.name}
        right={<span style={{ fontSize: 14 }}>{test.grade} වසර</span>}
      />
      <div className="wrap">
        <BackButton onClick={back} />
        <p>
          {formatDateTime(test.start_at)} සිට {formatDateTime(test.end_at)} ·{" "}
          <StatusTag status={status} />
        </p>
        {status === LIVE && (
          <div className="card warn">
            ⚠ පරීක්ෂණය දැන් පවතී. ප්‍රශ්න වෙනස් කළ නොහැක.
          </div>
        )}
        <Tabs
          items={["ප්‍රශ්න", "ප්‍රතිඵල", "විශ්ලේෂණය"]}
          active={tab}
          onChange={(i) => {
            setTab(i);
            loadAttempts(); // tab මාරු කරන හැම වෙලාවකම අලුත්ම ප්‍රතිඵල ගන්නවා
          }}
        />
        {tab === 0 && (
          <QuestionsTab
            test={test}
            status={status}
            questions={questions}
            totalMarks={totalMarks}
            reload={loadQuestions}
            onTestDeleted={back}
          />
        )}
        {tab === 1 && (
          <ResultsTab
            test={test}
            rows={rows}
            totalMarks={totalMarks}
            questionCount={questions.length || 1}
          />
        )}
        {tab === 2 && (
          <AnalysisTab rows={rows} questions={questions} attempts={attempts} />
        )}
      </div>
    </div>
  );
}
