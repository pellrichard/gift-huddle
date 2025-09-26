// lib/validators/profile.ts
import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(1).max(120),
  email: z.string().email(),
  dob: z.string().nullable(), // ISO date or null
  hide_birth_year: z.boolean().default(true),
  interests: z.array(z.string()).default([]),
  preferred_shops: z.array(z.string()).default([]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
