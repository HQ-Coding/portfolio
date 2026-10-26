import { z } from "zod";

/**
 * Shape of the documents in MongoDB (database "portfolio").
 * Verified against portfolio-data.json (schemaVersion 1).
 *
 * The schemas validate data coming out of the database, and the types
 * are inferred from them, so the two can never drift apart. They are also
 * reusable later for validating admin-panel input.
 *
 * Client components should use `import type { ... } from "@/lib/types"`.
 */

// ---------- Profile (collection "siteContent", _id: "main") ---------

export const profileSchema = z.object({
  siteName: z.string(),
  fullName: z.string(),
  heroGreeting: z.string(),
  heroTitle: z.string(),
  aboutText: z.string(),
  email: z.string(),
  cvUrl: z.string(),
  social: z.object({
    github: z.string(),
    linkedin: z.string().nullable(), // currently null
  }),
  experienceSummary: z.array(
    z.object({
      title: z.string(),
      duration: z.string().nullable(), // null for "Canva Pro and Designer"
      order: z.number(),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      order: z.number(),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.string(),
      percent: z.number(),
      order: z.number(),
    }),
  ),
  softSkills: z.array(z.string()),
});

export type Profile = z.infer<typeof profileSchema>;

// ---------- Certificates (collection "certificates") ----------

export const certificateSchema = z.object({
  slug: z.string(),
  name: z.string(),
  issuer: z.string(),
  link: z.string(),
  iconPath: z.string(), // only the "d" value of an SVG <path>
  color: z.string(), // hex color
  order: z.number(),
  published: z.boolean(),
});

export type Certificate = z.infer<typeof certificateSchema>;

// ---------- Projects (collection "projects") ----------

export const projectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  webLink: z.string(),
  githubLink: z.string(),
  tags: z.array(z.string()),
  badge: z.string().nullable(), // e.g. "1st 🥇"
  note: z.string().nullable(), // e.g. "Not responsive yet"
  description: z.string(), // currently "" for every project
  order: z.number(),
  published: z.boolean(),
});

export type Project = z.infer<typeof projectSchema>;
