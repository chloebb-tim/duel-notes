import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { duelsTable, enregistrements } from "@/db/schemas/schema";
import { auth } from "@/lib/auth"; 
import { enregistrerNouveau } from "@/app/_data/data_recording";


export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { songChoice, voiceUrl, voiceUploadthingKey, duelId } = await request.json();

    const result = await enregistrerNouveau({
      userId: session.user.id,
      songChoice,
      voiceUrl,
      voiceUploadthingKey,
      duelId,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error) {
    console.error("POST /api/recordings error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

// export async function POST(request) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });


//     const { songChoice, voiceUrl, voiceUploadthingKey, duelId } =
//       await request.json();

//     const [newRecording] = await db
//       .insert(enregistrements)
//       .values({
//         userId: session.user.id,
//         songChoice,
//         voiceUrl,
//         voiceUploadthingKey: voiceUploadthingKey ?? null,
//         duelId: duelId ?? null,
//       })
//       .returning();

//     return NextResponse.json({ success: true, recording: newRecording });
//   } catch (error) {
//     console.error("Error saving recording:", error);
//     return NextResponse.json(
//       { error: error?.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const duelId = Number(searchParams.get("duelId"));

    if (Number.isNaN(duelId) || duelId <= 0) {
      return NextResponse.json({ error: "duelId invalide" }, { status: 400 });
    }

    const duel = await db.query.duelsTable.findFirst({
      where: eq(duelsTable.id, duelId),
    });

    if (!duel) {
      return NextResponse.json({ error: "Duel introuvable" }, { status: 404 });
    }

    return NextResponse.json({ duel });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

