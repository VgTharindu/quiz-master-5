import { StarIcon, StarMascot } from "./icons";
import Art from "./Art";

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

// Layered puffy clouds along the bottom edge of the blue header.
export function CloudEdge() {
  return (
    <svg className="st-cloud" viewBox="0 0 400 54" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 54V30c14-10 34-12 48-2 10-16 36-20 52-6 14-14 40-14 54 0 14-16 44-16 58 0 14-12 38-14 52-2 16-14 42-12 54 4 12-12 34-12 46 2 8-6 20-8 36-4v32z"
        fill="#fff"
        opacity=".55"
      />
      <path
        d="M0 54V40c16-12 40-12 56 0 12-14 38-16 54-2 14-12 36-12 50 2 16-14 46-14 62 2 14-10 34-10 48 0 16-14 44-12 58 2 12-8 30-10 44-2 10-4 20-4 28-2v14z"
        fill="#d9e9ff"
      />
    </svg>
  );
}

// Faint book and atom line art in the header corners.
export function HeaderDoodles() {
  return (
    <div className="st-head-doodles" aria-hidden="true">
      <svg width="74" height="60" viewBox="0 0 74 60" style={{ left: 8, top: 54 }}>
        <g fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round">
          <path d="M4 10c11-5 22-4 33 3v42c-11-7-22-8-33-3zM70 10c-11-5-22-4-33 3v42c11-7 22-8 33-3z" />
          <path d="M10 22h20M10 30h20M44 22h20M44 30h20" strokeLinecap="round" />
        </g>
      </svg>
      <svg width="70" height="70" viewBox="0 0 70 70" style={{ right: 10, top: 4 }}>
        <g fill="none" stroke="#fff" strokeWidth="3">
          <ellipse cx="35" cy="35" rx="30" ry="11" />
          <ellipse cx="35" cy="35" rx="30" ry="11" transform="rotate(60 35 35)" />
          <ellipse cx="35" cy="35" rx="30" ry="11" transform="rotate(-60 35 35)" />
        </g>
        <circle cx="35" cy="35" r="5" fill="#fff" />
      </svg>
    </div>
  );
}

export function CheerBanner({ text = "හොඳින් උත්සාහ කරන්න!" }) {
  return (
    <div className="st-cheer">
      <svg className="st-cheer-wave" viewBox="0 0 400 56" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 18C70 0 140 26 220 12S350 -2 400 10V56H0z" fill="#FFC21A" />
        <path d="M0 30C80 12 150 38 230 24S350 12 400 22V56H0z" fill="#FFD43B" />
      </svg>
      <div className="st-cheer-body">
        <StarIcon size={18} color="#FFF3B0" />
        <b>{text}</b>
        <Art name="star-mascot" size={78} fallback={<StarMascot size={78} />} />
      </div>
    </div>
  );
}
