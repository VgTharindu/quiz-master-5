import { MONTHS } from "@/utils/format";

export default function MonthPicker({ year, month, onChange }) {
  const thisYear = new Date().getFullYear();
  const years = [thisYear - 2, thisYear - 1, thisYear, thisYear + 1];
  return (
    <div className="month-picker">
      <select value={year} onChange={(e) => onChange({ year: +e.target.value, month })}>
        {years.map((y) => (
          <option key={y}>{y}</option>
        ))}
      </select>
      <select value={month} onChange={(e) => onChange({ year, month: +e.target.value })}>
        {MONTHS.map((m, i) => (
          <option key={i} value={i}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

export const currentMonth = () => {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() };
};
