import { GRADES } from "@/constants/grades";

export default function GradeSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(+e.target.value)}>
      {GRADES.map((g) => (
        <option key={g} value={g}>
          {g} වසර
        </option>
      ))}
    </select>
  );
}
