import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();
  const doc = await client
    .db("portfolio")
    .collection("siteContent")
    .findOne({ _id: "main" });

  console.log("Experience in the database:");
  for (const item of doc.experienceSummary) {
    console.log(" -", item.duration, item.title);
  }
  console.log("About text starts with:", doc.aboutText.slice(0, 50));
} finally {
  await client.close();
}