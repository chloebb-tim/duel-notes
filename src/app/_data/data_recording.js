import "server-only";
import { db } from "@/db";
import { duelsTable, enregistrements, votes } from "@/db/schemas/schema";
import { user } from "@/db/schemas/auth-schema";
import { desc, eq, isNull, isNotNull, inArray } from "drizzle-orm";

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
  const duels = await db.query.duelsTable.findMany({
    where: isNull(duelsTable.chanteur2id),
    orderBy: desc(duelsTable.id),
    with: {
      premierChanteur: true,
    },
  });

  const duelsAvecNoms = await Promise.all(
    duels.map(async (duel) => {
      const user1 = duel.premierChanteur
        ? await db
            .select({ name: user.name })
            .from(user)
            .where(eq(user.id, duel.premierChanteur.userId))
            .limit(1)
        : [];

      return {
        ...duel,
        premierChanteur: duel.premierChanteur
          ? {
              ...duel.premierChanteur,
              userName: user1[0]?.name ?? duel.premierChanteur.userId ?? "Inconnu",
            }
          : null,
      };
    })
  );

  return duelsAvecNoms;
}

export async function getDuelscomplets() {
  const duels = await db.query.duelsTable.findMany({
    where: isNotNull(duelsTable.chanteur2id),
    orderBy: desc(duelsTable.id),
    with: {
      premierChanteur: true,
      deuxiemeChanteur: true,
    },
  });

  // récupérer les noms des users pour chaque enregistrement
  const duelsAvecNoms = await Promise.all(
    duels.map(async (duel) => {
      const user1 = duel.premierChanteur
        ? await db
            .select({ name: user.name })
            .from(user)
            .where(eq(user.id, duel.premierChanteur.userId))
            .limit(1)
        : [];
      const user2 = duel.deuxiemeChanteur
        ? await db
            .select({ name: user.name })
            .from(user)
            .where(eq(user.id, duel.deuxiemeChanteur.userId))
            .limit(1)
        : [];

      return {
        ...duel,
        premierChanteur: duel.premierChanteur
          ? {
              ...duel.premierChanteur,
              userName: user1[0]?.name ?? duel.premierChanteur.userId ?? "Inconnu",
            }
          : null,
        deuxiemeChanteur: duel.deuxiemeChanteur
          ? {
              ...duel.deuxiemeChanteur,
              userName: user2[0]?.name ?? duel.deuxiemeChanteur.userId ?? "Inconnu",
            }
          : null,
      };
    })
  );

  return duelsAvecNoms;
}

export async function getVotesDuUser(userId, duelIds) {
  if (!userId || duelIds.length === 0) return {};
  const rows = await db.select().from(votes)
    .where(inArray(votes.duelId, duelIds));
  const monVote = rows.filter(v => v.userId === userId);
  return Object.fromEntries(monVote.map(v => [v.duelId, v.enregistrementId]));
}