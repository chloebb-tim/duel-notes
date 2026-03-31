import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "@/db";
import { enregistrements } from "@/db/schemas/schema";
import { getSession } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  audioUploader: f({
    audio: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Récupérer l'utilisateur authentifié
      const session = await getSession();

      if (!session || !session.user) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      return {
        uploadedBy: metadata.userId,
        url: file.url,
        key: file.key,
      };
    }),
};
