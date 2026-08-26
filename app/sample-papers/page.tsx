import type { Metadata } from "next";
import { PaperCard } from "@/components/papers/paper-card";
import { PaperFilters } from "@/components/papers/paper-filters";
import { filterPapers, getPapers } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Sample Papers",
  description: "Filter and download JEE and NEET sample papers. View PDFs online or save them locally.",
};

export default async function SamplePapersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    exam?: string;
    subject?: string;
    year?: string;
    paper_type?: string;
  }>;
}) {
  const filters = await searchParams;
  const papers = filterPapers(await getPapers(), filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">Sample Papers</h1>
      <p className="mt-2 text-muted-foreground">
        Search by exam, subject, year or paper type. Every paper has a real PDF for viewing and
        download.
      </p>
      <div className="mt-6">
        <PaperFilters values={filters} />
      </div>
      {papers.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No papers match those filters.</p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}
