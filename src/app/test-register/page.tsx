"use client"

import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            ← Retour à l'accueil
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Test Register Page</h1>
          <p>Cette page fonctionne-t-elle ?</p>
        </div>
      </div>
    </div>
  )
}
