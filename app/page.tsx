import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  PlayCircle,
  Users,
  Video,
} from "lucide-react";
import { CounsellingForm } from "@/components/forms/counselling-form";
import { CourseCard } from "@/components/courses/course-card";
import { PaperActions } from "@/components/papers/paper-card";
import { buttonVariants } from "@/components/ui/button";
import { getCourses, getPapers, getTestimonials } from "@/lib/queries";
import { FEATURES, SITE, STATS } from "@/lib/site";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const [courses, papers, testimonials] = await Promise.all([
    getCourses(),
    getPapers(),
    getTestimonials(),
  ]);
  const featuredCourses = courses.slice(0, 4);
  const latestPapers = papers.slice(0, 4);

  return (
    <div>
      <section className="navy-gradient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-20 top-10 size-72 rounded-full bg-indigo-600 blur-3xl" />
          <div className="absolute right-0 top-20 size-80 rounded-full bg-violet-700 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-12">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-200">
              Online JEE & NEET coaching
            </p>
           <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/75 md:text-lg">
              Live classes, sample papers, doubt solving and 1:1 mentorship — built for serious
              rankers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className={cn(buttonVariants(), "h-11 bg-indigo-500 px-5 text-sm hover:bg-indigo-400")}
              >
                Explore Courses <ArrowRight />
              </Link>
              <Link
                href="#counselling"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 border-white/30 bg-transparent px-5 text-white hover:bg-white/10"
                )}
              >
                <PlayCircle /> Try Free Demo Class
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-4 text-lg">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-base text-white/60">Top Teachers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-base text-white/60">Students Trust Us</p>
              </div>
              <div>
                <p className="text-3xl font-bold">95%</p>
                <p className="text-base text-white/60">Success Rate</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
            <Image
              src="/images/hero-image.png"
              alt="Students preparing for JEE and NEET exams"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section id="counselling" className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-navy md:text-5xl">
              Need Personal Guidance? Talk to Our Experts.
            </h2>
            <p className="mt-3 max-w-lg text-lg text-muted-foreground">
              Share your class and target exam. We will recommend a batch and unlock a free
              counselling call.
            </p>
            <div className="mt-8 overflow-hidden rounded-3xl bg-lavender">
              <Image
                src="/images/counselling-image.png"
                alt="Personal counselling for JEE and NEET preparation"
                width={1200}
                height={720}
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="h-72 w-full object-cover object-top"
              />
            </div>
            <Link
              href="#counselling-form"
              className={cn(buttonVariants(), "mt-6 h-11 px-6")}
            >
              Get Free Counselling <ArrowRight />
            </Link>
          </div>
          <div id="counselling-form" className="rounded-3xl bg-white p-6 ring-1 ring-border card-shadow md:p-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Free counselling
            </p>
            <h3 className="mb-6 text-2xl font-bold text-navy">Book a call</h3>
            <CounsellingForm />
          </div>
        </div>
      </section>

      <section className="bg-lavender/60 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = {
              video: Video,
              user: GraduationCap,
              file: BookOpen,
              message: MessageCircle,
              users: Users,
              school: GraduationCap,
            }[feature.icon];
            return (
              <article key={feature.title} className="rounded-2xl bg-white p-8 ring-1 ring-border">
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-indigo-50">
                  <Icon className="size-7" />
                </div>
                <h3 className="text-xl font-bold text-navy">{feature.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-navy">Popular Courses</h2>
            <Link href="/courses" className="text-sm font-medium text-indigo-600 hover:underline">
              View all courses →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="navy-gradient py-10 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-navy">Latest Sample Papers</h3>
              <Link href="/sample-papers" className="text-sm text-indigo-600">
                View all →
              </Link>
            </div>
            <ul className="space-y-4">
              {latestPapers.map((paper) => (
                <li key={paper.id} className="border-b border-border pb-4 last:border-0">
                  <p className="font-medium text-navy">{paper.title}</p>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {paper.subject} · {paper.exam}
                  </p>
                  <PaperActions slug={paper.slug} compact />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
            <h3 className="mb-4 font-semibold text-navy">How it works</h3>
            <ol className="space-y-4">
              {["Choose your course", "Attend live classes", "Practice & learn", "Achieve your goal"].map(
                (step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-navy">{step}</p>
                      <p className="text-sm text-muted-foreground">
                        A guided path from counselling to exam day.
                      </p>
                    </div>
                  </li>
                )
              )}
            </ol>
          </div>
          <div className="rounded-2xl bg-lavender p-6">
            <h3 className="mb-4 font-semibold text-navy">Why thousands trust {SITE.name}</h3>
            <ul className="space-y-3 text-sm text-navy/80">
              {[
                "Faculty with 10–20 years of JEE/NEET experience",
                "Full-length papers in latest NTA pattern",
                "Personal counselling before you enrol",
                "Recorded lectures after every live class",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/signup" className={cn(buttonVariants(), "mt-6 h-10 w-full")}>
              Start your journey today →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-lavender/50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-navy">What our students say</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="rounded-2xl bg-white p-6 ring-1 ring-border"
              >
                <p className="text-amber-500">{"★".repeat(item.rating)}</p>
                <p className="mt-3 text-sm text-muted-foreground">“{item.quote}”</p>
                <footer className="mt-4 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.photo_path ?? "/images/students/rohan.svg"}
                    alt=""
                    className="size-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-navy">{item.student_name}</p>
                    <p className="text-xs text-muted-foreground">{item.exam_label}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
