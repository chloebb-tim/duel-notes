import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { headers } from "next/headers";
import * as schema from '../db/schemas';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
});

export const getSession = async () => {
  return auth.api.getSession({
    headers: await headers(), 
  });
};
