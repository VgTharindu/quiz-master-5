import { useState } from "react";
import Logo from "@/components/Logo";
import BackButton from "@/components/BackButton";
import { GRADES } from "@/constants/grades";

// නම සහ පන්තිය ඇතුළත් කරන පිටුව
export default function StudentLogin({ done, exit }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(0);
  return (
    <div className="wrap">
      <BackButton onClick={exit} />
      <div className="row" style={{ flex: "none", gap: 12, margin: "12px 0" }}>
        <Logo size={52} />
        <h1 style={{ flex: "none", margin: 0 }}>QUIZ MASTER 5</h1>
      </div>
      <div className="card">
        <b>1. ඔබේ නම ලියන්න</b>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="සම්පූර්ණ නම"
        />
        <b>2. ඔබේ පන්තිය තෝරන්න</b>
        <div className="row" style={{ marginTop: 8 }}>
          {GRADES.map((g) => (
            <button
              key={g}
              className={grade === g ? "g" : "w"}
              onClick={() => setGrade(g)}
            >
              {g} වසර
            </button>
          ))}
        </div>
      </div>
      <button
        disabled={!name.trim() || !grade}
        onClick={() => done({ name: name.trim(), grade })}
        style={{ width: "100%" }}
      >
        ඉදිරියට යන්න
      </button>
    </div>
  );
}
