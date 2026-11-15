export default function RetryMessage({ onRetry, children }) {
  return (
    <div className="wrap" style={{ textAlign: "center", paddingTop: 40 }}>
      <p>{children || "සම්බන්ධතාවය දුර්වලයි. දත්ත ලබාගත නොහැකි විය."}</p>
      <button onClick={onRetry}>නැවත උත්සාහ කරන්න</button>
    </div>
  );
}
