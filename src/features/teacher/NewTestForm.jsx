import { useState } from "react";
import { sb } from "@/lib/supabase";
import GradeSelect from "@/components/GradeSelect";

// නව පරීක්ෂණයක් schedule කරන form එක
export default function NewTestForm({ done }) {
  const [form, setForm] = useState({ grade: 5, name: "", start: "", end: "" });
  const set = (field) => (value) => setForm({ ...form, [field]: value });

  async function create() {
    if (!form.name || !form.start || !form.end) return alert("සියල්ල පුරවන්න");
    if (new Date(form.end) <= new Date(form.start))
      return alert("අවසන් වෙලාව ආරම්භයට පසුව විය යුතුයි");
    const { error } = await sb.from("tests").insert({
      grade: form.grade,
      name: form.name,
      start_at: new Date(form.start).toISOString(),
      end_at: new Date(form.end).toISOString(),
    });
    error ? alert(error.message) : done();
  }

  return (
    <div className="card">
      <GradeSelect value={form.grade} onChange={set("grade")} />
      <input
        placeholder="නම (උදා: morning test 01)"
        value={form.name}
        onChange={(e) => set("name")(e.target.value)}
      />
      ආරම්භය
      <input
        type="datetime-local"
        value={form.start}
        onChange={(e) => set("start")(e.target.value)}
      />
      අවසානය
      <input
        type="datetime-local"
        value={form.end}
        onChange={(e) => set("end")(e.target.value)}
      />
      <button style={{ width: "100%" }} onClick={create}>
        සාදන්න (ඊළඟට ප්‍රශ්න එකතු කරන්න)
      </button>
    </div>
  );
}
