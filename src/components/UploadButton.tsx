'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return

      try {
        setIsUploading(true)
        const file = acceptedFiles[0]
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        // Refresh the page to show the new image
        window.location.reload()
      } catch (error) {
        console.error('Upload failed:', error)
        alert('Failed to upload image')
      } finally {
        setIsUploading(false)
      }
    }
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={isUploading}
      >
        {isUploading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        ) : (
          'Upload Image'
        )}
      </button>
    </div>
  )
}