// Colourful SVG illustrations for the student screens. Inline SVG keeps them
// instant on slow networks (no image downloads).

export function TrophyIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M18 10h28v14a14 14 0 0 1-28 0z" fill="#FFC928" stroke="#E09B00" strokeWidth="2" />
      <path d="M18 14H9v4a10 10 0 0 0 10 10M46 14h9v4a10 10 0 0 1-10 10" fill="none" stroke="#E09B00" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 37h8v9h-8z" fill="#F0AE00" />
      <rect x="20" y="46" width="24" height="8" rx="3" fill="#E09B00" />
      <path d="M32 15l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" fill="#FFF3B0" />
      <ellipse cx="24" cy="16" rx="2" ry="5" fill="#fff" opacity=".5" />
    </svg>
  );
}

export function MedalIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M16 4h12l8 20H24z" fill="#E0457B" />
      <path d="M48 4H36l-8 20h12z" fill="#B23A8F" />
      <circle cx="32" cy="40" r="17" fill="#FFC928" stroke="#E09B00" strokeWidth="3" />
      <circle cx="32" cy="40" r="11" fill="#FFD95A" stroke="#F0AE00" strokeWidth="2" />
      <path d="M32 32l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" fill="#fff" />
    </svg>
  );
}

export function ChecklistIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="10" y="8" width="38" height="48" rx="5" fill="#fff" stroke="#3B6FD8" strokeWidth="3" />
      {[20, 31, 42].map((y) => (
        <g key={y}>
          <path d={`M16 ${y}l3 3 5-6`} fill="none" stroke="#22A35A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M28 ${y}h14`} stroke="#9DB5E8" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      <path d="M44 50l12-24 5 3-12 24-6 2z" fill="#FFB020" stroke="#C47A00" strokeWidth="1.5" />
      <path d="M56 26l2-4 5 3-2 4z" fill="#F06292" />
    </svg>
  );
}

export function BookIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M6 16c9-3 18-2 26 4v34c-8-6-17-7-26-4z" fill="#4F86F7" />
      <path d="M58 16c-9-3-18-2-26 4v34c8-6 17-7 26-4z" fill="#2F64D6" />
      <path d="M10 19c7-2 14-1 20 3v28c-6-4-13-5-20-3zM54 19c-7-2-14-1-20 3v28c6-4 13-5 20-3z" fill="#fff" />
      <path d="M14 27h12M14 33h12M38 27h12M38 33h12" stroke="#B9CCF5" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function PencilIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 44L42 14l8 8-30 30-10 2z" fill="#FFB020" stroke="#C47A00" strokeWidth="2" />
      <path d="M42 14l5-5 8 8-5 5z" fill="#F06292" />
      <path d="M12 44l8 8-10 2z" fill="#4B3A2A" />
    </svg>
  );
}

export function StarIcon({ size = 40, color = "#FFC928" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 5l8.2 17 18.6 2.6-13.5 13 3.3 18.5L32 47.3 15.4 56.1l3.3-18.5-13.5-13L23.8 22z"
        fill={color}
        stroke="#E09B00"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A friendly smiling star used as the cheering mascot.
export function StarMascot({ size = 90 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M50 6l12.6 26.3 28.8 4-21 20.2 5.1 28.6L50 71.5 24.5 85.1l5.1-28.6-21-20.2 28.8-4z"
        fill="#FFD43B"
        stroke="#F0A500"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="41" cy="45" rx="3.6" ry="5" fill="#3B2A1A" />
      <ellipse cx="59" cy="45" rx="3.6" ry="5" fill="#3B2A1A" />
      <circle cx="42.2" cy="43.2" r="1.3" fill="#fff" />
      <circle cx="60.2" cy="43.2" r="1.3" fill="#fff" />
      <ellipse cx="34" cy="55" rx="4.5" ry="3" fill="#FF8FA3" opacity=".7" />
      <ellipse cx="66" cy="55" rx="4.5" ry="3" fill="#FF8FA3" opacity=".7" />
      <path d="M42 56q8 9 16 0" fill="#E2453C" stroke="#3B2A1A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 22q4-6 10-6" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" fill="none" />
    </svg>
  );
}

// Generic cartoon student avatar.
export function KidAvatar({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="#DCEBFF" stroke="#fff" strokeWidth="4" />
      <path d="M14 76c4-14 14-20 26-20s22 6 26 20z" fill="#fff" />
      <path d="M33 56l7 8 7-8" fill="none" stroke="#2F64D6" strokeWidth="3" />
      <path d="M38 60h4l2 12h-8z" fill="#2F64D6" />
      <circle cx="40" cy="38" r="17" fill="#F6C59A" />
      <path d="M22 36c0-14 9-20 18-20 11 0 19 7 18 19-3-6-7-9-11-9-2 3-7 5-12 5-5 0-9 2-13 5z" fill="#3A2A20" />
      <ellipse cx="33.5" cy="40" rx="2.4" ry="3.2" fill="#2A1B12" />
      <ellipse cx="46.5" cy="40" rx="2.4" ry="3.2" fill="#2A1B12" />
      <path d="M34 47q6 6 12 0" fill="none" stroke="#B5442E" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="29" cy="45" rx="3" ry="2" fill="#F59C8C" opacity=".6" />
      <ellipse cx="51" cy="45" rx="3" ry="2" fill="#F59C8C" opacity=".6" />
    </svg>
  );
}

export function BulbIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <g stroke="#FFC928" strokeWidth="3" strokeLinecap="round">
        <path d="M32 2v6M10 12l4 4M54 12l-4 4M4 30h6M54 30h6" />
      </g>
      <path d="M32 12a16 16 0 0 0-9 29v7h18v-7a16 16 0 0 0-9-29z" fill="#FFE066" stroke="#E09B00" strokeWidth="2.5" />
      <rect x="23" y="48" width="18" height="5" rx="2" fill="#7A8CA8" />
      <rect x="25" y="54" width="14" height="5" rx="2" fill="#5B6B85" />
      <ellipse cx="26" cy="24" rx="3" ry="6" fill="#fff" opacity=".6" />
    </svg>
  );
}

export function CalendarIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" fill="#E7EEFF" stroke="#3B6FD8" strokeWidth="2" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="#3B6FD8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ size = 18, color = "#3B6FD8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="#E7EEFF" stroke={color} strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CalendarCheckIcon({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="2" />
      <path d="M8 3v4M16 3v4M8 14l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function UserIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4.5" fill="#3B6FD8" />
      <path d="M3.5 21c1-5 4.5-7.5 8.5-7.5s7.5 2.5 8.5 7.5z" fill="#3B6FD8" />
    </svg>
  );
}

export function CheckBadge({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#22A35A" stroke="#fff" strokeWidth="2" />
      <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chevron({ dir = "right", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={dir === "right" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
