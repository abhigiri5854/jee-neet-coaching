"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, requireAdmin } from "@/lib/supabase/server";

const requestUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "scheduled", "completed", "cancelled"]),
  notes: z.string().trim().max(4000, "Notes are too long").nullable(),
});

export async function updateCounsellingRequest(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("You are not authorized to update counselling requests.");

  const parsed = requestUpdateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    notes: formData.get("notes") || null,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid request.");
  }

  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("counselling_requests")
    .update({ status: parsed.data.status, notes: parsed.data.notes })
    .eq("id", parsed.data.id);

  if (error) throw new Error("The request could not be updated. Please try again.");
  revalidatePath("/admin/counselling");
}
