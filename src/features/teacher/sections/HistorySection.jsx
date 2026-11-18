import MonthTestList from "./MonthTestList";

export default function HistorySection({ onOpen }) {
  return (
    <>
      <h1 className="t-section-title">සියලු පරීක්ෂණ</h1>
      <p className="t-hint">
        පරීක්ෂණයක් ඔබලා ළමුන්ගේ ප්‍රතිඵල ලැයිස්තුව බලන්න, PDF ලෙස ගන්න, නැත්නම් නැවත publish කරන්න.
      </p>
      <MonthTestList tab={1} onOpen={onOpen} />
    </>
  );
}
