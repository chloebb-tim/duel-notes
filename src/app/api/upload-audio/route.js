import { UTApi } from 'uploadthing/server';
import { getSession } from '@/lib/auth';

const utapi = new UTApi();

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('files');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await utapi.uploadFiles(
      new File([buffer], file.name, { type: file.type }),
      { metadata: { userId: session.user.id } }
    );

    if (response.error) {
      return Response.json({ error: response.error.message }, { status: 400 });
    }

    return Response.json([
      {
        name: response.data.name,
        size: response.data.size,
        key: response.data.key,
        url: response.data.url,
        uploadedBy: session.user.id,
      },
    ]);
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
