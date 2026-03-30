import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

let dialect = "sqlite";

if (process.env.NODE_ENV === "prod") {
  config({ path: ".env.prod" });
  dialect = "turso";
} else {
  config({ path: ".env.local" });
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas/*",
  dialect,
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
