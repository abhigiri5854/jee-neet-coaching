import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: "Chemistry by M.K Rana Sir is an online JEE and NEET coaching institute focused on live teaching and personal mentoring.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">About Us</h1>

      <h2 className="mt-8 text-xl font-semibold text-navy">Mohit Rana — Chemistry for NEET/JEE</h2>
      <p className="mt-3 text-muted-foreground">
        Mohit Rana is an Ex-Senior Faculty of Target PMT, Delhi, and Med IIT, Delhi, with 18+ years
        of experience teaching Chemistry for NEET and JEE examinations.
      </p>
      <p className="mt-3 text-muted-foreground">
        Currently serving as HOD – Chemistry at Arjuna Classes, Sonipat, and AWOM Academy, Dwarka
        Sector 4, Delhi, he has successfully mentored 10,000+ students.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-navy">Why Learn Chemistry with Us?</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>18+ years of teaching experience in NEET &amp; JEE Chemistry</li>
        <li>Successfully mentored 10,000+ students</li>
        <li>Strong focus on concept building from basics to advanced level</li>
        <li>Super-fast tricks and smart techniques for accurate problem solving</li>
        <li>Extensive practice through a large number of quality questions</li>
        <li>Regular NCERT-based classes and test series</li>
        <li>Immediate doubt resolution to build confidence and improve performance</li>
        <li>Systematic preparation designed according to the requirements of NEET &amp; JEE</li>
        <li>Small-group personalised coaching</li>
      </ul>

      <p className="mt-6 text-muted-foreground">
        Our teaching methodology starts from the absolute basics and gradually takes students to the
        advanced level, with strong conceptual clarity, intensive question practice, regular tests,
        and continuous performance improvement.
      </p>
      <p className="mt-3 text-muted-foreground">
        Your success depends on the right guidance, consistent practice, and disciplined
        preparation.
      </p>
      <p className="mt-3 text-muted-foreground">
        Attend a Demo Class and Experience the Difference in Learning Chemistry with Us!
      </p>

      <Link href="/#counselling" className={cn(buttonVariants(), "mt-8 h-11 px-5")}>
        Talk to an expert
      </Link>
    </div>
  );
}