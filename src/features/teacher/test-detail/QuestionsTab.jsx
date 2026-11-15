import { useState } from "react";
import { sb } from "@/lib/supabase";
import { UPCOMING } from "@/constants/testStatus";
import QuestionEditor from "./QuestionEditor";

export default function QuestionsTab({ test, status, questions, totalMarks, reload, onTestDeleted }) {
  const [editing, setEditing] = useState(null); // null = "new question" mode
  const canEdit = status === UPCOMING;

  async function removeQuestion(q) {
    if (confirm("මකන්නද?")) {
      await sb.from("questions").delete().eq("id", q.id);
      reload();
    }
  }
  async function removeTest() {
    if (confirm("මුළු පරීක්ෂණයම (ප්‍රශ්න සහ ප්‍රතිඵල සමඟ) මකන්නද?")) {
      await sb.from("tests").delete().eq("id", test.id);
      onTestDeleted();
    }
  }

  return (
    <>
      {canEdit ? (
        // Changing the key remounts the editor so its form re-initialises from the selected question.
        <QuestionEditor
          key={editing?.id ?? "new"}
          test={test}
          question={editing}
          questions={questions}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <p>
          <small>ආරම්භ වූ පසු ප්‍රශ්න වෙනස් කළ නොහැක.</small>
        </p>
      )}
      <h2>
        ප්‍රශ්න {questions.length} · මුළු ලකුණු {totalMarks}
      </h2>
      {questions.map((q, k) => (
        <div className="card" key={q.id}>
          <b>
            {k + 1}. {q.body}
          </b>{" "}
          {q.image_url && (
            <img className="q" src={q.image_url} alt="" loading="lazy" />
          )}
          {q.options.map((o, j) => (
            <div
              key={j}
              className={j === q.correct ? "ok" : ""}
              style={{ padding: "2px 8px", borderRadius: 8 }}
            >
              {j + 1}. {o}
            </div>
          ))}
          <small>
            ලකුණු {q.marks} ·{" "}
            {q.seconds ? q.seconds + " තත්පර" : "කාල සීමාවක් නැත"}
          </small>
          {canEdit && (
            <div className="row" style={{ marginTop: 8 }}>
              <button
                className="w sm"
                onClick={() => {
                  setEditing(q);
                  window.scrollTo(0, 0); // the editor is at the top of the page
                }}
              >
                ✏ වෙනස් කරන්න
              </button>
              <button className="r sm" onClick={() => removeQuestion(q)}>
                මකන්න
              </button>
            </div>
          )}
        </div>
      ))}
      <button className="r sm" onClick={removeTest}>
        🗑 පරීක්ෂණය මකන්න
      </button>
    </>
  );
}
