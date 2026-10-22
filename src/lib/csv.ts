type Cell = string | number | boolean | null | undefined;

// Spreadsheet apps run a cell that starts with one of these as a formula, so text typed by visitors is defused with an apostrophe
const FORMULA = /^[=+\-@\t\r]/;

function cell(value: Cell) {
  let s = value == null ? "" : String(value);
  if (FORMULA.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Saves rows as a CSV file that Excel, Numbers and Google Sheets open directly (UTF-8 with a byte-order mark, so accents survive). */
export function downloadCsv(filename: string, header: string[], rows: Cell[][]) {
  const text = [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿", text], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.append(link);
  link.click();
  link.remove();
  // Released once the browser has started the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
