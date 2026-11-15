// objects array එකක් Excel file එකක් ලෙස download කරනවා. object keys තමයි column නම්.
// xlsx library එක ගොඩක් ලොකුයි (~400 KB), ඒ නිසා ඒක load කරන්නේ සර් Excel බොත්තම ඔබපුවාම විතරයි
export async function exportExcel(rows, fileName) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Sheet1");
  XLSX.writeFile(wb, fileName + ".xlsx");
}
