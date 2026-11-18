import { useId } from "react";

export default function CoinIcon({ size = 24 }) {
  // useId output contains ":" which is not safe inside url(#...).
  const id = "coin" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FFF6C2" />
          <stop offset="0.45" stopColor="#FFD43B" />
          <stop offset="1" stopColor="#E09B00" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill={`url(#${id})`} stroke="#B87800" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#C98A00" strokeWidth="1.2" opacity="0.7" />
      <path
        d="M16.0 9.2L17.7 13.7L22.5 13.9L18.8 16.9L20.0 21.5L16.0 18.9L12.0 21.5L13.2 16.9L9.5 13.9L14.3 13.7Z"
        fill="#F0AE00"
        stroke="#B87800"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <ellipse cx="10.5" cy="9" rx="4" ry="1.8" fill="#fff" opacity="0.5" transform="rotate(-35 10.5 9)" />
    </svg>
  );
}
