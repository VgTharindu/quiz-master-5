import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";

const A4_W = 210; // mm
const A4_H = 297;
const MARGIN_Y = 10;
const SHEET_PX = 794; // A4 width at 96 dpi

// Renders a React element off-screen at A4 width and saves it as a PDF.
// jsPDF cannot shape Sinhala text, so the sheet is rasterised by the browser
// (which renders Sinhala correctly) and placed into the PDF as images.
// Elements marked with data-pdf-block are never split across pages.
export async function exportPdf(element, fileName) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-${SHEET_PX * 2}px;top:0;width:${SHEET_PX}px;background:#fff;`;
  document.body.appendChild(host);
  const root = createRoot(host);
  flushSync(() => root.render(element));

  try {
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const sheet = host.firstElementChild;
    const scale = 2;
    const canvas = await html2canvas(sheet, { scale, backgroundColor: "#ffffff", useCORS: true, logging: false });

    const pxPerMm = canvas.width / A4_W;
    const pagePx = Math.floor((A4_H - 2 * MARGIN_Y) * pxPerMm);
    const top = sheet.getBoundingClientRect().top;
    const breaks = [...sheet.querySelectorAll("[data-pdf-block]")]
      .map((el) => Math.round((el.getBoundingClientRect().bottom - top) * scale))
      .sort((a, b) => a - b);

    const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
    for (let y = 0, page = 0; y < canvas.height - 1; page++) {
      let end = Math.min(y + pagePx, canvas.height);
      if (end < canvas.height) {
        const fit = breaks.filter((b) => b > y + pagePx * 0.3 && b <= end);
        if (fit.length) end = fit[fit.length - 1];
      }
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = end - y;
      slice.getContext("2d").drawImage(canvas, 0, y, canvas.width, end - y, 0, 0, canvas.width, end - y);
      if (page) pdf.addPage();
      pdf.addImage(slice.toDataURL("image/jpeg", 0.9), "JPEG", 0, MARGIN_Y, A4_W, (end - y) / pxPerMm);
      pdf.setFontSize(8);
      pdf.setTextColor(140);
      pdf.text(`${page + 1}`, A4_W / 2, A4_H - 4, { align: "center" });
      y = end;
    }
    // Zero-width joiners (used in Sinhala conjuncts) become "_" in downloaded file names.
    pdf.save(fileName.replace(/[\u200c\u200d]/g, "").replace(/[\\/:*?"<>|]+/g, "_") + ".pdf");
  } finally {
    root.unmount();
    host.remove();
  }
}
