import { FiCheckCircle, FiFolder, FiList, FiLogOut, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export function DashboardPlaceholder() {
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
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-300">
          <FiCheckCircle className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase text-teal-600 dark:text-teal-300">
          Welcome {user?.fullName || 'back'}
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Dashboard route ready</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Your workspace is ready for the next sprint surface, with project boards, tasks, and team insights planned as the next layer.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" size="lg">
            <Link to="/projects">
              <FiFolder className="h-5 w-5" aria-hidden="true" />
              Projects
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/tasks">
              <FiList className="h-5 w-5" aria-hidden="true" />
              Tasks
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/profile">
              <FiUser className="h-5 w-5" aria-hidden="true" />
              Profile
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
