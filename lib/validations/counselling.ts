import { z } from "zod";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export const counsellingSchema = z.object({
  student_name: z
    .string()
    .trim()
    .min(2, "Enter student or parent name")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email address is too long"),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((v) => /^[6-9]\d{9}$/.test(v), {
      message: "Enter a valid 10-digit Indian mobile number",
    }),
  class_target: z.string().min(1, "Select class / target"),
  preferred_mode: z.string().min(1, "Select preferred mode"),
  location: z
    .string()
    .trim()
    .min(2, "Enter your city")
    .max(80, "Location is too long"),
  preferred_time: z.string().optional().nullable(),
  request_type: z.enum(["counselling", "demo"]).default("counselling"),
  course_id: z.string().uuid().optional().nullable(),
});

export type CounsellingInput = z.infer<typeof counsellingSchema>;
