import { z } from "zod";

export const samplePaperSchema = z.object({
  title: z.string().min(4, "Enter a paper title"),
  exam: z.string().min(1, "Select exam"),
  subject: z.string().min(1, "Select subject"),
  class_level: z.string().min(1, "Select class"),
  year: z.coerce.number().int().min(2018).max(2035),
  difficulty: z.string().min(1, "Select difficulty"),
  paper_type: z.string().min(1, "Select paper type"),
  question_count: z.coerce.number().int().min(1).max(300),
  duration_minutes: z.coerce.number().int().min(15).max(480),
  description: z.string().max(2000).optional(),
  is_published: z.boolean().default(false),
});

export const paperFilterSchema = z.object({
  q: z.string().optional(),
  exam: z.string().optional(),
  subject: z.string().optional(),
  class_level: z.string().optional(),
  year: z.string().optional(),
  difficulty: z.string().optional(),
  paper_type: z.string().optional(),
});
