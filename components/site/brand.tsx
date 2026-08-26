import Link from "next/link";
import { SITE } from "@/lib/site";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <path d="M5 19V5l7 4 7-4v14l-7-4-7 4Z" fill="currentColor" />
        </svg>
      </span>
      <span
        className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-navy"}`}
      >
        {SITE.name}
      </span>
    </Link>
  );
}
