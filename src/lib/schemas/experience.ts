import { reference, z } from "astro:content";

const month = z.string().regex(/^[1-9]\d{3}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");

export const ExperienceCollectionSchema = z
  .object({
    id: z.string().min(1),
    order: z.number().int().nonnegative().default(100),
    visible: z.boolean().default(true),
    company: z.string().trim().min(1),
    role: z.string().trim().min(1),
    description: z.string().trim().min(1),
    start_date: month,
    end_date: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      month.optional(),
    ),
    work_mode: z.string().trim().default(""),
    techs: z.array(reference("tech")).default([]),
  })
  .refine((entry) => !entry.end_date || entry.end_date >= entry.start_date, {
    message: "End month must not precede start month",
    path: ["end_date"],
  });
