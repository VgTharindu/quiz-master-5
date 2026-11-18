import { useState } from "react";
import { exportPdf } from "@/lib/pdf";

// `render` returns the sheet element; it is only built when the button is pressed.
export default function PdfButton({ render, fileName, label = "📄 PDF", className = "y" }) {
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    try {
      await exportPdf(render(), fileName);
    } catch (e) {
      alert("PDF එක සෑදීමට නොහැකි විය. නැවත උත්සාහ කරන්න.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <button className={className} disabled={busy} onClick={run}>
      {busy ? "PDF සාදමින්…" : label}
    </button>
  );
}
