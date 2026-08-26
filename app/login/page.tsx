import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-navy">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="text-indigo-600 hover:underline">
          Create an account
        </Link>
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-border card-shadow">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
