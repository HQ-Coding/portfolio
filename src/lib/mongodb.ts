import { MongoClient, type Db } from "mongodb";

/**
 * Shared MongoDB connection (server-side only).
 *
 * Exports (all point at the same single client):
 *   - default export `clientPromise`  -> backward compatible with existing imports
 *   - named export `clientPromise`
 *   - `getDb()`                       -> the "portfolio" database (or MONGODB_DB)
 *
 * Never import this file from a client component.
 */

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing. Add it to .env.local (and to your hosting provider's environment variables).",
  );
}

const mongoUri: string = uri;

export const DB_NAME = process.env.MONGODB_DB ?? "portfolio";

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};
const globalForMongo = globalThis as GlobalWithMongo;

function connect(): Promise<MongoClient> {
  const promise = new MongoClient(mongoUri).connect();

  // If the first connection attempt fails, forget it so the next
  // request/reload can try again instead of reusing a rejected promise.
  promise.catch(() => {
    if (globalForMongo._mongoClientPromise === promise) {
      globalForMongo._mongoClientPromise = undefined;
    }
  });

  return promise;
}

// In development, Next.js reloads modules on every edit. Keeping the promise on
// `globalThis` prevents opening a new connection after each reload.
export const clientPromise: Promise<MongoClient> =
  process.env.NODE_ENV === "development"
    ? (globalForMongo._mongoClientPromise ??= connect())
    : connect();

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export default clientPromise;