import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-navy">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-border card-shadow">
        <SignupForm />
      </div>
    </div>
  );
}
