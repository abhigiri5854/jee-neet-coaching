export const SITE = {
  name: "PrepXpert",
  tagline: "Learn. Practice. Excel.",
  description:
    "PrepXpert is a premium online JEE & NEET coaching platform with live classes, sample papers, doubt solving and one-to-one mentorship.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/sample-papers", label: "Sample Papers" },
  { href: "/teachers", label: "Teachers" },
  { href: "/batches", label: "Batch" },
  { href: "/about", label: "About Us" },
] as const;

export const IMAGES = {
  logo: "/images/logo.svg",
  heroMentor: "/images/hero-mentor.svg",
  counsellingMentor: "/images/counselling-mentor.svg",
  teachers: {
    default: "/images/teachers/placeholder.svg",
  },
  courses: {
    default: "/images/courses/placeholder.svg",
  },
  og: "/images/og-cover.svg",
} as const;

export const CLASS_TARGETS = [
  "Class 11 – JEE",
  "Class 12 – JEE",
  "JEE Dropper",
  "Class 11 – NEET",
  "Class 12 – NEET",
  "NEET Dropper",
] as const;

export const STATS = [
  { value: "500+", label: "Expert Teachers" },
  { value: "10,000+", label: "Happy Students" },
  { value: "50,000+", label: "Classes Conducted" },
  { value: "95%", label: "Success Rate" },
] as const;

export const FEATURES = [
  {
    title: "Live Classes",
    description: "Interactive live classes with top faculty",
    icon: "video",
  },
  {
    title: "One-to-One Classes",
    description: "Personalized attention for faster progress",
    icon: "user",
  },
  {
    title: "Sample Papers",
    description: "Chapter-wise and full-length papers with solutions",
    icon: "file",
  },
  {
    title: "Doubt Solving",
    description: "Instant doubt resolution",
    icon: "message",
  },
  {
    title: "Student Interaction",
    description: "Connect with peers and learn together",
    icon: "users",
  },
  {
    title: "Online Batches",
    description: "Regular & crash courses for JEE & NEET",
    icon: "school",
  },
] as const;

export const HOW_IT_WORKS = [
  { step: "01", title: "Choose Your Course", text: "Pick JEE, NEET or a dropper batch that matches your target year." },
  { step: "02", title: "Attend Live Classes", text: "Learn from expert teachers with structured weekly timetables." },
  { step: "03", title: "Practice & Learn", text: "Solve sample papers, revise with solutions and clear doubts." },
  { step: "04", title: "Achieve Your Goal", text: "Track progress, stay consistent and walk into the exam prepared." },
] as const;

export const TRUST_POINTS = [
  "Faculty with 10–40 years of JEE/NEET classroom experience",
  "Chapter-wise and full-length papers modelled on NTA pattern",
  "One-to-one counselling before you join a batch",
  "Regular tests, performance reports and parent updates",
  "Recorded lectures for revision after every live class",
  "Focused dropper and board + entrance dual-target batches",
] as const;

export const EXAMS = ["JEE Main", "JEE Advanced", "NEET"] as const;
export const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology"] as const;
export const CLASS_LEVELS = ["Class 11", "Class 12", "Dropper"] as const;
export const DIFFICULTIES = ["Easy", "Moderate", "Hard"] as const;
export const PAPER_TYPES = ["Full Length", "Chapter-wise", "Previous Year", "Part Test"] as const;
export const MODES = ["Online", "Offline", "Hybrid"] as const;
export const COUNSELLING_STATUSES = [
  "new",
  "contacted",
  "scheduled",
  "completed",
  "cancelled",
] as const;

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(original: number, current: number) {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}
