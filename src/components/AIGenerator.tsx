'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    try {
      setIsGenerating(true)
      setError(null)
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          width: 512,
          height: 512,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      if (data.output && data.output[0]) {
        setGeneratedImage(data.output[0])
      } else {
        throw new Error('No image generated')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-lg font-medium text-gray-900">
            Enter your prompt
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Describe the image you want to generate in detail
          </p>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="A serene landscape with mountains at sunset..."
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Image'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Generated Image</h2>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={generatedImage}
              alt="AI Generated"
              width={512}
              height={512}
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  )
}