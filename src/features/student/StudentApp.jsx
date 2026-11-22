import { useState } from "react";
import StudentLogin from "./StudentLogin";
import StudentHome from "./StudentHome";
import TestRunner from "./TestRunner";
import ResultView from "./ResultView";
import { clearStudent, loadStudent, saveStudent } from "./studentStorage";
import { useBackHandler } from "@/hooks/useBackHandler";
import "./student.css";

export default function StudentApp({ exit }) {
  return (
    <div className="st-app">
      <StudentScreens exit={exit} />
    </div>
  );
}

// The open screen survives a refresh, so a child who reloads mid-test lands back in the test.
const VIEW_KEY = "qm_view";
function readView() {
  try {
    return JSON.parse(sessionStorage.getItem(VIEW_KEY)) || { page: "home" };
  } catch {
    return { page: "home" };
  }
}

function StudentScreens({ exit }) {
  const [me, setMe] = useState(loadStudent);
  // view.page = "home" | "test" | "result", view.aid = attempt id
  const [view, setViewState] = useState(readView);
  const setView = (v) => {
    setViewState(v);
    try {
      sessionStorage.setItem(VIEW_KEY, JSON.stringify(v));
    } catch {}
  };
  useBackHandler(Boolean(me) && view.page === "result", () => setView({ page: "home" }), 1);

  if (!me)
    return (
      <StudentLogin
        exit={exit}
        done={(m) => {
          saveStudent(m);
          setMe(m);
        }}
      />
    );
  if (view.page === "test")
    return (
      <TestRunner
        aid={view.aid}
        done={() => setView({ page: "result", aid: view.aid })}
      />
    );
  if (view.page === "result")
    return <ResultView me={me} aid={view.aid} back={() => setView({ page: "home" })} />;
  return (
    <StudentHome
      me={me}
      go={setView}
      change={() => {
        clearStudent();
        setMe(null);
      }}
      exit={() => {
        clearStudent();
        exit();
      }}
    />
  );
}
