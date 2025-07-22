// Sidebar component (modern, responsive)
import React from 'react'
import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm z-40 p-6">
      <nav className="flex flex-col gap-6">
        <Link href="/dashboard" className="font-semibold text-primary">Dashboard</Link>
        <Link href="/projects" className="text-muted-foreground">Projects</Link>
        <Link href="/teams" className="text-muted-foreground">Teams</Link>
        <Link href="/settings" className="text-muted-foreground">Settings</Link>
      </nav>
    </aside>
  )
}
