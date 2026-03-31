import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const enregistrements = sqliteTable("enregistrements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),

  songChoice: text("song_choice").notNull(), // "chanson1" | "chanson2"

  voiceUrl: text("voice_url"),
  voiceUploadthingKey: text("voice_uploadthing_key"),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});