import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CounsellingForm } from "@/components/forms/counselling-form";
import { getCourseBySlug } from "@/lib/queries";
import { discountPercent, formatInr } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course" };
  return { title: course.title, description: course.short_description };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const teacher = course.teachers;
  const off = discountPercent(course.original_price, course.price);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.4fr_0.8fr]">
      <article>
        <p className="text-sm font-medium text-indigo-600">
          {course.exam} · {course.class_level}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-navy">{course.title}</h1>
        <p className="mt-4 text-muted-foreground">{course.description}</p>
        {teacher ? (
          <Link href={`/teachers/${teacher.slug}`} className="mt-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={teacher.photo_path} alt="" className="size-12 rounded-full object-cover" />
            <div>
              <p className="font-medium text-navy">{teacher.name}</p>
              <p className="text-sm text-muted-foreground">{teacher.subject} faculty</p>
            </div>
          </Link>
        ) : null}
        <h2 className="mt-10 text-xl font-semibold text-navy">What you get</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {course.features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2 className="mt-8 text-xl font-semibold text-navy">Syllabus snapshot</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {(course.syllabus ?? []).map((item) => (
            <li key={item} className="rounded-lg bg-lavender px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="#enrol" className={cn(buttonVariants(), "h-11 px-5")}>
            Request a demo
          </Link>
          <Link
            href="/sample-papers"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
          >
            Practice papers
          </Link>
        </div>
      </article>
      <aside id="enrol" className="h-fit rounded-2xl bg-white p-6 ring-1 ring-border card-shadow">
        <p className="text-3xl font-bold text-navy">{formatInr(course.price)}</p>
        {off > 0 ? (
          <p className="text-sm text-muted-foreground">
            <span className="line-through">{formatInr(course.original_price)}</span> · {off}% off ·{" "}
            {course.duration_months} months
          </p>
        ) : null}
        <div className="mt-6">
          <CounsellingForm
            courseId={course.id}
            requestType="demo"
            submitLabel="Book free demo"
          />
        </div>
      </aside>
    </div>
  );
}
