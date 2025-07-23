import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SAIDIDSpace',
  description: 'Modern collaborative project management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
