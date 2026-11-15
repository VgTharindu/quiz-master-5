import { useState } from "react";
import { sb } from "@/lib/supabase";
import { compressImage } from "@/utils/image";

// හිස් form එක. o = පිළිතුරු 4, c = නිවැරදි පිළිතුරේ index එක, img = අලුත් file එක, url = දැනට තියෙන පින්තූරය
const BLANK = { body: "", o: ["", "", "", ""], c: 0, marks: 1, sec: "", img: null, url: null };

// database row එකක් form state එකට හරවනවා
const fromQuestion = (q) => ({
  id: q.id,
  body: q.body,
  o: q.options,
  c: q.correct,
  marks: q.marks,
  sec: q.seconds || "",
  img: null,
  url: q.image_url,
});

// නව ප්‍රශ්නයක් එකතු කරන හෝ (question දුන්නොත්) තියෙන ප්‍රශ්නයක් වෙනස් කරන form එක
export default function QuestionEditor({ test, question, questions, onSaved, onCancel }) {
  const [n, setN] = useState(question ? fromQuestion(question) : BLANK);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!n.body || n.o.some((x) => !x))
      return alert("ප්‍රශ්නය සහ පිළිතුරු 4 ම ඕන");
    setBusy(true);
    let url = n.url;
    if (n.img) {
      // අලුත් පින්තූරයක් තෝරලා නම් කුඩා කරලා storage එකට upload කරනවා
      const blob = await compressImage(n.img),
        fileName = Date.now() + ".jpg";
      const r = await sb.storage
        .from("qimg")
        .upload(fileName, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (r.error) {
        setBusy(false);
        return alert(r.error.message);
      }
      url = sb.storage.from("qimg").getPublicUrl(fileName).data.publicUrl;
    }
    const row = {
      body: n.body,
      image_url: url,
      options: n.o,
      correct: n.c,
      marks: +n.marks || 1,
      seconds: n.sec ? +n.sec : null,
    };
    const { error } = n.id
      ? await sb.from("questions").update(row).eq("id", n.id)
      : await sb.from("questions").insert({
          ...row,
          test_id: test.id,
          pos: Math.max(0, ...questions.map((q) => q.pos)) + 1, // ලැයිස්තුවේ අන්තිමට
        });
    setBusy(false);
    if (error) return alert(error.message);
    setN(BLANK);
    onSaved();
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>
        {n.id ? "✏ ප්‍රශ්නය වෙනස් කරන්න" : "➕ නව ප්‍රශ්නයක්"}
      </h2>
      <input
        placeholder="ප්‍රශ්නය"
        value={n.body}
        onChange={(e) => setN({ ...n, body: e.target.value })}
      />
      {n.url && (
        <div>
          <img className="q" src={n.url} alt="" style={{ maxHeight: 140 }} />
          <button className="r sm" onClick={() => setN({ ...n, url: null })}>
            පින්තූරය ඉවත් කරන්න
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setN({ ...n, img: e.target.files[0] })}
      />
      {n.o.map((o, j) => (
        <div className="row" key={j}>
          <input
            placeholder={"පිළිතුර " + (j + 1)}
            value={o}
            onChange={(e) => {
              const x = [...n.o];
              x[j] = e.target.value;
              setN({ ...n, o: x });
            }}
          />
          <button
            className={n.c === j ? "g" : "w"}
            style={{ flex: "0 0 110px" }}
            onClick={() => setN({ ...n, c: j })}
          >
            {n.c === j ? "නිවැරදි ✔" : "නිවැරදිද?"}
          </button>
        </div>
      ))}
      <div className="row">
        <input
          type="number"
          placeholder="ලකුණු"
          value={n.marks}
          onChange={(e) => setN({ ...n, marks: e.target.value })}
        />
        <input
          type="number"
          placeholder="තත්පර (හිස් නම් කාල සීමාවක් නැත)"
          value={n.sec}
          onChange={(e) => setN({ ...n, sec: e.target.value })}
        />
      </div>
      <div className="row">
        <button disabled={busy} onClick={save}>
          {busy ? "රැඳී සිටින්න…" : n.id ? "වෙනස්කම් සුරකින්න" : "ප්‍රශ්නය එකතු කරන්න"}
        </button>
        {n.id && (
          <button className="w" onClick={onCancel}>
            අවලංගු
          </button>
        )}
      </div>
    </div>
  );
}
