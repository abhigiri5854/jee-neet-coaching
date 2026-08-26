import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm font-medium text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        That link is missing or the paper has been unpublished.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-8 h-11 px-5")}>
        Go home
      </Link>
    </div>
  );
}
