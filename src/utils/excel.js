// xlsx is large (~400 KB), so it is only downloaded when an export is requested.
export async function exportExcel(rows, fileName) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Sheet1");
  XLSX.writeFile(wb, fileName + ".xlsx");
}
