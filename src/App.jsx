import { Suspense, useCallback, useEffect, useState } from "react";
import Splash from "@/features/splash/Splash";
import Landing from "@/features/landing/Landing";
import Loading from "@/components/Loading";
import ErrorBoundary from "@/components/ErrorBoundary";
import NetworkBanner from "@/components/NetworkBanner";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { loadStudent } from "@/features/student/studentStorage";
import { useBackHandler } from "@/hooks/useBackHandler";
import { useContentProtection } from "@/hooks/useContentProtection";

// Student and teacher views are separate chunks, so the landing page ships with minimal JS.
const loadStudentApp = () => import("@/features/student/StudentApp");
const StudentApp = lazyWithRetry(loadStudentApp);
const TeacherApp = lazyWithRetry(() => import("@/features/teacher/TeacherApp"));

// Show the splash once per tab session so a refresh mid-test does not cost another 5 seconds.
const SPLASH_KEY = "qm_splash_seen";
const splashSeen = () => {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return false;
  }
};

export default function App() {
  const [role, setRole] = useState(() => (loadStudent() ? "s" : null));
  const [splash, setSplash] = useState(() => !splashSeen());
  const hideSplash = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {}
    setSplash(false);
  }, []);
  const exit = () => setRole(null);
  useBackHandler(role !== null, exit);
  // The teacher dashboard needs normal copy and right-click; everything children see is protected.
  useContentProtection(role !== "t");

  useEffect(() => {
    // Most visitors are students: prefetch their chunk while idle so navigation feels instant.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    idle(() => loadStudentApp().catch(() => {}));
  }, []);

  let page;
  if (role === "s") page = <StudentApp exit={exit} />;
  else if (role === "t") page = <TeacherApp exit={exit} />;
  else page = <Landing onStudent={() => setRole("s")} onTeacher={() => setRole("t")} />;

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
