import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const csvPath = resolve(
  process.env.HOME ?? "",
  "Downloads/Current_Employee_Names,_Salaries,_and_Position_Titles_20260701.csv"
);
const outPath = resolve(__dirname, "../data/employees.jsonl");

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function parseMoney(value) {
  if (!value) return undefined;
  const cleaned = value.replace(/[$,]/g, "").trim();
  if (!cleaned) return undefined;
  const num = Number(cleaned);
  return Number.isNaN(num) ? undefined : num;
}

const raw = readFileSync(csvPath, "utf8").trim();
const lines = raw.split(/\r?\n/);
const headers = parseCsvLine(lines[0]);

const rows = lines.slice(1).map((line, index) => {
  const cols = parseCsvLine(line);
  const row = Object.fromEntries(headers.map((header, i) => [header, cols[i] ?? ""]));

  return {
    rowIndex: index,
    NAME: row.Name ?? "",
    JOB_TITLES: row["Job Titles"] || undefined,
    DEPARTMENT: row.Department || undefined,
    FULL_OR_PART_TIME: row["Full or Part-Time"] || undefined,
    SALARY_OR_HOURLY: row["Salary or Hourly"] || undefined,
    TYPICAL_HOURS: row["Typical Hours"] ? Number(row["Typical Hours"]) || undefined : undefined,
    ANNUAL_SALARY: parseMoney(row["Annual Salary"]),
    HOURLY_RATE: parseMoney(row["Hourly Rate"]),
  };
});

writeFileSync(outPath, rows.map((row) => JSON.stringify(row)).join("\n"));
console.log(`Wrote ${rows.length} rows to ${outPath}`);
