"use client";

import { useRef, useState, useTransition } from "react";
import { format } from "date-fns";
import { FileTextIcon, LoaderCircleIcon, PencilIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteSamplePaper, saveSamplePaper, setSamplePaperPublished } from "@/lib/actions/admin-sample-papers";
import type { SamplePaper } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const DIFFICULTIES = ["Easy", "Moderate", "Hard"];
const PAPER_TYPES = ["Sample Paper", "Mock Test", "Previous Year", "Practice Set"];
const emptyForm = {
  title: "", exam: "JEE Main", subject: "Physics", class_level: "Class 12", year: String(new Date().getFullYear()),
  difficulty: "Moderate", paper_type: "Sample Paper", question_count: "", duration_minutes: "", description: "", is_published: true,
};

type FormValues = typeof emptyForm;

function valuesFromPaper(paper: SamplePaper): FormValues {
  return {
    title: paper.title, exam: paper.exam, subject: paper.subject, class_level: paper.class_level, year: String(paper.year),
    difficulty: paper.difficulty, paper_type: paper.paper_type, question_count: String(paper.question_count),
    duration_minutes: String(paper.duration_minutes), description: paper.description ?? "", is_published: paper.is_published,
  };
}

export function SamplePaperManager({ papers }: { papers: SamplePaper[] }) {
  const [editing, setEditing] = useState<SamplePaper | null>(null);
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const solutionFileRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function clearForm() {
    setEditing(null);
    setValues(emptyForm);
    if (formRef.current) formRef.current.reset();
  }

  function editPaper(paper: SamplePaper) {
    setEditing(paper);
    setValues(valuesFromPaper(paper));
    mainFileRef.current && (mainFileRef.current.value = "");
    solutionFileRef.current && (solutionFileRef.current.value = "");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("is_published", String(values.is_published));
    if (editing) formData.set("id", editing.id);
    startTransition(async () => {
      try {
        const result = await saveSamplePaper(formData);
        toast.success(result.message);
        clearForm();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save the sample paper.");
      }
    });
  }

  function changePublication(paper: SamplePaper) {
    startTransition(async () => {
      try {
        await setSamplePaperPublished(paper.id, !paper.is_published);
        toast.success(paper.is_published ? "Paper unpublished." : "Paper published.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to change publication status.");
      }
    });
  }

  function removePaper(paper: SamplePaper) {
    if (!window.confirm(`Delete “${paper.title}”? Its PDF file${paper.solution_file_path ? "s" : ""} will also be permanently deleted.`)) return;
    startTransition(async () => {
      try {
        await deleteSamplePaper(paper.id);
        if (editing?.id === paper.id) clearForm();
        toast.success("Sample paper deleted.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to delete the sample paper.");
      }
    });
  }

  return (
    <div className="space-y-10">
      <form ref={formRef} onSubmit={submit} className="rounded-2xl bg-white p-5 ring-1 ring-border sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-navy">{editing ? "Edit sample paper" : "Upload a sample paper"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">PDFs are stored securely and appear publicly only when published.</p>
          </div>
          {editing ? <Button type="button" variant="outline" onClick={clearForm}>Cancel edit</Button> : null}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Title" required><Input name="title" value={values.title} onChange={(e) => update("title", e.target.value)} required maxLength={180} placeholder="JEE Main Physics Mock Test" /></Field>
          <Field label="Exam" required><Input name="exam" value={values.exam} onChange={(e) => update("exam", e.target.value)} required maxLength={80} placeholder="JEE Main or NEET" /></Field>
          <Field label="Subject" required><Input name="subject" value={values.subject} onChange={(e) => update("subject", e.target.value)} required maxLength={80} placeholder="Physics" /></Field>
          <Field label="Class level" required><Input name="class_level" value={values.class_level} onChange={(e) => update("class_level", e.target.value)} required maxLength={80} placeholder="Class 12" /></Field>
          <Field label="Year" required><Input name="year" type="number" value={values.year} onChange={(e) => update("year", e.target.value)} required min="2000" max="2100" /></Field>
          <Field label="Difficulty" required><select name="difficulty" value={values.difficulty} onChange={(e) => update("difficulty", e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">{DIFFICULTIES.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Paper type" required><select name="paper_type" value={values.paper_type} onChange={(e) => update("paper_type", e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">{PAPER_TYPES.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Question count" required><Input name="question_count" type="number" value={values.question_count} onChange={(e) => update("question_count", e.target.value)} required min="1" placeholder="90" /></Field>
          <Field label="Duration (minutes)" required><Input name="duration_minutes" type="number" value={values.duration_minutes} onChange={(e) => update("duration_minutes", e.target.value)} required min="1" placeholder="180" /></Field>
          <div className="md:col-span-2 lg:col-span-3"><Field label="Description"><Textarea name="description" value={values.description} onChange={(e) => update("description", e.target.value)} maxLength={4000} placeholder="Briefly describe what this paper covers." /></Field></div>
          <Field label={`Paper PDF${editing ? " (replace optional)" : ""}`} required={!editing}><Input ref={mainFileRef} name="file" type="file" accept="application/pdf,.pdf" required={!editing} /></Field>
          <Field label="Solution PDF (optional)"><Input ref={solutionFileRef} name="solution_file" type="file" accept="application/pdf,.pdf" /></Field>
          <div className="flex items-end"><label className="flex min-h-10 items-center gap-3 rounded-lg border border-input px-3 text-sm"><Switch checked={values.is_published} onCheckedChange={(checked) => update("is_published", checked)} /><span><span className="block font-medium">Published</span><span className="text-xs text-muted-foreground">Visible on the website</span></span></label></div>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={isPending}><UploadCloudIcon />{isPending ? "Saving…" : editing ? "Save changes" : "Upload paper"}</Button>
          <p className="text-xs text-muted-foreground">PDF files only. Existing PDFs stay unchanged unless you choose a replacement.</p>
        </div>
      </form>

      <section>
        <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-navy">Existing papers</h2><p className="mt-1 text-sm text-muted-foreground">{papers.length} paper{papers.length === 1 ? "" : "s"} in your library.</p></div></div>
        <div className="mt-5 overflow-hidden rounded-2xl bg-white ring-1 ring-border">
          <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="border-b bg-muted/40 text-left text-muted-foreground"><tr>{["Title", "Exam", "Subject", "Year", "Published", "Views", "Downloads", "Created at", "Actions"].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{papers.map((paper) => <tr key={paper.id} className="border-b last:border-0"><td className="max-w-64 px-4 py-3 font-medium text-navy"><span className="flex items-center gap-2"><FileTextIcon className="size-4 shrink-0 text-indigo-600" /><span className="truncate">{paper.title}</span></span></td><td className="px-4 py-3">{paper.exam}</td><td className="px-4 py-3">{paper.subject}</td><td className="px-4 py-3">{paper.year}</td><td className="px-4 py-3"><button type="button" disabled={isPending} onClick={() => changePublication(paper)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${paper.is_published ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>{paper.is_published ? "Published" : "Draft"}</button></td><td className="px-4 py-3">{paper.view_count.toLocaleString()}</td><td className="px-4 py-3">{paper.download_count.toLocaleString()}</td><td className="px-4 py-3 text-muted-foreground">{format(new Date(paper.created_at), "dd MMM yyyy")}</td><td className="px-4 py-3"><div className="flex gap-1"><Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => editPaper(paper)}><PencilIcon />Edit</Button><Button type="button" size="sm" variant="destructive" disabled={isPending} onClick={() => removePaper(paper)}><Trash2Icon />Delete</Button></div></td></tr>)}</tbody></table></div>
          {papers.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">No sample papers have been uploaded yet.</div> : null}
        </div>
      </section>
      {isPending ? <div className="fixed bottom-5 right-5 flex items-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm text-white shadow-lg"><LoaderCircleIcon className="size-4 animate-spin" />Saving changes…</div> : null}
    </div>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}{required ? <span className="ml-1 text-destructive">*</span> : null}</Label>{children}</div>;
}
