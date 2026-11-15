import { Suspense, useCallback, useEffect, useState } from "react";
import Splash from "@/features/splash/Splash";
import Landing from "@/features/landing/Landing";
import Loading from "@/components/Loading";
import ErrorBoundary from "@/components/ErrorBoundary";
import NetworkBanner from "@/components/NetworkBanner";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { loadStudent } from "@/features/student/studentStorage";

// ළමයාගේ සහ සර්ගේ පිටු වෙනම JS කොටස් (chunks) ලෙස build වෙනවා.
// Home page එක පෙන්වන්න ඒවා ඕන නැති නිසා පළමු load එක ගොඩක් කුඩායි
const loadStudentApp = () => import("@/features/student/StudentApp");
const StudentApp = lazyWithRetry(loadStudentApp);
const TeacherApp = lazyWithRetry(() => import("@/features/teacher/TeacherApp"));

// splash එක tab එකකට එක පාරක් විතරයි. refresh කළාම (උදා: පරීක්ෂණය අතරතුර) ආයෙත් තත්පර 5ක් බලාගෙන ඉන්න ඕන නැහැ
const SPLASH_KEY = "qm_splash_seen";
const splashSeen = () => {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return false;
  }
};

// role: null = home page, "s" = ළමයා, "t" = සර්
export default function App() {
  // කලින් login වෙච්ච ළමයෙක් නම් කෙලින්ම ළමයාගේ පැත්තට
  const [role, setRole] = useState(() => (loadStudent() ? "s" : null));
  const [splash, setSplash] = useState(() => !splashSeen());
  const hideSplash = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {}
    setSplash(false);
  }, []);
  const exit = () => setRole(null);

  // ළමයි වැඩිපුරම යන්නේ ළමයාගේ පැත්තට. ඒ නිසා home page එක පෙන්වපු ගමන්, phone එක නිදහස් වෙලාවක
  // ඒ කොටස කලින්ම download කරලා තියනවා. "පරීක්ෂණයට යන්න" ඔබපුවාම එවෙලේම පිටුව පෙනෙනවා
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    idle(() => loadStudentApp().catch(() => {}));
  }, []);

  let page;
  if (role === "s") page = <StudentApp exit={exit} />;
  else if (role === "t") page = <TeacherApp exit={exit} />;
  else page = <Landing onStudent={() => setRole("s")} onTeacher={() => setRole("t")} />;

  // splash එක page එකට උඩින් පෙනෙනවා. ඒ අතරතුර යටින් page එක load වෙනවා
  return (
    <>
      <NetworkBanner />
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>{page}</Suspense>
      </ErrorBoundary>
      {splash && <Splash onDone={hideSplash} />}
    </>
  );
}
