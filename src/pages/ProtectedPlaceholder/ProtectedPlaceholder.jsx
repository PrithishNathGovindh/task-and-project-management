import { FiArrowLeft, FiLogOut } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export function ProtectedPlaceholder({ title, description }) {
  const { logout, user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    showToast({ type: 'info', title: 'Logged Out', message: 'You have been signed out successfully.' })
    navigate('/')
  }

  return (
    <section className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5 py-10 text-center sm:px-8">
      <div className="glass-panel rounded-lg p-8 sm:p-12">
        <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">{user?.fullName || 'TaskFlow'}</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950 dark:text-white">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard">
              <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
              Dashboard
            </Link>
          </Button>
          <Button type="button" variant="accent" size="lg" onClick={handleLogout}>
            <FiLogOut className="h-5 w-5" aria-hidden="true" />
            Logout
          </Button>
        </div>
      </div>
    </section>
  )
}
