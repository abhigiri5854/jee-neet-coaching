import Link from "next/link";
import type { Teacher } from "@/types/database";

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Link
      href={`/teachers/${teacher.slug}`}
      className="card-shadow overflow-hidden rounded-2xl bg-white ring-1 ring-border transition hover:-translate-y-0.5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={teacher.photo_path}
        alt={teacher.name}
        className="h-56 w-full object-cover object-top"
      />
      <div className="p-4">
        <h3 className="font-semibold text-navy">{teacher.name}</h3>
        <p className="text-sm text-indigo-600">{teacher.subject}</p>
        <p className="mt-2 text-sm text-muted-foreground">{teacher.short_bio}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          {teacher.experience_years} yrs · {teacher.qualification} · {teacher.rating.toFixed(1)}★
        </p>
      </div>
    </Link>
  );
}
