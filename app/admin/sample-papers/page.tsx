import { redirect } from "next/navigation";
import { SamplePaperManager } from "@/components/admin/sample-paper-manager";
import { createClient, requireAdmin } from "@/lib/supabase/server";
import type { SamplePaper } from "@/types/database";

export const metadata = { title: "Manage sample papers" };

export default async function AdminSamplePapersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");
  const supabase = await createClient();
  if (!supabase) redirect("/login");
  const { data, error } = await supabase.from("sample_papers").select("*").order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load sample papers.");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Admin</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">Sample papers</h1>
      <p className="mt-2 text-muted-foreground">Upload papers, control publication and keep your library current.</p>
      <div className="mt-8"><SamplePaperManager papers={(data ?? []) as SamplePaper[]} /></div>
    </div>
  );
}
