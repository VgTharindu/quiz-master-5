import { useState } from "react";
import StudentLogin from "./StudentLogin";
import StudentHome from "./StudentHome";
import TestRunner from "./TestRunner";
import ResultView from "./ResultView";
import { clearStudent, loadStudent, saveStudent } from "./studentStorage";

export default function StudentApp({ exit }) {
  const [me, setMe] = useState(loadStudent);
  // view.page = "home" | "test" | "result", view.aid = attempt id
  const [view, setView] = useState({ page: "home" });

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
    return <ResultView aid={view.aid} back={() => setView({ page: "home" })} />;
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
