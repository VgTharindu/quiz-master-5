import { useState } from "react";
import Tabs from "@/components/Tabs";
import StudentMonthReport from "../StudentMonthReport";
import MonthlyReport from "../MonthlyReport";
import MonthTestList from "./MonthTestList";

export default function AnalysisSection({ onOpen }) {
  const [tab, setTab] = useState(0);
  return (
    <>
      <h1 className="t-section-title">විශ්ලේෂණ</h1>
      <Tabs items={["ළමයා අනුව", "පරීක්ෂණය අනුව", "මාසික සාමාන්‍යය"]} active={tab} onChange={setTab} />
      {tab === 0 && <StudentMonthReport />}
      {tab === 1 && <MonthTestList tab={2} onOpen={onOpen} />}
      {tab === 2 && <MonthlyReport />}
    </>
  );
}
