import { NextResponse } from 'next/server';
import { db } from '@/db';
import { enregistrements } from '@/db/schemas/schema';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { songChoice, voiceUrl, voiceUploadthingKey } = await request.json();

    if (!songChoice || !voiceUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newRecording] = await db
      .insert(enregistrements)
      .values({
        userId: session.user.id,
        songChoice: songChoice,
        voiceUrl: voiceUrl,
        voiceUploadthingKey: voiceUploadthingKey || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      recording: newRecording
    });

  } catch (error) {
    console.error('Error saving recording:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}