import { sqliteTable, integer, text, unique } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const duelsTable = sqliteTable("duels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  songChoice: text("song_choice"),

  chanteur1id: integer("chanteur_1_id"),
  chanteur2id: integer("chanteur_2_id"),
});

export const enregistrements = sqliteTable("enregistrements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),

  songChoice: text("song_choice").notNull(),
  duelId: integer("duel_id"),

  voiceUrl: text("voice_url"),
  voiceUploadthingKey: text("voice_uploadthing_key"),

  nbLikes: integer("nb_likes").default(0).notNull(),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});

export const duelsRelations = relations(duelsTable, ({ many, one }) => ({
  recordings: many(enregistrements),

  premierChanteur: one(enregistrements, {
    fields: [duelsTable.chanteur1id],
    references: [enregistrements.id],
    relationName: "premierChanteur",
  }),

  deuxiemeChanteur: one(enregistrements, {
    fields: [duelsTable.chanteur2id],
    references: [enregistrements.id],
    relationName: "deuxiemeChanteur",
  }),
}));

export const enregistrementsRelations = relations(enregistrements, ({ one }) => ({
  duel: one(duelsTable, {
    fields: [enregistrements.duelId],
    references: [duelsTable.id],
  }),

}));

export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  duelId: integer("duel_id").notNull(),
  enregistrementId: integer("enregistrement_id").notNull(),
}, (table) => [
  unique().on(table.userId, table.duelId),
]);