"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { enregistrerNouveau } from "../_data/data_recording";
import { duelsTable, enregistrements, votes } from "@/db/schemas";
import { desc, isNull, eq, and, sql } from "drizzle-orm";
import { db } from "@/db";

export const enregistrerNouveauAction = async (formData) => {
    const session = await getSession();
  
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié" };
  }

  const content = formData.get("content");
const duelId = uuid();

  if (!content || !duelId) {
    return { success: false, error: "Données manquantes" };
  }

  try {
    await enregistrerNouveau(content, session.user.id, duelId);
    revalidatePath(`/record`);
    return { success: true };
  } catch (err) {
    console.error("Erreur ajout commentaire:", err);
    return { success: false, error: "Erreur lors de l'ajout du commentaire" };
  }
};

export const voterAction = async (enregistrementId, duelId) => {
    const session = await getSession();

    if (!session?.user?.id) {
        return { success: false, error: "Non authentifié" };
    }

    const userId = session.user.id;

    const voteExistant = await db.select().from(votes)
        .where(and(eq(votes.userId, userId), eq(votes.duelId, duelId)))
        .limit(1);

    if (voteExistant.length > 0) {
        const ancienVote = voteExistant[0];
        if (ancienVote.enregistrementId === enregistrementId) {
            return { success: false, error: "Tu as déjà voté pour celui-ci" };
        }
        await db.update(votes)
            .set({ enregistrementId })
            .where(eq(votes.id, ancienVote.id));
        await db.update(enregistrements)
            .set({ nbLikes: sql`${enregistrements.nbLikes} - 1` })
            .where(eq(enregistrements.id, ancienVote.enregistrementId));
        await db.update(enregistrements)
            .set({ nbLikes: sql`${enregistrements.nbLikes} + 1` })
            .where(eq(enregistrements.id, enregistrementId));
        revalidatePath("/voter");
        return { success: true, changed: true };
    }

    await db.insert(votes).values({ userId, duelId, enregistrementId });
    await db.update(enregistrements)
        .set({ nbLikes: sql`${enregistrements.nbLikes} + 1` })
        .where(eq(enregistrements.id, enregistrementId));

    revalidatePath("/palmares");
    revalidatePath("/voter");
    return { success: true };
};

