import { RegisterForm } from '@/components/register-form'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Home Button */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            ← Retour à l'accueil
          </Link>
        </div>
        
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez SAIDIDSpace dès aujourd'hui
          </p>
        </div>
        
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
