// Original cartoon kids and pets for the student screens (inline SVG, no image downloads).

const SKIN = "#F6C59A";
const INK = "#2A1B12";

function Eye({ x, y }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="3.4" ry="4.4" fill={INK} />
      <circle cx={x + 1.2} cy={y - 1.6} r="1.3" fill="#fff" />
    </g>
  );
}

// Boy with a tablet and a girl with a book, studying at a desk.
export function KidsAtDesk({ width = 320 }) {
  return (
    <svg width={width} viewBox="0 0 320 190" aria-hidden="true" style={{ display: "block", maxWidth: "100%" }}>
      {/* bushes */}
      <circle cx="18" cy="150" r="28" fill="#7ED38F" />
      <circle cx="44" cy="160" r="22" fill="#5FC277" />
      <circle cx="300" cy="148" r="30" fill="#7ED38F" />
      <circle cx="276" cy="162" r="20" fill="#5FC277" />
      {/* boy */}
      <g transform="translate(62 18)">
        <path d="M14 150c2-34 16-52 38-52s36 18 38 52z" fill="#fff" stroke="#DCE6F7" strokeWidth="2" />
        <path d="M46 98l6 10 6-10" fill="#2F64D6" />
        <path d="M49 106h6l3 26h-12z" fill="#2F64D6" />
        <circle cx="52" cy="62" r="34" fill={SKIN} />
        <path d="M18 58c-2-28 18-42 36-40 22 2 34 18 32 38-6-10-14-15-22-14-4 6-16 9-26 7-8 3-14 6-20 9z" fill="#3A2A20" />
        <Eye x={40} y={66} />
        <Eye x={64} y={66} />
        <ellipse cx="31" cy="78" rx="5" ry="3" fill="#F59C8C" opacity=".6" />
        <ellipse cx="73" cy="78" rx="5" ry="3" fill="#F59C8C" opacity=".6" />
        <path d="M42 80q10 10 20 0" fill="#C2410C" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="64" r="6" fill={SKIN} />
        <circle cx="87" cy="64" r="6" fill={SKIN} />
        {/* tablet */}
        <rect x="26" y="116" width="54" height="38" rx="6" fill="#1F2A44" />
        <rect x="31" y="121" width="44" height="28" rx="3" fill="#4F86F7" />
        <circle cx="26" cy="132" r="7" fill={SKIN} />
        <circle cx="80" cy="132" r="7" fill={SKIN} />
      </g>
      {/* girl */}
      <g transform="translate(168 22)">
        <path d="M12 146c2-32 16-50 38-50s36 18 38 50z" fill="#fff" stroke="#DCE6F7" strokeWidth="2" />
        <path d="M40 96h20l-10 12z" fill="#2F64D6" />
        <path d="M84 40c14 4 20 20 14 40-4-12-10-18-16-20z" fill="#2B1D16" />
        <circle cx="50" cy="60" r="33" fill={SKIN} />
        <path d="M16 60c-4-26 14-42 34-42s38 14 34 40c-4-10-12-18-24-20-10 8-28 10-44 22z" fill="#2B1D16" />
        <path d="M24 30q26-18 54 2" stroke="#2F64D6" strokeWidth="6" fill="none" strokeLinecap="round" />
        <Eye x={38} y={64} />
        <Eye x={62} y={64} />
        <ellipse cx="29" cy="76" rx="5" ry="3" fill="#F59C8C" opacity=".7" />
        <ellipse cx="71" cy="76" rx="5" ry="3" fill="#F59C8C" opacity=".7" />
        <path d="M41 78q9 9 18 0" fill="none" stroke="#B5442E" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      {/* desk with an open book */}
      <rect x="20" y="166" width="280" height="14" rx="5" fill="#C98B55" />
      <rect x="20" y="176" width="280" height="10" rx="4" fill="#A86E3D" />
      <path d="M190 166c10-8 24-10 36-4 12-6 26-4 36 4z" fill="#fff" stroke="#9DB5E8" strokeWidth="2" />
      <path d="M226 162v4" stroke="#9DB5E8" strokeWidth="2" />
      <circle cx="210" cy="158" r="7" fill={SKIN} />
      <circle cx="244" cy="158" r="7" fill={SKIN} />
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
        <Bunny size={64} />
        <Puppy size={86} />
        <PeekingCat size={84} />
      </div>
    </div>
  );
}
