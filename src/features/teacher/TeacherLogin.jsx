import { useState } from "react";
import { sb } from "@/lib/supabase";
import BackButton from "@/components/BackButton";

export default function TeacherLogin({ exit, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (!error) return onLogin(data.session);
    // 400 means the server checked the details; anything else is a connection problem.
    setError(
      error.status === 400
        ? "Email හෝ මුරපදය වැරදියි"
        : "සම්බන්ධතාවය දුර්වලයි. Internet පරීක්ෂා කර නැවත උත්සාහ කරන්න.",
    );
  }

  return (
    <div className="wrap">
      <BackButton onClick={exit} />
      <h1>චාමර සර්ගේ පිවිසුම</h1>
      <form className="card" onSubmit={login}>
        <input
          type="email"
          autoComplete="username"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="මුරපදය"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}
        <button type="submit" style={{ width: "100%" }} disabled={busy || !email.trim() || !password}>
          {busy ? "පිවිසෙමින්…" : "පිවිසෙන්න"}
        </button>
      </form>
    </div>
  );
}
