
import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const filePath = path.join(process.cwd(), "portfolio-data.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

if (
  !data.profile ||
  !Array.isArray(data.certificates) ||
  !Array.isArray(data.projects)
) {
  throw new Error("Invalid portfolio-data.json structure");
}

const client = new MongoClient(uri);

async function main() {
  await client.connect();

  const db = client.db("portfolio");

  // Save the main profile as a single document.
  await db.collection("siteContent").updateOne(
    { _id: "main" },
    {
      $set: {
        ...data.profile,
        schemaVersion: data.schemaVersion ?? 1,
      },
    },
    { upsert: true }
  );

  // Insert or update certificates using their unique slugs.
  if (data.certificates.length > 0) {
    await db.collection("certificates").bulkWrite(
      data.certificates.map((certificate) => ({
        updateOne: {
          filter: { slug: certificate.slug },
          update: { $set: certificate },
          upsert: true,
        },
      }))
    );
  }

  // Insert or update projects using their unique slugs.
  if (data.projects.length > 0) {
    await db.collection("projects").bulkWrite(
      data.projects.map((project) => ({
        updateOne: {
          filter: { slug: project.slug },
          update: { $set: project },
          upsert: true,
        },
      }))
    );
  }

  console.log("Portfolio import completed.");
  console.log("Profile: 1 document processed");
  console.log(`Certificates: ${data.certificates.length} processed`);
  console.log(`Projects: ${data.projects.length} processed`);

  console.log(
    "Database:",
    db.databaseName
  );
}

main()
  .catch((error) => {
    console.error("Portfolio import failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.close();
  });
