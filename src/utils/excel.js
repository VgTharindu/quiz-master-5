import * as XLSX from "xlsx";

// objects array එකක් Excel file එකක් ලෙස download කරනවා. object keys තමයි column නම්
export function exportExcel(rows, fileName) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Sheet1");
  XLSX.writeFile(wb, fileName + ".xlsx");
}
