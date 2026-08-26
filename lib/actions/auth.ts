"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
} from "@/lib/validations/auth";
import { SITE } from "@/lib/site";

export type AuthState = {
  ok: boolean;
  message: string;
};

export async function loginAction(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Authentication is not configured. Add Supabase keys in .env.local.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, message: "Invalid email or password." };
  }

  const next = String(formData.get("next") || "/dashboard");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signupAction(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Authentication is not configured. Add Supabase keys in .env.local.",
    };
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
      },
      emailRedirectTo: `${SITE.url}/dashboard`,
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message:
      "Account created. Check your email if confirmation is enabled, then log in.",
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}

export async function forgotPasswordAction(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Enter a valid email" };
  }
  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Authentication is not configured. Add Supabase keys in .env.local.",
    };
  }
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${SITE.url}/reset-password`,
  });
  if (error) return { ok: false, message: error.message };
  return {
    ok: true,
    message: "If that email exists, a reset link has been sent.",
  };
}
