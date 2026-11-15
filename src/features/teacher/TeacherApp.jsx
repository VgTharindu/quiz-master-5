import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import Loading from "@/components/Loading";
import TeacherLogin from "./TeacherLogin";
import Dashboard from "./Dashboard";

export default function TeacherApp({ exit }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
  }, []);
  if (!ready) return <Loading />;
  if (!session) return <TeacherLogin exit={exit} onLogin={setSession} />;
  return (
    <Dashboard
      out={() =>
        sb.auth.signOut().then(() => {
          setSession(null);
          exit();
        })
      }
    />
  );
}
