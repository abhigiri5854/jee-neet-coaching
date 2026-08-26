import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, requireAdmin } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/login");
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const admin = await requireAdmin();

  const name =
    (data.user.user_metadata?.full_name as string | undefined) ??
    data.user.email ??
    "Student";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">Hi, {name}</h1>
      <p className="mt-2 text-muted-foreground">
        Your student dashboard. Browse courses, papers and upcoming batches.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/courses" className="rounded-2xl bg-white p-5 ring-1 ring-border">
          <p className="font-semibold text-navy">Courses</p>
          <p className="mt-1 text-sm text-muted-foreground">Explore live batches</p>
        </Link>
        <Link href="/sample-papers" className="rounded-2xl bg-white p-5 ring-1 ring-border">
          <p className="font-semibold text-navy">Sample papers</p>
          <p className="mt-1 text-sm text-muted-foreground">View and download PDFs</p>
        </Link>
        <Link href="/#counselling" className="rounded-2xl bg-white p-5 ring-1 ring-border">
          <p className="font-semibold text-navy">Counselling</p>
          <p className="mt-1 text-sm text-muted-foreground">Talk to a mentor</p>
        </Link>
      </div>
      {admin ? (
        <Link href="/admin/counselling" className="mt-4 block rounded-2xl bg-white p-5 ring-1 ring-border">
          <p className="font-semibold text-navy">Manage counselling requests</p>
          <p className="mt-1 text-sm text-muted-foreground">Review enquiries and update follow-up status</p>
        </Link>
      ) : null}
      <form action={logoutAction} className="mt-8">
        <Button type="submit" variant="outline">
          Logout
        </Button>
      </form>
      <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "mt-3")}>
        Back to home
      </Link>
    </div>
  );
}
