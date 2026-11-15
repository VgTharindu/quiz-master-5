const TEXT = {
  saved: "✓ පිළිතුරු සුරැකිණි",
  saving: "පිළිතුරු සුරැකෙමින්…",
  error: "⚠ සම්බන්ධතාවය දුර්වලයි. ඔබේ පිළිතුරු phone එකේ සුරැකී ඇත, නැවත උත්සාහ කරමින්…",
};

export default function SaveStatus({ status }) {
  return (
    <div className={"save-status " + (status === "saved" ? "" : status === "saving" ? "pending" : "error")} aria-live="polite">
      {TEXT[status]}
    </div>
  );
}
