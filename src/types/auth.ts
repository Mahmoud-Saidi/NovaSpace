import { z } from 'zod'

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

// Schéma de validation pour la connexion
export const signInSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional()
})

// Types TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>
export type SignInFormData = z.infer<typeof signInSchema>

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  department?: string
  role: 'Member' | 'Admin' | 'Manager'
  status: 'active' | 'inactive'
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
