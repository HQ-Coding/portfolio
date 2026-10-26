import { getDb } from "./mongodb";
import {
  certificateSchema,
  profileSchema,
  projectSchema,
  type Certificate,
  type Profile,
  type Project,
} from "./types";
import type { z } from "zod";

/**
 * Server-side data access for the public site.
 * Every function validates what MongoDB returns with Zod, so:
 *   - no unsafe type assertions,
 *   - unknown fields (including Mongo's ObjectId `_id`) are dropped,
 *   - the result is plain, serializable data that is safe to pass to client components.
 *
 * Do not import this file from a client component.
 */

const PROFILE_ID = "main";
const hideId = { projection: { _id: 0 } } as const;

function describeIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("; ");
}

function byOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

/**
 * Parse a list of raw documents. A malformed document is skipped and logged
 * on the server, so one bad entry cannot take the whole page down.
 */
function parseDocuments<S extends z.ZodType>(
  schema: S,
  docs: unknown[],
  collection: string,
): z.infer<S>[] {
  const valid: z.infer<S>[] = [];
  for (const doc of docs) {
    const result = schema.safeParse(doc);
    if (result.success) {
      valid.push(result.data);
    } else {
      const slug =
        typeof doc === "object" && doc !== null && "slug" in doc
          ? String(doc.slug)
          : "unknown";
      console.error(
        `[data] Skipped invalid document in "${collection}" (slug: ${slug}): ${describeIssues(result.error)}`,
      );
    }
  }
  return valid;
}

export async function getProfile(): Promise<Profile> {
  let raw: unknown;
  try {
    const db = await getDb();
    raw = await db
      .collection<{ _id: string }>("siteContent")
      .findOne({ _id: PROFILE_ID }, hideId);
  } catch (cause) {
    throw new Error("Failed to load the profile from MongoDB.", { cause });
  }

  if (!raw) {
    throw new Error(
      `Profile not found (collection "siteContent", _id "${PROFILE_ID}"). Run "npm run import:data".`,
    );
  }

  const result = profileSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Profile document has an unexpected shape: ${describeIssues(result.error)}`,
    );
  }

  const profile = result.data;
  return {
    ...profile,
    experienceSummary: byOrder(profile.experienceSummary),
    education: byOrder(profile.education),
    skills: byOrder(profile.skills),
  };
}

export async function getCertificates(): Promise<Certificate[]> {
  let docs: unknown[];
  try {
    const db = await getDb();
    docs = await db
      .collection("certificates")
      .find({ published: { $ne: false } }, hideId)
      .sort({ order: 1, slug: 1 })
      .toArray();
  } catch (cause) {
    throw new Error("Failed to load certificates from MongoDB.", { cause });
  }
  return parseDocuments(certificateSchema, docs, "certificates");
}

export async function getProjects(): Promise<Project[]> {
  let docs: unknown[];
  try {
    const db = await getDb();
    docs = await db
      .collection("projects")
      .find({ published: { $ne: false } }, hideId)
      .sort({ order: 1, slug: 1 })
      .toArray();
  } catch (cause) {
    throw new Error("Failed to load projects from MongoDB.", { cause });
  }
  return parseDocuments(projectSchema, docs, "projects");
}