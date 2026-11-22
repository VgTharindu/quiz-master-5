import { StarIcon, StarMascot } from "./icons";

// Scattered background sparkles: [left %, top %, size, colour]
const SPARKLES = [
  [6, 18, 16, "#fff"],
  [88, 10, 20, "#FFE066"],
  [76, 62, 12, "#fff"],
  [14, 70, 12, "#FFE066"],
  [94, 40, 10, "#fff"],
];

export function Sparkles({ items = SPARKLES }) {
  return (
    <div className="st-sparkles" aria-hidden="true">
      {items.map(([x, y, s, c], i) => (
        <span key={i} style={{ left: x + "%", top: y + "%" }}>
          <StarIcon size={s} color={c} />
        </span>
      ))}
    </div>
  );
}

// White wave that softens the bottom edge of a coloured header.
export function CloudEdge() {
  return (
    <svg className="st-cloud" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 40V22c30-14 60-14 90-2 25-16 60-18 85-2 30-14 70-14 100 0 30-12 70-14 125 2v20z"
        fill="#EEF5FF"
      />
    </svg>
  );
}

export function CheerBanner({ text = "හොඳින් උත්සාහ කරන්න!" }) {
  return (
    <div className="st-cheer">
      <svg className="st-cheer-wave" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 20C80 0 140 30 220 14S350 0 400 12V60H0z" fill="#FFD43B" />
      </svg>
      <div className="st-cheer-body">
        <b>{text}</b>
        <StarMascot size={78} />
      </div>
    </div>
  );
}
