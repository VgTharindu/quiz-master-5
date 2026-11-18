import { useEffect, useRef } from "react";
import CoinIcon from "./CoinIcon";
import "./coins.css";

const MAX_VISIBLE = 20;
const SIZE = 34;

// Coins pop out around `fromRef`, then fly one after another into `toRef`.
// onLand(n) fires each time a coin arrives, with the number of coins it represents
// (more than 1 when `count` exceeds MAX_VISIBLE). onDone fires after the last one.
export default function CoinRain({ count, fromRef, toRef, onLand, onDone }) {
  const visible = Math.min(count, MAX_VISIBLE);
  const coinRefs = useRef([]);

  useEffect(() => {
    const from = fromRef.current?.getBoundingClientRect();
    const to = toRef.current?.getBoundingClientRect();
    if (!from || !to || !visible) {
      onDone();
      return;
    }
    const ox = from.left + from.width / 2 - SIZE / 2;
    const oy = from.top + from.height / 2 - SIZE / 2;
    const tx = to.left + to.width / 2 - SIZE / 2;
    const ty = to.top + to.height / 2 - SIZE / 2;

    // Spread `count` over the visible coins so the counter still ends on the exact total.
    const base = Math.floor(count / visible),
      extra = count % visible;
    let landed = 0;

    const animations = coinRefs.current.slice(0, visible).map((el, i) => {
      const angle = (i / visible) * Math.PI * 2;
      const spread = 50 + (i % 3) * 22;
      const px = ox + Math.cos(angle) * spread;
      const py = oy + Math.sin(angle) * spread * 0.6;
      const anim = el.animate(
        [
          { transform: `translate(${ox}px, ${oy}px) scale(0)`, opacity: 1 },
          { transform: `translate(${px}px, ${py}px) scale(1.25)`, opacity: 1, offset: 0.22 },
          { transform: `translate(${px}px, ${py}px) scale(1)`, opacity: 1, offset: 0.42 },
          { transform: `translate(${tx}px, ${ty}px) scale(0.55)`, opacity: 1, offset: 0.97 },
          { transform: `translate(${tx}px, ${ty}px) scale(0.55)`, opacity: 0 },
        ],
        { duration: 1300, delay: i * 110, easing: "cubic-bezier(0.5, 0, 0.3, 1)", fill: "both" },
      );
      anim.onfinish = () => {
        onLand(base + (i < extra ? 1 : 0));
        if (++landed === visible) onDone();
      };
      return anim;
    });
    return () => animations.forEach((a) => (a.onfinish = null) || a.cancel());
    // Runs once per rain; parent remounts the component for a new one.
  }, []);

  return (
    <div className="coin-rain" aria-hidden="true">
      {Array.from({ length: visible }, (_, i) => (
        <span key={i} ref={(el) => (coinRefs.current[i] = el)} className="coin-rain-coin">
          <CoinIcon size={SIZE} />
        </span>
      ))}
    </div>
  );
}
