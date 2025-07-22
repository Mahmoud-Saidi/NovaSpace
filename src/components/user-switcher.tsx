"use client"

import { useState } from 'react'
import { simulateUser, getCurrentUser, DEMO_USERS, logout } from '@/lib/user-utils'

export function UserSwitcher() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const currentUser = getCurrentUser()

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border rounded-md hover:bg-gray-50"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-600 font-semibold text-sm">
            {currentUser.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium">{currentUser.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
          <div className="py-1">
            <div className="px-4 py-2 text-xs text-gray-500 font-medium">
              Changer d'utilisateur (Demo)
            </div>
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  simulateUser(user.id, user.name)
                  setShowUserMenu(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentUser.id === user.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
              >
                {user.name} {currentUser.id === user.id && '(Actuel)'}
              </button>
            ))}
            <hr className="my-1" />
            <button
              onClick={() => {
                logout()
                setShowUserMenu(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
