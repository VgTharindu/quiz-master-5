import { useState } from "react";
import { SAMPLE } from "./landingData";

export default function SampleQuestion({ onStudent }) {
  const [pick, setPick] = useState(null);
  const done = pick === SAMPLE.correct;
  return (
    <div className="qm-paper">
      {done && (
        <div className="qm-burst" aria-hidden="true">
          {Array.from({ length: 10 }, (_, k) => (
            <span key={k} style={{ "--a": k * 36 + "deg" }}>
              ★
            </span>
          ))}
        </div>
      )}
      <div className="qm-paper-head">
        <span>නියැදි ප්‍රශ්නය</span>
        <span>ලකුණු 1</span>
      </div>
      <p className="qm-q">{SAMPLE.q}</p>
      <div className="qm-bubbles" role="radiogroup" aria-label="පිළිතුරු">
        {SAMPLE.options.map((o, k) => {
          const state =
            pick === k ? (k === SAMPLE.correct ? "right" : "wrong") : "";
          return (
            <button
              key={k}
              role="radio"
              aria-checked={pick === k}
              className={"qm-bubble " + state}
              disabled={done}
              onClick={() => setPick(k)}
            >
              <i>{k + 1}</i>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      <p className="qm-feedback" aria-live="polite">
        {pick === null && "ඔබ හිතන පිළිතුරේ කවය ඔබන්න."}
        {pick !== null && !done && "එය නොවෙයි. තව එකක් උත්සාහ කරන්න."}
        {done && (
          <>
            <b className="qm-tick">✓</b> නියමයි! {SAMPLE.why}
          </>
        )}
      </p>
      {done && (
        <button className="qm-main qm-full" onClick={onStudent}>
          සැබෑ පරීක්ෂණයට යන්න
        </button>
      )}
    </div>
  );
}
