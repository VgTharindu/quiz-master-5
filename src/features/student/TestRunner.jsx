import { useEffect, useRef, useState } from "react";
import { rpc } from "@/lib/rpc";
import Loading from "@/components/Loading";
import TopBar from "@/components/TopBar";
import RetryMessage from "@/components/RetryMessage";
import { useTicker } from "@/hooks/useTicker";
import { formatMinSec } from "@/utils/format";
import { loadPendingAnswers, useAnswerSaver } from "./useAnswerSaver";
import SaveStatus from "./SaveStatus";

// පරීක්ෂණය කරන පිටුව. aid = attempt id, done = ඉදිරිපත් කළ පසු call වෙනවා
export default function TestRunner({ aid, done }) {
  const [data, setData] = useState(null);
  // දැන් පෙන්වන ප්‍රශ්නයේ index එක. refresh කළොත් එතනින්ම පටන් ගන්න localStorage එකේ තියාගන්නවා
  const [i, setI] = useState(+localStorage.getItem("i_" + aid) || 0);
  // ans = { [questionId]: { a: තෝරපු පිළිතුර, s: ගත කළ තත්පර } }
  const [ans, setAns] = useState({});
  const [msg, setMsg] = useState("");
  const [loadError, setLoadError] = useState(false); // ප්‍රශ්න load කරන්න බැරි වුණාද
  const [submitting, setSubmitting] = useState(false); // ඉදිරිපත් කරමින්
  const [submitError, setSubmitError] = useState(false); // ඉදිරිපත් කරන්න බැරි වුණාද
  const saver = useAnswerSaver(aid);
  const offset = useRef(0); // server වෙලාව - phone වෙලාව
  const enteredAt = useRef(Date.now()); // මේ ප්‍රශ්නයට ආපු වෙලාව
  const finished = useRef(false); // finish() දෙපාරක් run වෙන එක නවත්වන්න
  useTicker(500); // timers තත්පර භාගයකට වරක් යාවත්කාලීන වෙනවා

  const loadQuestions = () => {
    setLoadError(false);
    rpc("get_questions", { aid }, { retries: 4 }).then(({ data, error }) => {
      if (error || !data) return setLoadError(true);
      offset.current = new Date(data.now) - Date.now();
      // offline වෙලා යවන්න බැරි වුණ පිළිතුරු phone එකේ තියෙනවා නම්, ඒවා server එකේ ඒවාට වඩා අලුත්
      const pending = loadPendingAnswers(aid);
      setAns(pending || data.answers || {});
      if (pending && !data.finished) saver.save(pending);
      setData(data);
      // ඉක්මනින් පෙන්වන්න පින්තූර කලින්ම load කරලා තියනවා
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
  // මුළු පරීක්ෂණය අවසන් වීමට ඉතිරි තත්පර
  const total = data ? (new Date(data.end_at) - now()) / 1000 : 1;

  // මේ ප්‍රශ්නයට කාල සීමාවක් තියෙනවා නම් ඉතිරි තත්පර. deadline එක localStorage එකේ තියෙන නිසා refresh කළත් reset වෙන්නේ නැහැ
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

  // ප්‍රශ්නයෙන් ඉවත් වෙද්දී ගත කළ කාලය එකතු කරලා server එකට save කරනවා
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
    await saver.flush(); // හැම පිළිතුරක්ම server එකට ගිහින් ඉවර වෙනකම් බලාගෙන ඉන්නවා
    const { error } = await rpc("finish_attempt", { aid }, { retries: 5 });
    if (error) {
      // ඉදිරිපත් කරන්න බැරි වුණා. පිළිතුරු සුරැකිලා තියෙනවා, ළමයාට නැවත උත්සාහ කරන්න පුළුවන්
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

  // හැම render එකකදීම: මුළු කාලය ඉවර නම් ඉදිරිපත් කරනවා, ප්‍රශ්නයේ කාලය ඉවර නම් ඊළඟ ප්‍රශ්නයට යනවා
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
      <div className="wrap" style={{ textAlign: "center", paddingTop: 40 }}>
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
    <div>
      <TopBar
        left={`ප්‍රශ්නය ${i + 1} / ${data.qs.length}`}
        right={<span>මුළු කාලය: {formatMinSec(total)}</span>}
      />
      <div className="wrap">
        <SaveStatus status={saver.status} />
        {left !== null && (
          <div className={"tm " + (left < 10 ? "warn" : "")}>
            ⏱ {Math.ceil(Math.max(0, left))} තත්පර
          </div>
        )}
        {msg && (
          <div className="card warn">
            <b>{msg}</b>
          </div>
        )}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{q.body}</h2>
          {q.image_url && (
            <img className="q" src={q.image_url} alt="" decoding="async" />
          )}
          <small>ලකුණු {q.marks}</small>
        </div>
        {q.options.map((o, k) => (
          <button
            key={k}
            disabled={!!msg}
            className={"opt " + (ans[q.id]?.a === k ? "sel" : "")}
            onClick={() => pick(k)}
          >
            {k + 1}. {o}
          </button>
        ))}
        <div className="row" style={{ marginTop: 14 }}>
          {canBack && (
            <button className="w" onClick={() => go(i - 1)}>
              ◀ පෙර
            </button>
          )}
          <button
            className={last ? "g" : ""}
            disabled={!!msg}
            onClick={() =>
              last ? confirm("ඉදිරිපත් කරන්නද?") && finish() : go(i + 1)
            }
          >
            {last ? "ඉදිරිපත් කරන්න ✔" : "ඊළඟ ▶"}
          </button>
        </div>
        {q.seconds && (
          <p>
            <small>
              මෙම ප්‍රශ්නයට කාල සීමාවක් ඇත. පසුව නැවත පැමිණිය නොහැක.
            </small>
          </p>
        )}
      </div>
    </div>
  );
}
