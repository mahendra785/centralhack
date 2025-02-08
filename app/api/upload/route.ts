// app/api/upload/route.ts
import { projectClient } from '@/lib/bucket-client';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type if needed
    // const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    // if (!validTypes.includes(file.type)) {
    //   return Response.json(
    //     { error: 'Invalid file type' },
    //     { status: 400 }
    //   );
    // }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    
    const url = await projectClient.uploadFile(buffer, fileName);

    return Response.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}