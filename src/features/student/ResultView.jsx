import { useEffect, useState } from "react";
import { isNetworkError, rpc } from "@/lib/rpc";
import Loading from "@/components/Loading";
import RetryMessage from "@/components/RetryMessage";

// පරීක්ෂණයේ ප්‍රතිඵලය: ලකුණු, ස්ථානය සහ එක් එක් ප්‍රශ්නයේ නිවැරදි පිළිතුර
export default function ResultView({ aid, back }) {
  const [result, setResult] = useState(null);
  const [netError, setNetError] = useState(false);
  const load = () => {
    setNetError(false);
    rpc("get_result", { aid }, { retries: 4 }).then((res) => {
      if (!res.error) return setResult(res.data);
      // network ගැටලුවක් නම් නැවත උත්සාහ කරන්න බොත්තමක්, නැත්නම් (උදා: පරීක්ෂණය තවම ඉවර නැහැ) කලින් වගේම
      if (isNetworkError(res)) return setNetError(true);
      alert("ප්‍රතිඵල තවම නැත");
      back();
    });
  };
  useEffect(load, [aid]);
  if (netError) return <RetryMessage onRetry={load} />;
  if (!result) return <Loading />;
  return (
    <div className="wrap">
      <h1>ඔබේ ප්‍රතිඵලය</h1>
      <div className="card" style={{ textAlign: "center" }}>
        <div className="tm" style={{ fontSize: 40 }}>
          {result.score} / {result.total}
        </div>
        🏆 ස්ථානය: {result.rank} (ළමුන් {result.count} න් අතරින්)
      </div>
      {result.items.map((it, k) => (
        <ResultItem key={k} item={it} n={k + 1} />
      ))}
      <button onClick={back} style={{ width: "100%" }}>
        මුල් පිටුවට
      </button>
    </div>
  );
}

// එක් ප්‍රශ්නයක්: ළමයා තෝරපු පිළිතුර (✅/❌) සහ නිවැරදි පිළිතුර
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
