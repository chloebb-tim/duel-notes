import "server-only";
import { db } from "@/db";
import { user } from "@/db/schemas";
import { eq } from "drizzle-orm";

export const getUserById = async (id) => {
  const results = await db.select().from(user).where(eq(user.id, id));
  return results[0];
};