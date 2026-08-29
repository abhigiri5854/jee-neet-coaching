"use server";

import { z } from "zod";
import { createClient, getUser } from "@/lib/supabase/server";

export async function toggleSavedSamplePaper(paperId: string) {
  if (!z.string().uuid().safeParse(paperId).success) throw new Error("Invalid paper.");
  const user = await getUser();
  if (!user) throw new Error("Please log in to save papers.");
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data: existing, error: readError } = await supabase
    .from("saved_sample_papers")
    .select("id")
    .eq("paper_id", paperId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (readError) throw new Error("Your saved papers could not be checked.");
  if (existing) {
    const { error } = await supabase.from("saved_sample_papers").delete().eq("id", existing.id);
    if (error) throw new Error("The paper could not be removed from saved papers.");
    return { saved: false };
  }
  const { error } = await supabase.from("saved_sample_papers").insert({ paper_id: paperId, user_id: user.id });
  if (error) throw new Error("The paper could not be saved.");
  return { saved: true };
}
