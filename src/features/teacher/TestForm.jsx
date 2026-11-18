import { useState } from "react";
import GradeSelect from "@/components/GradeSelect";

// <input type="datetime-local"> needs local time without a timezone: "2026-11-20T08:30".
export const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

// Shared by "new test", "edit test" and "publish again".
// lock: { grade, start } disables fields that must not change (e.g. once a test is live).
export default function TestForm({ initial, lock = {}, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    grade: initial?.grade || 5,
    start: toLocalInput(initial?.start_at),
    end: toLocalInput(initial?.end_at),
  });
  const [busy, setBusy] = useState(false);
  const set = (field) => (value) => setForm({ ...form, [field]: value });

  async function submit() {
    if (!form.name.trim() || !form.start || !form.end) return alert("සියල්ල පුරවන්න");
    const start = new Date(form.start),
      end = new Date(form.end);
    if (end <= start) return alert("අවසන් වෙලාව ආරම්භයට පසුව විය යුතුයි");
    setBusy(true);
    const error = await onSubmit({
      name: form.name.trim(),
      grade: form.grade,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
    });
    setBusy(false);
    if (error) alert(error);
  }

  return (
    <div className="card t-form">
      <label>
        පරීක්ෂණයේ නම
        <input
          placeholder="උදා: morning test 01"
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
        />
      </label>
      <label>
        පන්තිය
        {lock.grade ? (
          <input value={form.grade + " වසර"} disabled />
        ) : (
          <GradeSelect value={form.grade} onChange={set("grade")} />
        )}
      </label>
      <label>
        ආරම්භය
        <input
          type="datetime-local"
          value={form.start}
          disabled={lock.start}
          onChange={(e) => set("start")(e.target.value)}
        />
      </label>
      <label>
        අවසානය
        <input type="datetime-local" value={form.end} onChange={(e) => set("end")(e.target.value)} />
      </label>
      <div className="row">
        {onCancel && (
          <button className="w" onClick={onCancel}>
            අවලංගු
          </button>
        )}
        <button disabled={busy} onClick={submit}>
          {busy ? "රැඳී සිටින්න…" : submitLabel}
        </button>
      </div>
    </div>
  );
}
