import { NextResponse } from 'next/server';
import { imageStore } from '@/lib/images';

export async function GET() {
  try {
    const images = imageStore.getAll();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}