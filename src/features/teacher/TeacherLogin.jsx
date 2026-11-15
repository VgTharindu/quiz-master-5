import { useState } from "react";
import { sb } from "@/lib/supabase";
import BackButton from "@/components/BackButton";

export default function TeacherLogin({ exit, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function login() {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    error ? alert("Email හෝ මුරපදය වැරදියි") : onLogin(data.session);
  }
  return (
    <div className="wrap">
      <BackButton onClick={exit} />
      <h1>චාමර සර්ගේ පිවිසුම</h1>
      <div className="card">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="මුරපදය"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={{ width: "100%" }} onClick={login}>
          පිවිසෙන්න
        </button>
      </div>
    </div>
  );
}
