import Link from 'next/link'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'

export default function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            ImageShare
          </Link>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/generate" className="text-gray-700 hover:text-gray-900">
                  Generate
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}