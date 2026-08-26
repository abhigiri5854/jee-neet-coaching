import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const papers = [
  ["jee-main-full-length-01", "JEE Main Full Length Test 01", "Physics / Chemistry / Mathematics"],
  ["jee-main-full-length-02", "JEE Main Full Length Test 02", "Physics / Chemistry / Mathematics"],
  ["neet-full-length-01", "NEET Full Length Test 01", "Biology / Chemistry / Physics"],
  ["neet-full-length-02", "NEET Full Length Test 02", "Biology / Chemistry / Physics"],
  ["jee-advanced-physics-chapter", "JEE Advanced Physics Chapter Test", "Mechanics & Electrodynamics"],
  ["neet-biology-pyq-mix", "NEET Biology Previous Year Mix", "Class 11 NCERT Biology"],
  ["jee-main-chemistry-part", "JEE Main Chemistry Part Test", "Physical & Inorganic"],
  ["jee-advanced-maths-full", "JEE Advanced Mathematics Full Length", "Algebra, Calculus, Coordinate"],
];

async function makePdf(slug, title, subject) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const body = await doc.embedFont(StandardFonts.Helvetica);
  const page = doc.addPage([595, 842]);
  page.drawRectangle({ x: 0, y: 760, width: 595, height: 82, color: rgb(0.04, 0.11, 0.23) });
  page.drawText("PrepXpert Sample Paper", { x: 48, y: 800, size: 12, font: body, color: rgb(0.78, 0.82, 0.95) });
  page.drawText(title, { x: 48, y: 772, size: 18, font, color: rgb(1, 1, 1) });
  page.drawText(subject, { x: 48, y: 720, size: 12, font: body, color: rgb(0.2, 0.2, 0.3) });
  page.drawText("This is an official PrepXpert practice PDF.", { x: 48, y: 690, size: 11, font: body, color: rgb(0.25, 0.25, 0.35) });
  for (let i = 1; i <= 12; i += 1) {
    page.drawText(`${i}. Practice question for ${title}. Choose the correct option.`, {
      x: 48,
      y: 650 - i * 28,
      size: 11,
      font: body,
      color: rgb(0.15, 0.15, 0.22),
    });
  }
  page.drawText("View Online and Download both serve this file.", { x: 48, y: 80, size: 10, font: body, color: rgb(0.4, 0.4, 0.5) });
  return doc.save();
}

const outDir = path.join(process.cwd(), "public", "sample-papers");
await mkdir(outDir, { recursive: true });
for (const [slug, title, subject] of papers) {
  const bytes = await makePdf(slug, title, subject);
  await writeFile(path.join(outDir, `${slug}.pdf`), bytes);
  console.log("wrote", slug);
}
