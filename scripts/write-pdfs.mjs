import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const papers = [
  "jee-main-full-length-01",
  "jee-main-full-length-02",
  "neet-full-length-01",
  "neet-full-length-02",
  "jee-advanced-physics-chapter",
  "neet-biology-pyq-mix",
  "jee-main-chemistry-part",
  "jee-advanced-maths-full",
];

function pdfFor(title) {
  const text = `PrepXpert - ${title}`;
  const stream = `BT /F1 16 Tf 50 780 Td (${text.replace(/[()\\]/g, "")}) Tj T* /F1 12 Tf (Official sample paper PDF for viewing and download.) Tj ET`;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];
  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];
  let cursor = header.length;
  for (const obj of objects) {
    offsets.push(cursor);
    body += obj + "\n";
    cursor += obj.length + 1;
  }
  const xrefPos = header.length + body.length;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return header + body + xref + trailer;
}

const dir = path.join(process.cwd(), "public", "sample-papers");
mkdirSync(dir, { recursive: true });
for (const slug of papers) {
  writeFileSync(path.join(dir, `${slug}.pdf`), pdfFor(slug));
  console.log("wrote", slug);
}
