import { useCallback, useState } from "react";
import Splash from "@/features/splash/Splash";
import Landing from "@/features/landing/Landing";
import StudentApp from "@/features/student/StudentApp";
import TeacherApp from "@/features/teacher/TeacherApp";
import { loadStudent } from "@/features/student/studentStorage";

// role: null = home page, "s" = ළමයා, "t" = සර්
export default function App() {
  // කලින් login වෙච්ච ළමයෙක් නම් කෙලින්ම ළමයාගේ පැත්තට
  const [role, setRole] = useState(() => (loadStudent() ? "s" : null));
  const [splash, setSplash] = useState(true);
  const hideSplash = useCallback(() => setSplash(false), []);
  const exit = () => setRole(null);

  let page;
  if (role === "s") page = <StudentApp exit={exit} />;
  else if (role === "t") page = <TeacherApp exit={exit} />;
  else page = <Landing onStudent={() => setRole("s")} onTeacher={() => setRole("t")} />;

  // splash එක page එකට උඩින් පෙනෙනවා. ඒ අතරතුර යටින් page එක load වෙනවා
  return (
    <>
      {page}
      {splash && <Splash onDone={hideSplash} />}
    </>
  );
}
