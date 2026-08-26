import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-navy">Reset password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We will email a reset link if the account exists.
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-border card-shadow">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
