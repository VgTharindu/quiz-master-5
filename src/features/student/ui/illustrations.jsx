// Original cartoon kids and pets for the student screens (inline SVG, no image downloads).

import Art from "./Art";

const INK = "#2A1B12";

function Eye({ x, y }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="3.4" ry="4.4" fill={INK} />
      <circle cx={x + 1.2} cy={y - 1.6} r="1.3" fill="#fff" />
    </g>
  );
}

const OUTLINE = "#4A2E1E";

// Shared defs for skin and hair shading; each component gets its own ids.
function Defs({ id }) {
  return (
    <defs>
      <radialGradient id={id + "skin"} cx="45%" cy="40%" r="65%">
        <stop offset="0" stopColor="#FFE2C6" />
        <stop offset="0.7" stopColor="#F7C59B" />
        <stop offset="1" stopColor="#EBA97A" />
      </radialGradient>
      <linearGradient id={id + "hair"} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5A3826" />
        <stop offset="1" stopColor="#2E1B10" />
      </linearGradient>
      <linearGradient id={id + "shirt"} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#DCE7F8" />
      </linearGradient>
    </defs>
  );
}

function BigEye({ x, y }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="6.4" ry="7.6" fill="#fff" stroke={OUTLINE} strokeWidth="1.8" />
      <circle cx={x} cy={y + 0.8} r="5.6" fill="#4A2F22" />
      <circle cx={x} cy={y + 0.8} r="2.8" fill="#120B07" />
      <circle cx={x + 2} cy={y - 1.6} r="2" fill="#fff" />
      <circle cx={x - 1.8} cy={y + 3} r="1" fill="#fff" />
    </g>
  );
}

function Face({ id, smileOpen = true }) {
  return (
    <g>
      <circle cx="18" cy="58" r="8" fill={`url(#${id}skin)`} stroke={OUTLINE} strokeWidth="2" />
      <circle cx="82" cy="58" r="8" fill={`url(#${id}skin)`} stroke={OUTLINE} strokeWidth="2" />
      <path
        d="M50 22c19 0 32 14 32 34 0 21-14 36-32 36S18 77 18 56c0-20 13-34 32-34z"
        fill={`url(#${id}skin)`}
        stroke={OUTLINE}
        strokeWidth="2.4"
      />
      <path d="M33 50q6-5 12-1M55 49q6-4 12 1" stroke={OUTLINE} strokeWidth="3" fill="none" strokeLinecap="round" />
      <BigEye x={39} y={60} />
      <BigEye x={61} y={60} />
      <path d="M49 67q2 3 4 1" stroke="#C47A55" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="29" cy="73" rx="6" ry="3.6" fill="#FF8A80" opacity=".45" />
      <ellipse cx="71" cy="73" rx="6" ry="3.6" fill="#FF8A80" opacity=".45" />
      {smileOpen ? (
        <g>
          <path d="M39 74q11 14 22 0z" fill="#8E1F1F" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
          <path d="M41 75h18l-1.5 3h-15z" fill="#fff" />
          <ellipse cx="50" cy="81.5" rx="5" ry="2.6" fill="#F27C86" />
        </g>
      ) : (
        <path d="M41 75q9 8 18 0" stroke={OUTLINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

// Head is drawn in a 100x100 box; place it with a transform.
export function BoyHead({ id = "b" }) {
  return (
    <g>
      <Defs id={id} />
      <Face id={id} />
      <path
        d="M17 54c-4-22 8-38 26-40l2-9 7 7 7-7 2 9c18 3 28 18 23 40-5-9-12-14-20-15-3 5-12 9-22 8-9 1-17 3-25 7z"
        fill={`url(#${id}hair)`}
        stroke={OUTLINE}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M36 20q10-5 20-2" stroke="#8A5A3C" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
  );
}

export function GirlHead({ id = "g" }) {
  return (
    <g>
      <Defs id={id} />
      <path d="M78 34c18 6 22 30 10 48-2-14-8-22-16-26z" fill={`url(#${id}hair)`} stroke={OUTLINE} strokeWidth="2.2" />
      <ellipse cx="80" cy="36" rx="7" ry="5" fill="#2F64D6" stroke={OUTLINE} strokeWidth="1.6" transform="rotate(-30 80 36)" />
      <Face id={id} smileOpen={false} />
      <path
        d="M17 58c-5-24 10-42 33-42s38 16 33 40c-5-10-12-16-22-18-8 7-24 8-35 12-4 2-7 5-9 8z"
        fill={`url(#${id}hair)`}
        stroke={OUTLINE}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M32 26q12-7 26-4" stroke="#8A5A3C" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
      <path d="M33 53l-3-3M67 53l3-3" stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function Shirt({ id, tie = true }) {
  return (
    <g>
      <path d="M42 50h16v20H42z" fill="#EBB083" stroke={OUTLINE} strokeWidth="2" />
      <path d="M8 100c2-24 18-36 42-36s40 12 42 36z" fill={`url(#${id}shirt)`} stroke={OUTLINE} strokeWidth="2.2" />
      <path d="M38 66l12 10 12-10" fill="#fff" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      {tie && <path d="M47 76h6l3 22h-12z" fill="#2F64D6" stroke={OUTLINE} strokeWidth="1.6" />}
    </g>
  );
}

// Header avatar: smiling student with a school bag.
export function KidAvatar({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block", flex: "none" }}>
      <defs>
        <radialGradient id="avbg" cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#F2F8FF" />
          <stop offset="1" stopColor="#BFD7FF" />
        </radialGradient>
        <clipPath id="avclip">
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#fff" />
      <circle cx="50" cy="50" r="46" fill="url(#avbg)" />
      <g clipPath="url(#avclip)">
        <g transform="translate(6 30) scale(0.88)">
          <path d="M14 100c0-20 6-34 14-38M86 100c0-20-6-34-14-38" stroke="#2F64D6" strokeWidth="9" fill="none" />
          <Shirt id="av" />
        </g>
        <g transform="translate(8 0) scale(0.84)">
          <BoyHead id="av" />
        </g>
      </g>
    </svg>
  );
}

// Boy with a tablet and a girl with a book, studying at a desk.
export function KidsAtDesk({ width = 320 }) {
  return (
    <svg width={width} viewBox="0 0 320 200" aria-hidden="true" style={{ display: "block", maxWidth: "100%" }}>
      <defs>
        <linearGradient id="kdesk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E0A46B" />
          <stop offset="1" stopColor="#B4763F" />
        </linearGradient>
        <radialGradient id="kbush" cx="40%" cy="30%" r="70%">
          <stop offset="0" stopColor="#9BE3A6" />
          <stop offset="1" stopColor="#45B060" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="150" r="30" fill="url(#kbush)" />
      <circle cx="48" cy="164" r="22" fill="url(#kbush)" />
      <circle cx="300" cy="146" r="32" fill="url(#kbush)" />
      <circle cx="272" cy="164" r="22" fill="url(#kbush)" />
      {/* boy */}
      <g transform="translate(46 28) scale(1.12)">
        <Shirt id="kb" />
      </g>
      <g transform="translate(54 6) scale(1)">
        <BoyHead id="kb" />
      </g>
      <g>
        <rect x="70" y="138" width="62" height="42" rx="7" fill="#22304F" stroke={OUTLINE} strokeWidth="2" />
        <rect x="75" y="143" width="52" height="32" rx="3" fill="#5B93FF" />
        <path d="M80 148l18 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
        <circle cx="70" cy="156" r="8" fill="#F7C59B" stroke={OUTLINE} strokeWidth="2" />
        <circle cx="132" cy="156" r="8" fill="#F7C59B" stroke={OUTLINE} strokeWidth="2" />
      </g>
      {/* girl */}
      <g transform="translate(166 34) scale(1.08)">
        <Shirt id="kg" />
      </g>
      <g transform="translate(172 10) scale(0.96)">
        <GirlHead id="kg" />
      </g>
      {/* desk and book */}
      <rect x="18" y="176" width="284" height="14" rx="5" fill="url(#kdesk)" stroke={OUTLINE} strokeWidth="2" />
      <path d="M188 176c12-9 28-11 40-4 12-7 28-5 40 4z" fill="#fff" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M228 172v4" stroke={OUTLINE} strokeWidth="2" />
      <path d="M186 178h84" stroke="#2F9E6B" strokeWidth="4" />
      <circle cx="204" cy="168" r="8" fill="#F7C59B" stroke={OUTLINE} strokeWidth="2" />
      <circle cx="252" cy="168" r="8" fill="#F7C59B" stroke={OUTLINE} strokeWidth="2" />
    </svg>
  );
}

// Orange kitten peeking over an edge, paws first.
export function PeekingCat({ size = 90 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 100 70" aria-hidden="true" style={{ display: "block" }}>
      <path d="M18 30L22 4l18 16zM82 30L78 4 60 20z" fill="#F59E42" stroke="#C26A12" strokeWidth="2" strokeLinejoin="round" />
      <path d="M23 24l2-12 9 8zM77 24l-2-12-9 8z" fill="#FFB8C6" />
      <ellipse cx="50" cy="44" rx="36" ry="28" fill="#F59E42" stroke="#C26A12" strokeWidth="2" />
      <path d="M50 18v10M40 20l3 8M60 20l-3 8" stroke="#D97A1E" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="50" cy="52" rx="16" ry="12" fill="#FFE3C2" />
      <Eye x={37} y={42} />
      <Eye x={63} y={42} />
      <path d="M47 50h6l-3 3z" fill="#E2627A" />
      <path d="M50 53q-4 5-8 2M50 53q4 5 8 2" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M14 48l14 2M14 55l14-1M86 48l-14 2M86 55l-14-1" stroke="#7A4A1A" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="30" cy="66" rx="11" ry="7" fill="#F59E42" stroke="#C26A12" strokeWidth="2" />
      <ellipse cx="70" cy="66" rx="11" ry="7" fill="#F59E42" stroke="#C26A12" strokeWidth="2" />
    </svg>
  );
}

export function Puppy({ size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block" }}>
      <ellipse cx="50" cy="82" rx="26" ry="16" fill="#F3D9B1" stroke="#C99A5B" strokeWidth="2" />
      <ellipse cx="38" cy="94" rx="8" ry="5" fill="#F3D9B1" stroke="#C99A5B" strokeWidth="2" />
      <ellipse cx="62" cy="94" rx="8" ry="5" fill="#F3D9B1" stroke="#C99A5B" strokeWidth="2" />
      <path d="M22 26c-10 6-12 26-4 34 6 2 10-6 12-14z" fill="#8B5A2B" />
      <path d="M78 26c10 6 12 26 4 34-6 2-10-6-12-14z" fill="#8B5A2B" />
      <circle cx="50" cy="44" r="28" fill="#F3D9B1" stroke="#C99A5B" strokeWidth="2" />
      <ellipse cx="62" cy="34" rx="9" ry="8" fill="#E2B57A" opacity=".8" />
      <Eye x={40} y={42} />
      <Eye x={60} y={42} />
      <ellipse cx="50" cy="54" rx="12" ry="9" fill="#fff" />
      <ellipse cx="50" cy="50" rx="5" ry="3.6" fill={INK} />
      <path d="M50 54v4M50 58q-5 4-9 0M50 58q5 4 9 0" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M47 60q3 9 6 0z" fill="#F06F87" />
      <ellipse cx="31" cy="54" rx="4.5" ry="3" fill="#F59C8C" opacity=".6" />
      <ellipse cx="69" cy="54" rx="4.5" ry="3" fill="#F59C8C" opacity=".6" />
      <path d="M36 72q14 6 28 0" stroke="#E5484D" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="76" r="3.5" fill="#FFD43B" />
    </svg>
  );
}

export function Bunny({ size = 84 }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 80 92" aria-hidden="true" style={{ display: "block" }}>
      <ellipse cx="28" cy="20" rx="7" ry="20" fill="#fff" stroke="#D5DCEB" strokeWidth="2" transform="rotate(-10 28 20)" />
      <ellipse cx="52" cy="20" rx="7" ry="20" fill="#fff" stroke="#D5DCEB" strokeWidth="2" transform="rotate(10 52 20)" />
      <ellipse cx="28" cy="22" rx="3" ry="13" fill="#FFC2D1" transform="rotate(-10 28 22)" />
      <ellipse cx="52" cy="22" rx="3" ry="13" fill="#FFC2D1" transform="rotate(10 52 22)" />
      <ellipse cx="40" cy="74" rx="22" ry="16" fill="#fff" stroke="#D5DCEB" strokeWidth="2" />
      <circle cx="40" cy="50" r="22" fill="#fff" stroke="#D5DCEB" strokeWidth="2" />
      <Eye x={32} y={48} />
      <Eye x={48} y={48} />
      <path d="M38 55h4l-2 2z" fill="#F06F87" />
      <path d="M40 57q-3 4-6 1M40 57q3 4 6 1" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="26" cy="57" rx="4" ry="2.6" fill="#FFB3C4" opacity=".8" />
      <ellipse cx="54" cy="57" rx="4" ry="2.6" fill="#FFB3C4" opacity=".8" />
      <path d="M58 60c10-2 16 4 14 12" stroke="#FF8A3D" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M70 68l6-6M72 72l7-2" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Owl with round glasses reading a book.
export function ReadingOwl({ size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block" }}>
      <path d="M22 22l8 10M78 22l-8 10" stroke="#7A4A1A" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="50" cy="58" rx="34" ry="38" fill="#A8703C" />
      <ellipse cx="50" cy="66" rx="22" ry="26" fill="#E9C99A" />
      <path d="M38 62q4 3 8 0M54 62q4 3 8 0M42 72q4 3 8 0M50 72q4 3 8 0" stroke="#C99A5B" strokeWidth="2" fill="none" />
      <circle cx="36" cy="40" r="14" fill="#fff" stroke="#3A2A20" strokeWidth="3" />
      <circle cx="64" cy="40" r="14" fill="#fff" stroke="#3A2A20" strokeWidth="3" />
      <path d="M48 40h4" stroke="#3A2A20" strokeWidth="3" />
      <circle cx="37" cy="41" r="6" fill={INK} />
      <circle cx="63" cy="41" r="6" fill={INK} />
      <circle cx="39" cy="39" r="2" fill="#fff" />
      <circle cx="65" cy="39" r="2" fill="#fff" />
      <path d="M46 52l4 6 4-6z" fill="#F59E0B" />
      <path d="M22 76c10-6 20-6 28 0 8-6 18-6 28 0v18c-10-6-20-6-28 0-8-6-18-6-28 0z" fill="#2F64D6" />
      <path d="M26 79c8-4 16-4 22 0v12c-6-4-14-4-22 0zM74 79c-8-4-16-4-22 0v12c6-4 14-4 22 0z" fill="#fff" />
      <ellipse cx="22" cy="82" rx="6" ry="8" fill="#8B5A2B" />
      <ellipse cx="78" cy="82" rx="6" ry="8" fill="#8B5A2B" />
    </svg>
  );
}

// Green meadow with pets sitting on it, shown above the cheering banner.
export function PetsMeadow() {
  return (
    <div className="st-meadow" aria-hidden="true">
      <svg className="st-meadow-hill" viewBox="0 0 400 70" preserveAspectRatio="none">
        <path d="M0 40C70 10 140 20 200 34S330 18 400 30V70H0z" fill="#A7E3B4" />
        <path d="M0 54C90 34 170 44 240 54S350 44 400 50V70H0z" fill="#7ED38F" />
      </svg>
      <div className="st-meadow-pets">
        <Art name="bunny" size={70} fallback={<Bunny size={64} />} />
        <Art name="puppy" size={90} fallback={<Puppy size={86} />} />
        <Art name="cat" size={86} fallback={<PeekingCat size={84} />} />
      </div>
    </div>
  );
}
