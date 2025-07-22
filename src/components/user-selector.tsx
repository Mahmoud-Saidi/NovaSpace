"use client"

import { useState, useEffect } from 'react'
import { User, searchUsers, getUsersFromDatabase } from '@/lib/users'

interface UserSelectorProps {
  onUserSelect: (user: User) => void
  excludeUserIds?: string[]
  placeholder?: string
  className?: string
}

export default function UserSelector({ 
  onUserSelect, 
  excludeUserIds = [], 
  placeholder = "Rechercher un utilisateur...",
  className = ""
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    if (searchQuery.length > 0) {
      const users = searchUsers(searchQuery).filter(user => 
        !excludeUserIds.includes(user.id) && user.status === 'active'
      )
      setFilteredUsers(users)
    } else {
      const allUsers = getUsersFromDatabase().filter(user => 
        !excludeUserIds.includes(user.id) && user.status === 'active'
      )
      setFilteredUsers(allUsers.slice(0, 10)) // Limiter à 10 résultats
    }
  }, [searchQuery, excludeUserIds])

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setSearchQuery(`${user.firstName} ${user.lastName}`)
    setIsOpen(false)
    onUserSelect(user)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setIsOpen(true)
    
    if (!query) {
      setSelectedUser(null)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleInputBlur = () => {
    // Délai pour permettre le clic sur une option
    setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      
      {isOpen && filteredUsers.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {user.email} • {user.department}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {user.role}
              </div>
            </div>
          ))}
          
          {searchQuery && filteredUsers.length === 0 && (
            <div className="px-4 py-3 text-center text-gray-500">
              Aucun utilisateur trouvé pour "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
