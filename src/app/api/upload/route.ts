import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { v2 as cloudinary } from 'cloudinary';
import { imageStore } from '@/lib/images';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'image-share',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Save to in-memory store
    const image = imageStore.add({
      id: Math.random().toString(36).substr(2, 9),
      url: result.secure_url,
      userId,
      title: file.name,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Upload failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}