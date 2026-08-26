"use client";

import { useRouter } from "next/navigation";
import { EXAMS, PAPER_TYPES, SUBJECTS } from "@/lib/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PaperFilters({
  values,
}: {
  values: {
    q?: string;
    exam?: string;
    subject?: string;
    year?: string;
    paper_type?: string;
  };
}) {
  const router = useRouter();

  return (
    <form
      className="grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-border sm:grid-cols-2 lg:grid-cols-6"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        for (const [key, value] of data.entries()) {
          const v = String(value).trim();
          if (v) params.set(key, v);
        }
        router.push(`/sample-papers?${params.toString()}`);
      }}
    >
      <Input
        name="q"
        defaultValue={values.q}
        placeholder="Search papers"
        className="h-10 lg:col-span-2"
      />
      <select
        name="exam"
        defaultValue={values.exam ?? ""}
        className="h-10 rounded-lg border border-input bg-transparent px-2 text-sm"
      >
        <option value="">All exams</option>
        {EXAMS.map((exam) => (
          <option key={exam} value={exam}>
            {exam}
          </option>
        ))}
      </select>
      <select
        name="subject"
        defaultValue={values.subject ?? ""}
        className="h-10 rounded-lg border border-input bg-transparent px-2 text-sm"
      >
        <option value="">All subjects</option>
        {SUBJECTS.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
      <select
        name="paper_type"
        defaultValue={values.paper_type ?? ""}
        className="h-10 rounded-lg border border-input bg-transparent px-2 text-sm"
      >
        <option value="">All types</option>
        {PAPER_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <Input
          name="year"
          defaultValue={values.year}
          placeholder="Year"
          className="h-10"
        />
        <Button type="submit" className="h-10 px-4">
          Filter
        </Button>
      </div>
    </form>
  );
}
