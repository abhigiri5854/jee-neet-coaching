import type { Metadata } from "next";
import { CourseCard } from "@/components/courses/course-card";
import { getCourses } from "@/lib/queries";
import { EXAMS } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Courses",
  description: "JEE and NEET live courses, dropper batches and complete classroom programmes.",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>;
}) {
  const { exam } = await searchParams;
  const courses = await getCourses();
  const filtered = exam ? courses.filter((course) => course.exam === exam) : courses;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">Courses</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Structured live programmes for JEE Main, JEE Advanced and NEET UG.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/courses"
          className={`rounded-full px-3 py-1 text-sm ${!exam ? "bg-indigo-600 text-white" : "bg-lavender text-navy"}`}
        >
          All
        </Link>
        {EXAMS.map((item) => (
          <Link
            key={item}
            href={`/courses?exam=${encodeURIComponent(item)}`}
            className={`rounded-full px-3 py-1 text-sm ${exam === item ? "bg-indigo-600 text-white" : "bg-lavender text-navy"}`}
          >
            {item}
          </Link>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No courses found for this exam.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
