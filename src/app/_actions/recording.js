"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { enregistrerNouveau } from "../_data/data_recording";
import { duelsTable } from "@/db/schemas";
import { desc, isNull } from "drizzle-orm";

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

