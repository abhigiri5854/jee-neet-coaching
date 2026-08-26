import { createClient } from "@/lib/supabase/server";
import {
  BATCHES,
  COURSES,
  SAMPLE_PAPERS,
  TEACHERS,
  TESTIMONIALS,
} from "@/lib/data/catalog";
import type {
  Batch,
  Course,
  SamplePaper,
  Teacher,
  Testimonial,
} from "@/types/database";

function published<T extends { is_published: boolean }>(items: T[]) {
  return items.filter((item) => item.is_published);
}

export async function getTeachers(): Promise<Teacher[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("is_published", true)
      .order("experience_years", { ascending: false });
    if (!error && data?.length) return data as Teacher[];
  }
  return published(TEACHERS);
}

export async function getTeacherBySlug(slug: string) {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!error && data) return data as Teacher;
  }
  return published(TEACHERS).find((t) => t.slug === slug) ?? null;
}

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("courses")
      .select("*, teachers(*)")
      .eq("is_published", true)
      .order("is_popular", { ascending: false });
    if (!error && data?.length) return data as Course[];
  }
  return published(COURSES);
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("courses")
      .select("*, teachers(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!error && data) return data as Course;
  }
  return published(COURSES).find((c) => c.slug === slug) ?? null;
}

export async function getBatches(): Promise<Batch[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("batches")
      .select("*, teachers(*), courses(*)")
      .eq("is_published", true)
      .order("start_date", { ascending: true });
    if (!error && data?.length) return data as Batch[];
  }
  return published(BATCHES);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (!error && data?.length) return data as Testimonial[];
  }
  return published(TESTIMONIALS);
}

export async function getSamplePapers(): Promise<SamplePaper[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("sample_papers")
      .select("*")
      .eq("is_published", true)
      .order("year", { ascending: false });
    if (!error && data?.length) return data as SamplePaper[];
  }
  return published(SAMPLE_PAPERS);
}

export async function getPaperBySlug(slug: string) {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("sample_papers")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!error && data) return data as SamplePaper;
  }
  return published(SAMPLE_PAPERS).find((p) => p.slug === slug) ?? null;
}

export function filterPapers(
  papers: SamplePaper[],
  filters: {
    q?: string;
    exam?: string;
    subject?: string;
    year?: string;
    paper_type?: string;
  }
) {
  const q = filters.q?.trim().toLowerCase();
  return papers.filter((paper) => {
    if (filters.exam && paper.exam !== filters.exam) return false;
    if (filters.subject && paper.subject !== filters.subject) return false;
    if (filters.year && String(paper.year) !== filters.year) return false;
    if (filters.paper_type && paper.paper_type !== filters.paper_type) {
      return false;
    }
    if (q) {
      const haystack = [
        paper.title,
        paper.exam,
        paper.subject,
        paper.paper_type,
        paper.description ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function examBadgeClass(exam: string) {
  if (exam.includes("NEET") && exam.toLowerCase().includes("drop")) {
    return "bg-rose-600 text-white";
  }
  if (exam.includes("NEET")) return "bg-emerald-600 text-white";
  if (exam.toLowerCase().includes("drop") || exam.includes("Advanced")) {
    return "bg-navy text-white";
  }
  return "bg-indigo-600 text-white";
}// Compatibility alias
export const getPapers = getSamplePapers;