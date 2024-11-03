import { z } from 'zod'

const API_KEY = process.env.STABLE_DIFFUSION_API_KEY
const API_HOST = 'https://stablediffusionapi.com/api/v3/text2img'

export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  negative_prompt: z.string().optional(),
  width: z.number().min(512).max(1024).default(512),
  height: z.number().min(512).max(1024).default(512),
})

export type GenerateImageInput = z.infer<typeof generateImageSchema>

export async function generateImage(input: GenerateImageInput) {
  const response = await fetch(API_HOST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      key: API_KEY,
      prompt: input.prompt,
      negative_prompt: input.negative_prompt,
      width: input.width,
      height: input.height,
      samples: 1,
      num_inference_steps: 20,
      safety_checker: 'yes',
      enhance_prompt: 'yes',
      seed: null,
      guidance_scale: 7.5,
      webhook: null,
      track_id: null
    }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate image')
  }

  return data
}