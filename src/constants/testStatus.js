// පරීක්ෂණයක තත්ත්වය: 0 = ඉදිරියට, 1 = දැන් පවතී, 2 = අවසන්
export const UPCOMING = 0;
export const LIVE = 1;
export const ENDED = 2;

export const STATUS_LABELS = ["ඉදිරියට", "දැන් පවතී", "අවසන්"];
export const STATUS_COLORS = ["#ca8a04", "#16a34a", "#64748b"];

// now (ms) දී test එකේ තත්ත්වය. now දෙන්නේ නැත්නම් මේ මොහොතේ වෙලාව ගන්නවා
export const getTestStatus = (test, now = Date.now()) =>
  now < new Date(test.start_at) ? UPCOMING : now < new Date(test.end_at) ? LIVE : ENDED;
