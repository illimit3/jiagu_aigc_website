import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { generateImage, generateImageSchema } from '@/lib/stable-diffusion'

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const input = generateImageSchema.parse(body)
    
    const result = await generateImage(input)
    
    return NextResponse.json(result)
  } catch (error: any) {
    return new NextResponse(error.message, { status: 400 })
  }
}