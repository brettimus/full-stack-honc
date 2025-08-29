import { config } from "dotenv";
import { drizzle } from "drizzle-orm/d1";
import { seed } from "drizzle-seed";
import * as schema from "./src/db/schema";

// Load environment variables
config({ path: process.env.ENVIRONMENT === "production" ? "./.prod.vars" : "./.dev.vars" });

/**
 * Seed the database with sample data
 */
const main = async () => {
  console.log("🌱 Seeding database...");

  try {
    // Create a mock D1 database instance for seeding
    // In production, this would use the actual D1 binding
    const mockDB = {} as D1Database;
    const db = drizzle(mockDB, {
      casing: "snake_case",
    });

    await seed(db, schema).refine((f) => ({
      users: {
        count: 10,
        columns: {
          name: f.firstName(),
          email: f.email(),
        },
      },
    }));

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

main();