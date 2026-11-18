import { useEffect, useRef, useState } from "react";
import { isNetworkError, rpc } from "@/lib/rpc";
import Loading from "@/components/Loading";
import RetryMessage from "@/components/RetryMessage";
import TopBar from "@/components/TopBar";
import CoinIcon from "@/features/coins/CoinIcon";
import CoinCounter from "@/features/coins/CoinCounter";
import CoinRain from "@/features/coins/CoinRain";
import { readCachedCoins, useCoins, writeCachedCoins } from "@/features/coins/useCoins";

const countCorrect = (items) =>
  items.filter((it) => it.mine !== null && +it.mine === it.correct).length;

// The coin animation plays only the first time a result is opened.
const seenKey = (aid) => "qm_coins_seen_" + aid;
const wasSeen = (aid) => {
  try {
    return localStorage.getItem(seenKey(aid)) === "1";
  } catch {
    return false;
  }
};
const markSeen = (aid) => {
  try {
    localStorage.setItem(seenKey(aid), "1");
  } catch {}
};

export default function ResultView({ me, aid, back }) {
  const [result, setResult] = useState(null);
  const [netError, setNetError] = useState(false);
  const { coins, setCoins, refresh } = useCoins(me);
  const [raining, setRaining] = useState(false);
  const finalTotal = useRef(0);
  const badgeRef = useRef(null);
  const counterRef = useRef(null);

  const load = () => {
    setNetError(false);
    rpc("get_result", { aid }, { retries: 4 }).then((res) => {
      if (!res.error) return setResult(res.data);
      // Network errors get a retry button; other errors (e.g. test not finished yet) keep the original alert.
      if (isNetworkError(res)) return setNetError(true);
      alert("ප්‍රතිඵල තවම නැත");
      back();
    });
  };
  useEffect(load, [aid]);

  const earned = result ? countCorrect(result.items) : 0;

  useEffect(() => {
    if (!result) return;
    const firstView = !wasSeen(aid);
    // Mark immediately so the offline fallback below can never count the same test twice.
    markSeen(aid);
    refresh(false).then((serverTotal) => {
      let total = serverTotal;
      if (total === null) {
        // Server unavailable: keep a running total on the device instead.
        total = (readCachedCoins(me) ?? 0) + (firstView ? earned : 0);
        writeCachedCoins(me, total);
      }
      finalTotal.current = total;
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (firstView && earned > 0 && !calm) {
        setCoins(total - earned);
        setRaining(true);
      } else {
        setCoins(total);
      }
    });
  }, [result]);

  if (netError) return <RetryMessage onRetry={load} />;
  if (!result) return <Loading />;
  return (
    <div>
      <TopBar left={`👤 ${me.name}`} right={<CoinCounter ref={counterRef} value={coins} />} />
      <div className="wrap">
        <h1>ඔබේ ප්‍රතිඵලය</h1>
        <div className="card" style={{ textAlign: "center" }}>
          <div className="tm" style={{ fontSize: 40 }}>
            {result.score} / {result.total}
          </div>
          🏆 ස්ථානය: {result.rank} (ළමුන් {result.count} න් අතරින්)
          <br />
          {earned > 0 ? (
            <span ref={badgeRef} className="coin-earned">
              <CoinIcon size={28} /> +{earned} රන් කාසි
            </span>
          ) : (
            <span className="coin-earned none">
              මේ පාර කාසි නැහැ. ඊළඟ පාර උත්සාහ කරන්න!
            </span>
          )}
        </div>
        {result.items.map((it, k) => (
          <ResultItem key={k} item={it} n={k + 1} />
        ))}
        <button onClick={back} style={{ width: "100%" }}>
          මුල් පිටුවට
        </button>
      </div>
      {raining && (
        <CoinRain
          count={earned}
          fromRef={badgeRef}
          toRef={counterRef}
          onLand={(n) => setCoins((c) => (c ?? 0) + n)}
          onDone={() => {
            setRaining(false);
            setCoins(finalTotal.current);
          }}
        />
      )}
    </div>
  );
}

function ResultItem({ item, n }) {
  const mine = item.mine === null ? null : +item.mine,
    ok = mine === item.correct;
  return (
    <div className="card">
      <b>
        {n}. {item.body}
      </b>
      {item.image_url && (
        <img className="q" src={item.image_url} alt="" loading="lazy" />
      )}
      {item.options.map((o, j) => (
        <div
          key={j}
          className={j === item.correct ? "ok" : j === mine ? "bad" : ""}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "2px solid #e2e8f0",
            margin: "6px 0",
          }}
        >
          {j === mine ? (ok ? "✅ " : "❌ ") : ""}
          {o}
          {j === item.correct && !ok ? " (නිවැරදි පිළිතුර)" : ""}
        </div>
      ))}
      {mine === null && <span className="warn">පිළිතුරක් දී නැත</span>}
    </div>
  );
}
