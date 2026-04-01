import "server-only";
import { db } from "@/db";
import { duelsTable, enregistrements } from "@/db/schemas/schema";
import { desc, eq, isNull } from "drizzle-orm";

// export const enregistrerNouveau = async (songChoice, chanteur1id, duelId) => {
//   return db.insert(enregistrements).values({
//     songChoice,
//     chanteur1id,
//     duelId,
//   });
// };

export async function enregistrerNouveau({
  userId,
  songChoice,
  voiceUrl,
  voiceUploadthingKey,
  duelId,
}) {
  let linkedDuelId = duelId;
  let chansonDuel = songChoice;

  if (!linkedDuelId) {
    const [duel] = await db
      .insert(duelsTable)
      .values({ songChoice })
      .returning();

    linkedDuelId = duel.id;
  } else {
    const duelExistant = await db.query.duelsTable.findFirst({
      where: eq(duelsTable.id, linkedDuelId),
    });

    if (!duelExistant) throw new Error("Duel introuvable");
    if (duelExistant.chanteur2id) throw new Error("Duel déjà complet");

    chansonDuel = duelExistant.songChoice;
  }

  const [recording] = await db
    .insert(enregistrements)
    .values({
      userId,
      songChoice: chansonDuel,
      voiceUrl,
      voiceUploadthingKey: voiceUploadthingKey ?? null,
      duelId: linkedDuelId,
    })
    .returning();

  const duel = await db.query.duelsTable.findFirst({
    where: eq(duelsTable.id, linkedDuelId),
  });

  if (!duel?.chanteur1id) {
    await db
      .update(duelsTable)
      .set({ chanteur1id: recording.id })
      .where(eq(duelsTable.id, linkedDuelId));
  } else if (!duel?.chanteur2id) {
    await db
      .update(duelsTable)
      .set({ chanteur2id: recording.id })
      .where(eq(duelsTable.id, linkedDuelId));
  }

  return { recording, duelId: linkedDuelId };
}

export async function getDuelsIncomplets() {
  return db
    .select()
    .from(duelsTable)
    .where(isNull(duelsTable.chanteur2id))
    .orderBy(desc(duelsTable.id));
}