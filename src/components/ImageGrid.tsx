'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

interface ImageType {
  id: string
  url: string
  title: string
  userId: string
  createdAt: string
}

export default function ImageGrid() {
  const { user } = useUser()
  const [images, setImages] = useState<ImageType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images')
        if (response.ok) {
          const data = await response.json()
          setImages(data)
        }
      } catch (error) {
        console.error('Failed to fetch images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No images found. Start by uploading one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={image.url}
            alt={image.title || 'Uploaded image'}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-sm font-medium truncate">{image.title || 'Untitled'}</p>
              {user?.id === image.userId && (
                <button className="mt-2 text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700">
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}