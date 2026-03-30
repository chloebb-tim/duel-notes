import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from './schemas';

export const db = drizzle({
    // logger: true,
    connection: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN
    },   
    schema
});