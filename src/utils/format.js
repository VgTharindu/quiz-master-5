// දිනය සහ කාලය පෙන්වන ආකාර
export const MONTHS = [
  "ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි",
  "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්",
];

// 5 → "05"
const pad = (n) => String(n).padStart(2, "0");

// "2026 නොවැම්බර් 15, 4:30 ප.ව."
export const formatDateTime = (x) => {
  const d = new Date(x),
    h = d.getHours();
  return `${d.getFullYear()} ${MONTHS[d.getMonth()]} ${d.getDate()}, ${h % 12 || 12}:${pad(d.getMinutes())} ${h < 12 ? "පෙ.ව." : "ප.ව."}`;
};

// තත්පර → "4:05" (මිනිත්තු:තත්පර)
export const formatMinSec = (s) => {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ":" + pad(s % 60);
};

// තත්පර → "1:04:05" (පැය තියෙනවා නම් විතරක් පැය පෙන්වනවා)
export const formatCountdown = (s) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  return (h ? h + ":" : "") + pad(Math.floor((s % 3600) / 60)) + ":" + pad(s % 60);
};

// තත්පර → "4මි 5තත්"
export const formatDuration = (s) =>
  Math.floor(s / 60) + "මි " + Math.round(s % 60) + "තත්";
