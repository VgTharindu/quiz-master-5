import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import "./splash.css";

const WORD = "QUIZ MASTER";

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Respect the OS "reduce motion" setting with a much shorter splash.
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showFor = calm ? 700 : 4500;
    const t1 = setTimeout(() => setLeaving(true), showFor);
    const t2 = setTimeout(onDone, showFor + 500); // after the 0.5s exit animation
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div className={"qm-splash" + (leaving ? " out" : "")} role="status" aria-label="QUIZ MASTER 5 load වෙමින්">
      <div className="sp-ring">
        <Logo size={150} />
      </div>
      <h1 className="sp-name" aria-hidden="true">
        {WORD.split("").map((ch, i) => (
          <span key={i} style={{ "--i": i }}>
            {ch === " " ? " " : ch}
          </span>
        ))}
        <em style={{ "--i": WORD.length + 1 }}>5</em>
      </h1>
      <p className="sp-tag">Grade 5 Scholarship Learning Platform</p>
      <div className="sp-bar" aria-hidden="true">
        <i />
      </div>
    </div>
  );
}
