import { redirect } from "next/navigation";
import { CounsellingRequestManager } from "@/components/admin/counselling-request-manager";
import { createClient, requireAdmin } from "@/lib/supabase/server";
import type { CounsellingRequest } from "@/types/database";

export const metadata = { title: "Counselling requests" };

export default async function AdminCounsellingPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const supabase = await createClient();
  if (!supabase) redirect("/login");
  const { data, error } = await supabase
    .from("counselling_requests")
    .select("id, student_name, email, phone, class_target, preferred_mode, location, preferred_time, user_id, request_type, course_id, status, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load counselling requests.");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Admin</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">Counselling requests</h1>
      <p className="mt-2 text-muted-foreground">Review new enquiries, record notes and track follow-up progress.</p>
      <div className="mt-8"><CounsellingRequestManager requests={(data ?? []) as CounsellingRequest[]} /></div>
    </div>
  );
}
