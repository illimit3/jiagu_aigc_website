import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import AIGenerator from '@/components/AIGenerator'

export default async function GeneratePage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">AI Image Generation</h1>
      <AIGenerator />
    </div>
  )
}