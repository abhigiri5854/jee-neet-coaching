"use server";

import { counsellingSchema } from "@/lib/validations/counselling";
import { createClient } from "@/lib/supabase/server";
import { notifyCounsellingRequest } from "@/lib/notifications/counselling";

export type ActionState = {
  ok: boolean;
  message: string;
};

export async function submitCounselling(
  _prev: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const parsed = counsellingSchema.safeParse({
    student_name: formData.get("student_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    class_target: formData.get("class_target"),
    preferred_mode: formData.get("preferred_mode"),
    location: formData.get("location"),
    request_type: formData.get("request_type") || "counselling",
    course_id: formData.get("course_id") || null,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      message:
        "Counselling is not connected yet. Add your Supabase keys in .env.local and run the migration.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("counselling_requests").insert({
    student_name: parsed.data.student_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    class_target: parsed.data.class_target,
    preferred_mode: parsed.data.preferred_mode,
    location: parsed.data.location,
    preferred_time: parsed.data.preferred_time || null,
    request_type: parsed.data.request_type,
    course_id: parsed.data.course_id || null,
    user_id: user?.id ?? null,
    status: "new",
  });

  if (error) {
    if (error.code === "P0001" && error.message.includes("duplicate counselling request")) {
      return {
        ok: false,
        message: "We already received a request from this mobile number recently. Please wait for our team to contact you.",
      };
    }
    return {
      ok: false,
      message: "Could not submit your request. Please try again in a moment.",
    };
  }

  let studentConfirmationSent = false;
  try {
    const result = await notifyCounsellingRequest({
      studentName: parsed.data.student_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      classTarget: parsed.data.class_target,
      preferredMode: parsed.data.preferred_mode,
      location: parsed.data.location,
    });
    studentConfirmationSent = result.studentConfirmationSent;
  } catch {
    // Delivery is best-effort. A saved counselling request must not be lost when a provider is unavailable.
  }

  return {
    ok: true,
    message: studentConfirmationSent
      ? "Your request has been received. A confirmation has been sent, and our experts will contact you shortly."
      : "Your request has been received. Our experts will contact you shortly.",
  };
}
