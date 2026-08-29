"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, requireAdmin } from "@/lib/supabase/server";

const BUCKET = "sample-papers";
const paperSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(180),
  exam: z.string().trim().min(2, "Exam is required.").max(80),
  subject: z.string().trim().min(2, "Subject is required.").max(80),
  class_level: z.string().trim().min(1, "Class level is required.").max(80),
  year: z.coerce.number().int().min(2000).max(2100),
  difficulty: z.string().trim().min(1, "Difficulty is required.").max(50),
  paper_type: z.string().trim().min(1, "Paper type is required.").max(80),
  question_count: z.coerce.number().int().min(1, "Question count must be at least 1.").max(10000),
  duration_minutes: z.coerce.number().int().min(1, "Duration must be at least 1 minute.").max(10000),
  description: z.string().trim().max(4000).nullable(),
  is_published: z.boolean(),
});

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function file(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function safeSegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "paper";
}

function validatePdf(upload: File | null, label: string, required: boolean) {
  if (!upload) {
    if (required) throw new Error(`${label} is required.`);
    return;
  }
  const isPdf = upload.type === "application/pdf" || upload.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) throw new Error(`${label} must be a PDF file.`);
}

function storagePath(exam: string, year: number, upload: File, suffix = "") {
  const filename = safeSegment(upload.name.replace(/\.pdf$/i, ""));
  return `sample-papers/${safeSegment(exam)}/${year}/${randomUUID()}${suffix}-${filename}.pdf`;
}

function invalidatePaperPages() {
  revalidatePath("/admin/sample-papers");
  revalidatePath("/sample-papers");
  revalidatePath("/", "layout");
}

export async function saveSamplePaper(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("You are not authorized to manage sample papers.");

  const parsed = paperSchema.safeParse({
    id: text(formData, "id") || undefined,
    title: text(formData, "title"),
    exam: text(formData, "exam"),
    subject: text(formData, "subject"),
    class_level: text(formData, "class_level"),
    year: text(formData, "year"),
    difficulty: text(formData, "difficulty"),
    paper_type: text(formData, "paper_type"),
    question_count: text(formData, "question_count"),
    duration_minutes: text(formData, "duration_minutes"),
    description: text(formData, "description") || null,
    is_published: formData.get("is_published") === "true",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Please check the form fields.");

  const mainFile = file(formData, "file");
  const solutionFile = file(formData, "solution_file");
  validatePdf(mainFile, "Main paper PDF", !parsed.data.id);
  validatePdf(solutionFile, "Solution PDF", false);

  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  let existing: { file_path: string; solution_file_path: string | null; slug: string } | null = null;
  if (parsed.data.id) {
    const { data, error } = await supabase
      .from("sample_papers")
      .select("file_path, solution_file_path, slug")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (error || !data) throw new Error("The paper no longer exists or could not be loaded.");
    existing = data;
  }

  const uploadedPaths: string[] = [];
  const mainPath = mainFile ? storagePath(parsed.data.exam, parsed.data.year, mainFile) : existing?.file_path;
  const solutionPath = solutionFile
    ? storagePath(parsed.data.exam, parsed.data.year, solutionFile, "-solutions")
    : existing?.solution_file_path ?? null;

  try {
    if (mainFile && mainPath) {
      const { error } = await supabase.storage.from(BUCKET).upload(mainPath, mainFile, {
        contentType: "application/pdf",
        upsert: false,
      });
      if (error) throw new Error("The main PDF could not be uploaded. Please try again.");
      uploadedPaths.push(mainPath);
    }
    if (solutionFile && solutionPath) {
      const { error } = await supabase.storage.from(BUCKET).upload(solutionPath, solutionFile, {
        contentType: "application/pdf",
        upsert: false,
      });
      if (error) throw new Error("The solution PDF could not be uploaded. Please try again.");
      uploadedPaths.push(solutionPath);
    }

    const values = {
      title: parsed.data.title,
      exam: parsed.data.exam,
      subject: parsed.data.subject,
      class_level: parsed.data.class_level,
      year: parsed.data.year,
      difficulty: parsed.data.difficulty,
      paper_type: parsed.data.paper_type,
      question_count: parsed.data.question_count,
      duration_minutes: parsed.data.duration_minutes,
      description: parsed.data.description,
      is_published: parsed.data.is_published,
      file_path: mainPath,
      solution_file_path: solutionPath,
      ...(mainFile ? { file_size: mainFile.size } : {}),
    };
    const result = parsed.data.id
      ? await supabase.from("sample_papers").update(values).eq("id", parsed.data.id)
      : await supabase.from("sample_papers").insert({ ...values, slug: `${safeSegment(parsed.data.title)}-${randomUUID().slice(0, 8)}` });
    if (result.error) throw new Error("The paper record could not be saved. Uploaded files have been removed.");

    const replacedPaths = [
      mainFile && existing?.file_path,
      solutionFile && existing?.solution_file_path,
    ].filter((path): path is string => Boolean(path));
    if (replacedPaths.length) await supabase.storage.from(BUCKET).remove(replacedPaths);
    invalidatePaperPages();
    return { message: parsed.data.id ? "Sample paper updated." : "Sample paper uploaded successfully." };
  } catch (error) {
    if (uploadedPaths.length) await supabase.storage.from(BUCKET).remove(uploadedPaths);
    throw error;
  }
}

export async function setSamplePaperPublished(id: string, isPublished: boolean) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("You are not authorized to manage sample papers.");
  if (!z.string().uuid().safeParse(id).success) throw new Error("Invalid paper.");
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("sample_papers").update({ is_published: isPublished }).eq("id", id);
  if (error) throw new Error("The publication status could not be changed.");
  invalidatePaperPages();
}

export async function deleteSamplePaper(id: string) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("You are not authorized to manage sample papers.");
  if (!z.string().uuid().safeParse(id).success) throw new Error("Invalid paper.");
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data: paper, error: fetchError } = await supabase
    .from("sample_papers")
    .select("file_path, solution_file_path")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !paper) throw new Error("The paper could not be found.");
  const paths = [paper.file_path, paper.solution_file_path].filter((path): path is string => Boolean(path));
  if (paths.length) {
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) throw new Error("The PDF files could not be deleted, so the paper was left unchanged.");
  }
  const { error } = await supabase.from("sample_papers").delete().eq("id", id);
  if (error) throw new Error("The paper record could not be deleted.");
  invalidatePaperPages();
}
