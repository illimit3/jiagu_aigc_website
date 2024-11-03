import { auth } from '@clerk/nextjs'
import ImageGrid from '@/components/ImageGrid'
import UploadButton from '@/components/UploadButton'

export default async function Home() {
  const { userId } = auth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <section className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900">Discover Images</h1>
            {userId && <UploadButton />}
          </section>
          <ImageGrid />
        </div>
      </div>
    </div>
  )
}