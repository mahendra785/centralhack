// app/api/upload/route.ts
import { projectClient } from '@/lib/bucket-client';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/(auth)/auth';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    });

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

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
    const timestamp = Date.now();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${timestamp}-${user.id}-${file.name}`;
    
    const url = await projectClient.uploadFile(buffer, fileName);

    if (!url || (url == "")) {
      return Response.json(
        { error: 'Upload failed' },
        { status: 500 }
      );
    }

    const image = await prisma.image.create({
      data: {
        imageUrl: url,
        userId: user.id,
        name: fileName
      }
    });
    
    return Response.json({
      status: 'success',
      image: image
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}