import { useEffect, useRef, useState } from "react";
import { isNetworkError, rpc } from "@/lib/rpc";
import Loading from "@/components/Loading";
import RetryMessage from "@/components/RetryMessage";
import CoinIcon from "@/features/coins/CoinIcon";
import CoinRain from "@/features/coins/CoinRain";
import { readCachedCoins, useCoins, writeCachedCoins } from "@/features/coins/useCoins";
import StudentHeader from "./ui/StudentHeader";
import { CheerBanner } from "./ui/Decor";
import { PetsMeadow } from "./ui/illustrations";
import Art from "./ui/Art";
import { MedalIcon, StarMascot, TrophyIcon } from "./ui/icons";

const cheer = (pct) =>
  pct >= 80 ? "නියමයි! 🎉" : pct >= 50 ? "හොඳයි! තව ටිකක් උත්සාහ කරන්න" : "අධෛර්යමත් නොවන්න, ඊළඟ පාර ජයගන්න!";

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
  const pct = result.total ? Math.round((result.score * 100) / result.total) : 0;
  return (
    <div className="st-bg gold">
      <StudentHeader ref={counterRef} me={me} coins={coins} />
      <div className="st-page">
        <div className="st-result">
          <span className="st-result-trophy">{pct >= 50 ? (
            <Art name="trophy" size={84} fallback={<TrophyIcon size={84} />} />
          ) : (
            <Art name="star-mascot" size={84} fallback={<StarMascot size={84} />} />
          )}</span>
          <span className="st-result-pal">
            <Art name={pct >= 50 ? "frog" : "elephant"} size={62} fallback={null} />
          </span>
          <h1>ඔබේ ප්‍රතිඵලය</h1>
          <ScoreRing pct={pct} label={`${result.score} / ${result.total}`} />
          <p className="st-result-cheer">{cheer(pct)}</p>
          <span className="st-chip blue big">
            <MedalIcon size={26} /> ස්ථානය {result.rank} (ළමුන් {result.count} න්)
          </span>
          <div>
            {earned > 0 ? (
              <span ref={badgeRef} className="coin-earned">
                <CoinIcon size={28} /> +{earned} {earned === 1 ? "Coin" : "Coins"}
              </span>
            ) : (
              <span className="coin-earned none">මේ පාර Coins නැහැ. ඊළඟ පාර උත්සාහ කරන්න!</span>
            )}
          </div>
        </div>
        <h2 className="st-section">පිළිතුරු බලන්න</h2>
        {result.items.map((it, k) => (
          <ResultItem key={k} item={it} n={k + 1} />
        ))}
        <button className="st-cta blue" onClick={back}>
          මුල් පිටුවට
        </button>
      </div>
      <PetsMeadow />
      <CheerBanner />
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

function ScoreRing({ pct, label }) {
  const r = 52,
    c = 2 * Math.PI * r;
  const color = pct >= 80 ? "#22a35a" : pct >= 50 ? "#f7931e" : "#e5484d";
  return (
    <div className="st-ring">
      <svg viewBox="0 0 120 120" width="150" height="150" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e7eeff" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="st-ring-label">
        <b>{label}</b>
        <span>{pct}%</span>
      </div>
    </div>
  );
}

function ResultItem({ item, n }) {
  const mine = item.mine === null ? null : +item.mine,
    ok = mine === item.correct;
  return (
    <div className={"st-review " + (mine === null ? "skip" : ok ? "right" : "wrong")}>
      <div className="st-review-q">
        <span className="st-review-n">{n}</span>
        <b>{item.body}</b>
      </div>
      {item.image_url && <img className="q" src={item.image_url} alt="" loading="lazy" />}
      {item.options.map((o, j) => (
        <div key={j} className={"st-review-opt" + (j === item.correct ? " correct" : j === mine ? " mine" : "")}>
          <span>{j === item.correct ? "✓" : j === mine ? "✗" : j + 1}</span>
          {o}
          {j === item.correct && !ok ? <em> (නිවැරදි පිළිතුර)</em> : ""}
        </div>
      ))}
      {mine === null && <p className="st-note">පිළිතුරක් දී නැත</p>}
    </div>
  );
}
