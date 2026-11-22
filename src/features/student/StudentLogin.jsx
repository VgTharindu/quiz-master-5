import { useState } from "react";
import Logo from "@/components/Logo";
import { GRADES } from "@/constants/grades";
import { BookIcon, BulbIcon, CheckBadge, Chevron, PencilIcon, StarIcon, TrophyIcon, UserIcon } from "./ui/icons";
import { CheerBanner, Sparkles } from "./ui/Decor";

const GRADE_STYLE = {
  3: { tone: "blue", icon: <BookIcon size={34} /> },
  4: { tone: "green", icon: <PencilIcon size={30} /> },
  5: { tone: "purple", icon: <StarIcon size={30} /> },
};

export default function StudentLogin({ done, exit }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(0);
  return (
    <div className="st-login">
      <Sparkles />
      <div className="st-page">
        <button className="st-back" onClick={exit}>
          <Chevron dir="left" /> ආපසු
        </button>
        <div className="st-login-title">
          <Logo size={64} />
          <h1>
            QUIZ MASTER <em>5</em>
          </h1>
          <span className="st-login-trophy">
            <TrophyIcon size={50} />
          </span>
        </div>

        <div className="st-panel">
          <label className="st-label" htmlFor="st-name">
            1. ඔබේ නම ලියන්න
          </label>
          <div className="st-input">
            <UserIcon />
            <input
              id="st-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="සම්පූර්ණ නම ලියන්න"
              autoComplete="name"
            />
          </div>

          <span className="st-label">2. ඔබේ පන්තිය තෝරන්න</span>
          <div className="st-grades" role="radiogroup" aria-label="පන්තිය">
            {GRADES.map((g) => (
              <button
                key={g}
                role="radio"
                aria-checked={grade === g}
                className={`st-grade ${GRADE_STYLE[g]?.tone || "blue"}${grade === g ? " on" : ""}`}
                onClick={() => setGrade(g)}
              >
                {grade === g && (
                  <span className="st-grade-check">
                    <CheckBadge />
                  </span>
                )}
                <b>{g}</b>
                <span>වසර</span>
                {GRADE_STYLE[g]?.icon}
              </button>
            ))}
          </div>
        </div>

        <button
          className="st-cta orange"
          disabled={!name.trim() || !grade}
          onClick={() => done({ name: name.trim(), grade })}
        >
          ඉදිරියට යන්න <Chevron />
        </button>

        <div className="st-login-art" aria-hidden="true">
          <BulbIcon size={64} />
          <span className="st-bubble">ඉගෙනීම මැජික් වගේ!</span>
        </div>
      </div>
      <CheerBanner text="ජයගන්න ඔබට හැකියි!" />
    </div>
  );
}
