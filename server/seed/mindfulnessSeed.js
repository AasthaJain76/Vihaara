import mongoose from "mongoose";
import dotenv from "dotenv";
import MindfulnessActivity from "../models/MindfulnessActivity.js";

dotenv.config();

const seedData = [
  // Mind Relaxing Songs
  {
    title: "Samay Samjhayega",
    category: "mind relaxing",
    duration: 20,
    resourceUrl: "https://www.youtube.com/watch?v=6ZwwapPikyQ&list=RD6ZwwapPikyQ&start_radio=1",
    description: "Calming and relaxing meditation music."
  },
  {
    title: "Deep Meditation Music for Positive Energy",
    category: "mind relaxing",
    duration: 15,
    resourceUrl: "https://www.youtube.com/watch?v=F-6qLrgbjKo",
    description: "Relax mind and body with positive energy music."
  },
  {
    title: "Tum Prem Ho",
    category: "mind relaxing",
    duration: 10,
    resourceUrl: "https://www.youtube.com/watch?v=Feoea8FQTI0&list=RDFeoea8FQTI0&start_radio=1",
    description: "Soothing romantic meditation song."
  },
  {
    title: "Krishna Flute Meditation",
    category: "mind relaxing",
    duration: 20,
    resourceUrl: "https://www.youtube.com/watch?v=64zZr3ZUDM0&list=RD64zZr3ZUDM0&start_radio=1&t=460s",
    description: "Most peaceful flute meditation for spiritual calmness."
  },

  // Motivational Songs
  {
    title: "Besabriyaan",
    category: "motivational",
    duration: 5,
    resourceUrl: "https://www.youtube.com/watch?v=D_ZjDLOHGRQ",
    description: "Motivational song to inspire and energize."
  },
  {
    title: "Aashayein",
    category: "motivational",
    duration: 6,
    resourceUrl: "https://www.youtube.com/watch?v=bmyv0nRkDmc&list=TLPQMDExMjIwMjW3IPvfaVT32A&index=2",
    description: "Hopeful and encouraging motivational song."
  },

  // Feeling Low Songs
  {
    title: "Bhagwan Hai Kahan",
    category: "feeling low",
    duration: 8,
    resourceUrl: "https://www.youtube.com/watch?v=HHsa_p43w00&list=RDHHsa_p43w00&start_radio=1",
    description: "Soulful song for times of emotional low."
  },
  {
    title: "Cold Hours",
    category: "feeling low",
    duration: 7,
    resourceUrl: "https://www.youtube.com/watch?v=x0_4Xgpxw7Q&list=RDx0_4Xgpxw7Q&start_radio=1",
    description: "Calming song to soothe emotional stress."
  },
];

async function seedMindfulness() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await MindfulnessActivity.deleteMany({});
    console.log("🗑️ Old data cleared");

    await MindfulnessActivity.insertMany(seedData);
    console.log("🌱 Seed data inserted");

    process.exit();
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
}

seedMindfulness();
