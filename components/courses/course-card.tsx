import Link from "next/link";
import { discountPercent, formatInr } from "@/lib/site";
import { examBadgeClass } from "@/lib/queries";
import type { Course } from "@/types/database";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CourseCard({ course }: { course: Course }) {
  const off = discountPercent(course.original_price, course.price);
  const teacher = course.teachers;
  return (
    <article className="card-shadow flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border">
      <div className="relative h-44 bg-lavender">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={teacher?.photo_path ?? course.image_path}
          alt={teacher?.name ?? course.title}
          className="h-full w-full object-cover object-top"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
            examBadgeClass(course.exam)
          )}
        >
          {course.exam}
          {course.class_level === "Dropper" ? " · Dropper" : ""}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold text-navy">{course.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {course.duration_months} Months Course
            {teacher ? ` · ${teacher.name}` : ""}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-navy">{formatInr(course.price)}</p>
            {off > 0 ? (
              <p className="text-xs text-muted-foreground">
                <span className="line-through">{formatInr(course.original_price)}</span>{" "}
                <span className="text-emerald-600">{off}% off</span>
              </p>
            ) : null}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className={cn(buttonVariants(), "h-9 px-4")}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
