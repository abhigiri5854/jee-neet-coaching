import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaperActions } from "@/components/papers/paper-card";
import { getPaperBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = await getPaperBySlug(slug);
  if (!paper) return { title: "Sample paper" };
  return { title: paper.title, description: paper.description ?? paper.title };
}

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = await getPaperBySlug(slug);
  if (!paper) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-medium text-indigo-600">
        {paper.exam} · {paper.subject} · {paper.year}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy">{paper.title}</h1>
      <p className="mt-3 text-muted-foreground">
        {paper.description} · {paper.question_count} questions · {paper.duration_minutes} minutes ·{" "}
        {paper.difficulty} · {paper.paper_type}
      </p>
      <div className="mt-5">
        <PaperActions slug={paper.slug} />
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-border">
        <iframe
          title={paper.title}
          src={`/api/sample-papers/${paper.slug}`}
          className="h-[80vh] w-full bg-white"
        />
      </div>
    </div>
  );
}
