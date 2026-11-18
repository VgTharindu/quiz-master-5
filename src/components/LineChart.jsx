// Lightweight SVG line chart for percentages (0-100). Plain SVG so it also
// renders inside PDF exports. series: [{ name, color, dashed, values: (number|null)[] }]
export default function LineChart({ labels, series, height = 240 }) {
  const W = 640,
    H = height,
    padL = 40,
    padR = 16,
    padT = 18,
    padB = 46;
  const n = labels.length;
  const x = (i) => (n === 1 ? (padL + W - padR) / 2 : padL + (i * (W - padL - padR)) / (n - 1));
  const y = (v) => padT + ((100 - v) * (H - padT - padB)) / 100;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="ලකුණු වර්ධනය" style={{ display: "block" }}>
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="#e2e8f0" />
          <text x={padL - 6} y={y(v) + 4} fontSize="11" textAnchor="end" fill="#64748b">
            {v}%
          </text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={H - padB + 18} fontSize="11" textAnchor="middle" fill="#475569">
          {l}
        </text>
      ))}
      {series.map((s) => {
        // A missed test leaves a gap in the line instead of dropping to zero.
        const segments = [];
        let cur = [];
        s.values.forEach((v, i) => {
          if (v === null || v === undefined) {
            if (cur.length) segments.push(cur);
            cur = [];
          } else cur.push([x(i), y(v), v]);
        });
        if (cur.length) segments.push(cur);
        return (
          <g key={s.name}>
            {segments.map((seg, k) => (
              <polyline
                key={k}
                points={seg.map(([px, py]) => `${px},${py}`).join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth={s.dashed ? 2 : 3}
                strokeDasharray={s.dashed ? "6 5" : undefined}
                strokeLinejoin="round"
              />
            ))}
            {!s.dashed &&
              segments.flat().map(([px, py, v], k) => (
                <g key={k}>
                  <circle cx={px} cy={py} r="5" fill="#fff" stroke={s.color} strokeWidth="3" />
                  <text x={px} y={py - 10} fontSize="11" fontWeight="700" textAnchor="middle" fill={s.color}>
                    {v}%
                  </text>
                </g>
              ))}
          </g>
        );
      })}
      {series.map((s, i) => (
        <g key={"l" + s.name} transform={`translate(${padL + i * 170}, ${H - 12})`}>
          <line x1="0" x2="22" y1="-4" y2="-4" stroke={s.color} strokeWidth="3" strokeDasharray={s.dashed ? "6 5" : undefined} />
          <text x="28" y="0" fontSize="12" fill="#334155">
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
