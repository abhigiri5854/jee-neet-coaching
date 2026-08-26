import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: "PrepXpert is an online JEE and NEET coaching institute focused on live teaching and personal mentoring.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">About {SITE.name}</h1>
      <p className="mt-4 text-muted-foreground">
        {SITE.name} is a focused online classroom for JEE Main, JEE Advanced and NEET UG. We
        combine live teaching, weekly tests and one-to-one counselling so students are never left
        guessing what to study next.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-navy">What we believe</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Clarity first, then speed — concepts before shortcuts.</li>
        <li>Every student gets a counsellor, not just a login.</li>
        <li>Practice must match the latest NTA pattern.</li>
        <li>Parents should see progress without chasing teachers.</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold text-navy">Contact</h2>
      <p className="mt-3 text-muted-foreground">
        Email support@prepxpert.in · Phone +91 98765 43210 · Counselling 10 AM – 8 PM IST
      </p>
      <Link href="/#counselling" className={cn(buttonVariants(), "mt-8 h-11 px-5")}>
        Talk to an expert
      </Link>
    </div>
  );
}
