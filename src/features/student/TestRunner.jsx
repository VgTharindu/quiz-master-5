import { useEffect, useRef, useState } from "react";
import { rpc } from "@/lib/rpc";
import Loading from "@/components/Loading";
import RetryMessage from "@/components/RetryMessage";
import { useTicker } from "@/hooks/useTicker";
import { formatMinSec } from "@/utils/format";
import { loadPendingAnswers, useAnswerSaver } from "./useAnswerSaver";
import SaveStatus from "./SaveStatus";
import { CloudEdge, HeaderDoodles, Sparkles } from "./ui/Decor";
import { CheckBadge, Chevron, ClockIcon, StarMascot } from "./ui/icons";
import { PeekingCat } from "./ui/illustrations";
import Art from "./ui/Art";

const OPTION_TONES = ["blue", "green", "orange", "purple"];

export default function TestRunner({ aid, done }) {
  const [data, setData] = useState(null);
  // Persisted so a refresh resumes on the same question.
  const [i, setI] = useState(+localStorage.getItem("i_" + aid) || 0);
  // { [questionId]: { a: chosen option index, s: seconds spent } }
  const [ans, setAns] = useState({});
  const [msg, setMsg] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const saver = useAnswerSaver(aid);
  const offset = useRef(0); // server time minus device time (ms)
  const enteredAt = useRef(Date.now()); // when the current question was opened
  const finished = useRef(false); // guards against finish() running twice
  useTicker(500);

  const loadQuestions = () => {
    setLoadError(false);
    rpc("get_questions", { aid }, { retries: 4 }).then(({ data, error }) => {
      if (error || !data) return setLoadError(true);
      offset.current = new Date(data.now) - Date.now();
      // Unsent answers stored on the device are newer than the server copy.
      const pending = loadPendingAnswers(aid);
      setAns(pending || data.answers || {});
      if (pending && !data.finished) saver.save(pending);
      setData(data);
      // Preload images so each question renders instantly.
      data.qs.forEach((q) => {
        if (q.image_url) {
          const im = new Image();
          im.src = q.image_url;
        }
      });
    });
  };
  useEffect(loadQuestions, [aid]);

  const q = data?.qs[i],
    now = () => Date.now() + offset.current;
  const total = data ? (new Date(data.end_at) - now()) / 1000 : 1;

  // The deadline is stored so a refresh cannot reset a timed question.
  let left = null;
  if (q?.seconds) {
    const key = "dl_" + aid + "_" + q.id;
    let deadline = +localStorage.getItem(key);
    if (!deadline) {
      deadline = Date.now() + q.seconds * 1000;
      localStorage.setItem(key, deadline);
    }
    left = (deadline - Date.now()) / 1000;
  }

  function leave() {
    const s = Math.round(
      (ans[q.id]?.s || 0) + (Date.now() - enteredAt.current) / 1000,
    );
    enteredAt.current = Date.now();
    const a = { ...ans, [q.id]: { ...ans[q.id], s } };
    setAns(a);
    saver.save(a);
    return a;
  }

  async function finish() {
    if (finished.current) return;
    finished.current = true;
    setSubmitting(true);
    setSubmitError(false);
    if (q && total > 0) leave();
    await saver.flush(); // every answer must reach the server first
    const { error } = await rpc("finish_attempt", { aid }, { retries: 5 });
    if (error) {
      // Answers are safe on the device; let the student retry.
      finished.current = false;
      setSubmitting(false);
      setSubmitError(true);
      return;
    }
    done();
  }

  function go(n) {
    if (n >= data.qs.length) return finish();
    leave();
    setI(n);
    localStorage.setItem("i_" + aid, n);
  }

  function pick(k) {
    const a = { ...ans, [q.id]: { ...ans[q.id], a: k } };
    setAns(a);
    saver.save(a);
  }

  // Runs on every render: auto-submit when the test ends and auto-advance when a timed question expires.
  useEffect(() => {
    if (!data || finished.current || submitError) return;
    if (data.finished || total <= 0) {
      finish();
      return;
    }
    if (left !== null && left <= 0 && !msg) {
      setMsg("⏰ කාලය අවසන්!");
      setTimeout(() => {
        setMsg("");
        go(i + 1);
      }, 1200);
    }
  });

  if (loadError) return <RetryMessage onRetry={loadQuestions} />;
  if (!data) return <Loading />;
  if (submitting)
    return (
      <div className="st-page st-center">
        <StarMascot size={110} />
        <h2>ඉදිරිපත් කරමින්…</h2>
        <SaveStatus status={saver.status} />
      </div>
    );
  if (submitError)
    return (
      <RetryMessage onRetry={finish}>
        ඉදිරිපත් කිරීමට නොහැකි විය. ඔබේ පිළිතුරු සුරැකී ඇත. Internet සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න.
      </RetryMessage>
    );
  if (!q)
    return (
      <div className="wrap">
        <p>ප්‍රශ්න නැත.</p>
      </div>
    );
  const last = i === data.qs.length - 1,
    canBack = i > 0 && !q.seconds && !data.qs[i - 1].seconds;
  return (
    <div className="st-bg purple">
      <header className="st-head st-test-head">
        <HeaderDoodles />
        <Sparkles />
        <div className="st-head-inner">
          <div className="st-q-count">
            ප්‍රශ්නය <b>{i + 1}</b> / {data.qs.length}
          </div>
          <span className="st-time-pill">
            <ClockIcon size={20} color="#1a4bae" /> {formatMinSec(total)}
          </span>
        </div>
        <div className="st-progress" aria-hidden="true">
          <div style={{ width: ((i + 1) * 100) / data.qs.length + "%" }} />
        </div>
        <CloudEdge />
      </header>
      <div className="st-page">
        <SaveStatus status={saver.status} />
        {left !== null && (
          <div className={"st-q-timer" + (left < 10 ? " warn" : "")}>
            <ClockIcon size={24} color={left < 10 ? "#dc2626" : "#e07b00"} />
            {Math.ceil(Math.max(0, left))} තත්පර
          </div>
        )}
        {msg && <div className="st-alert">{msg}</div>}
        <div className="st-question with-pet">
          <span className="st-question-pet">
            <Art name="pencil-mascot" size={70} fallback={<PeekingCat size={78} />} />
          </span>
          <span className="st-marks">ලකුණු {q.marks}</span>
          <h2>{q.body}</h2>
          {q.image_url && <img className="q" src={q.image_url} alt="" decoding="async" />}
        </div>
        <div className="st-options">
          {q.options.map((o, k) => {
            const picked = ans[q.id]?.a === k;
            return (
              <button
                key={k}
                disabled={!!msg}
                aria-pressed={picked}
                className={`st-option ${OPTION_TONES[k % 4]}${picked ? " on" : ""}`}
                onClick={() => pick(k)}
              >
                <span className="st-option-num">{k + 1}</span>
                <span className="st-option-text">{o}</span>
                {picked && <CheckBadge size={26} />}
              </button>
            );
          })}
        </div>
        <div className="st-nav">
          {canBack && (
            <button className="st-cta white" onClick={() => go(i - 1)}>
              <Chevron dir="left" /> පෙර
            </button>
          )}
          <button
            className={"st-cta " + (last ? "orange" : "blue")}
            disabled={!!msg}
            onClick={() => (last ? confirm("ඉදිරිපත් කරන්නද?") && finish() : go(i + 1))}
          >
            {last ? "ඉදිරිපත් කරන්න ✔" : (
              <>
                ඊළඟ <Chevron />
              </>
            )}
          </button>
        </div>
        {q.seconds && (
          <p className="st-note">මෙම ප්‍රශ්නයට කාල සීමාවක් ඇත. පසුව නැවත පැමිණිය නොහැක.</p>
        )}
      </div>
    </div>
  );
}
