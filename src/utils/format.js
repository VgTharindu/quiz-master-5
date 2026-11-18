export const MONTHS = [
  "ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි",
  "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්",
];

// 5 → "05"
const pad = (n) => String(n).padStart(2, "0");

// e.g. "2026 <month> 15, 4:30 PM" with Sinhala month names and AM/PM labels
export const formatDateTime = (x) => {
  const d = new Date(x),
    h = d.getHours();
  return `${d.getFullYear()} ${MONTHS[d.getMonth()]} ${d.getDate()}, ${h % 12 || 12}:${pad(d.getMinutes())} ${h < 12 ? "පෙ.ව." : "ප.ව."}`;
};

// seconds -> "m:ss"
export const formatMinSec = (s) => {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ":" + pad(s % 60);
};

// seconds -> "h:mm:ss" (hours omitted when zero)
export const formatCountdown = (s) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  return (h ? h + ":" : "") + pad(Math.floor((s % 3600) / 60)) + ":" + pad(s % 60);
};

// seconds -> minutes and seconds with Sinhala unit labels
export const formatDuration = (s) =>
  s < 60 ? Math.round(s) + "තත්" : Math.floor(s / 60) + "මි " + Math.round(s % 60) + "තත්";
