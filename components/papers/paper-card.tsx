import Link from "next/link";
import type { SamplePaper } from "@/types/database";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaperActions({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex gap-2", compact && "flex-col sm:flex-row")}>
      <a
        href={`/api/sample-papers/${slug}`}
        target="_blank"
        rel="noreferrer"
        className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3")}
      >
        View Online
      </a>
      <a
        href={`/api/sample-papers/${slug}?download=1`}
        className={cn(buttonVariants(), "h-9 px-3")}
      >
        Download
      </a>
    </div>
  );
}

export function PaperCard({ paper }: { paper: SamplePaper }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-border card-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
            {paper.exam} · {paper.year}
          </p>
          <h3 className="mt-1 font-semibold text-navy">
            <Link href={`/sample-papers/${paper.slug}`} className="hover:underline">
              {paper.title}
            </Link>
          </h3>
        </div>
        <span className="rounded-full bg-lavender px-2 py-0.5 text-[11px] font-medium text-indigo-800">
          {paper.paper_type}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {paper.subject} · {paper.class_level} · {paper.question_count} Qs · {paper.duration_minutes} min
      </p>
      {paper.description ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">{paper.description}</p>
      ) : null}
      <PaperActions slug={paper.slug} />
    </article>
  );
}
