import type { Metadata } from "next";
import Link from "next/link";
import { getBatches } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Batches",
  description: "Upcoming and ongoing PrepXpert batches for JEE and NEET.",
};

export default async function BatchesPage() {
  const batches = await getBatches();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">Batches</h1>
      <p className="mt-2 text-muted-foreground">
        Morning, evening and dropper batches with limited seats.
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl bg-white ring-1 ring-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-lavender text-navy">
            <tr>
              <th className="px-4 py-3 font-semibold">Batch</th>
              <th className="px-4 py-3 font-semibold">Exam</th>
              <th className="px-4 py-3 font-semibold">Schedule</th>
              <th className="px-4 py-3 font-semibold">Start</th>
              <th className="px-4 py-3 font-semibold">Seats</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id} className="border-t border-border">
                <td className="px-4 py-4">
                  <p className="font-medium text-navy">{batch.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {batch.class_level} · {batch.mode}
                  </p>
                </td>
                <td className="px-4 py-4">{batch.exam}</td>
                <td className="px-4 py-4">{batch.schedule}</td>
                <td className="px-4 py-4">
                  {new Date(batch.start_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-4">
                  {batch.seats_left}/{batch.seats_total}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={batch.course_id ? `/courses` : "/#counselling"}
                    className={cn(buttonVariants({ size: "sm" }), "h-8")}
                  >
                    Apply
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
