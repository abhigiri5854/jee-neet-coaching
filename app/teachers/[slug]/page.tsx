import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTeacherBySlug, getCourses } from "@/lib/queries";
import { CourseCard } from "@/components/courses/course-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const teacher = await getTeacherBySlug(slug);
  if (!teacher) return { title: "Teacher" };
  return { title: teacher.name, description: teacher.short_bio };
}

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const teacher = await getTeacherBySlug(slug);
  if (!teacher) notFound();
  const courses = (await getCourses()).filter((course) => course.teacher_id === teacher.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={teacher.photo_path}
          alt={teacher.name}
          className="h-80 w-full rounded-3xl object-cover object-top ring-1 ring-border"
        />
        <div>
          <p className="text-sm font-medium text-indigo-600">{teacher.subject}</p>
          <h1 className="mt-1 text-4xl font-bold text-navy">{teacher.name}</h1>
          <p className="mt-2 text-muted-foreground">
            {teacher.qualification} · {teacher.experience_years} years · {teacher.rating.toFixed(1)}★
          </p>
          <p className="mt-6 max-w-2xl text-muted-foreground">{teacher.bio}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {teacher.highlights.map((item) => (
              <li key={item} className="rounded-full bg-lavender px-3 py-1 text-sm text-navy">
                {item}
              </li>
            ))}
          </ul>
          <Link href="/#counselling" className={cn(buttonVariants(), "mt-8 h-11 px-5")}>
            Book counselling with faculty
          </Link>
        </div>
      </div>
      {courses.length ? (
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold text-navy">Courses by {teacher.name}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
