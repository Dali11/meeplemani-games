import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read .env.local by itself
config({ path: ".env.local" });

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: { url: process.env.DATABASE_URL! },
});