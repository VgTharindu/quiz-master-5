export const UPCOMING = 0;
export const LIVE = 1;
export const ENDED = 2;

export const STATUS_LABELS = ["ඉදිරියට", "දැන් පවතී", "අවසන්"];
export const STATUS_COLORS = ["#ca8a04", "#16a34a", "#64748b"];

export const getTestStatus = (test, now = Date.now()) =>
  now < new Date(test.start_at) ? UPCOMING : now < new Date(test.end_at) ? LIVE : ENDED;
