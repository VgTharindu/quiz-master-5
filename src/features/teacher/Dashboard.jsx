import { useState } from "react";
import TopBar from "@/components/TopBar";
import { useBackHandler } from "@/hooks/useBackHandler";
import TestDetail from "./test-detail/TestDetail";
import ScheduledSection from "./sections/ScheduledSection";
import AnalysisSection from "./sections/AnalysisSection";
import HistorySection from "./sections/HistorySection";
import "./teacher.css";

const SECTIONS = [
  ["📅", "පරීක්ෂණ"],
  ["📊", "විශ්ලේෂණ"],
  ["🗂️", "ඉතිහාසය"],
];

// Detail tabs: 0 = questions, 1 = results, 2 = analysis
export default function Dashboard({ out }) {
  const [section, setSection] = useState(0);
  const [opened, setOpened] = useState(null); // { test, tab }
  const open = (test, tab = 0) => {
    setOpened({ test, tab });
    window.scrollTo(0, 0);
  };
  useBackHandler(opened !== null, () => setOpened(null), 1);

  if (opened)
    return (
      <div className="t-app">
        <TestDetail
          key={opened.test.id}
          test={opened.test}
          initialTab={opened.tab}
          back={() => setOpened(null)}
          onOpenTest={open}
        />
      </div>
    );

  return (
    <div className="t-app">
      <TopBar
        left="👨‍🏫 චාමර සර්"
        right={
          <button className="t-out" onClick={out}>
            ඉවත් වන්න
          </button>
        }
      />
      <div className="wrap">
        {section === 0 && <ScheduledSection onOpen={open} />}
        {section === 1 && <AnalysisSection onOpen={open} />}
        {section === 2 && <HistorySection onOpen={open} />}
      </div>
      <nav className="bnav">
        {SECTIONS.map(([icon, label], i) => (
          <button
            key={label}
            className={section === i ? "on" : ""}
            onClick={() => {
              setSection(i);
              window.scrollTo(0, 0);
            }}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
