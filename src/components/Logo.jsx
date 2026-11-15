// Each part has a class name so the splash screen can animate it independently.
const FIVE = "M78 52H47l-3 22c7-5 16-6 24-3 12 4 15 16 11 26-5 12-21 15-34 8";

export default function Logo({ size = 56 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="QUIZ MASTER 5 logo"
    >
      {/* pathLength="1" normalises the stroke so the splash can draw it with stroke-dashoffset. */}
      <path
        className="lg-five-out"
        d={FIVE}
        pathLength="1"
        fill="none"
        stroke="#1A4BAE"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="lg-five"
        d={FIVE}
        pathLength="1"
        fill="none"
        stroke="#F7931E"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g className="lg-cap">
        <path d="M36 34v10c0 5 11 9 24 9s24-4 24-9V34z" fill="#123A8C" />
        <path d="M60 10l50 19-50 19-50-19z" fill="#1A4BAE" />
        <path d="M60 29l40 6v22" fill="none" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" />
        <path d="M96 56h8l2 12h-12z" fill="#F7931E" />
      </g>
      <g className="lg-check">
        <circle cx="96" cy="96" r="15" fill="#fff" stroke="#1A4BAE" strokeWidth="4" />
        <path
          d="M89 96l5 5 9-10"
          pathLength="1"
          fill="none"
          stroke="#F7931E"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
