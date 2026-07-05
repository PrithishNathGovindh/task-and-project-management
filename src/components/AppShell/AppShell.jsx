import { FiBarChart2, FiFolder, FiGrid, FiList, FiLogOut, FiSearch, FiUser } from 'react-icons/fi'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { ProjectProvider } from '../../context/ProjectContext'
import { TaskProvider } from '../../context/TaskContext'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { cn } from '../../utils/cn'
import { AiTaskGenerator } from '../App/AiTaskGenerator'
import { NotificationBell } from '../App/NotificationBell'
import { Button } from '../ui/Button'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: FiGrid },
  { label: 'Projects', to: '/projects', icon: FiFolder },
  { label: 'Tasks', to: '/tasks', icon: FiList },
  { label: 'Analytics', to: '/analytics', icon: FiBarChart2 },
  { label: 'Search', to: '/search', icon: FiSearch },
  { label: 'Profile', to: '/profile', icon: FiUser },
]

export function AppShell() {
  const { logout, user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    showToast({ type: 'info', title: 'Logged Out', message: 'You have been signed out successfully.' })
    navigate('/')
  }

  return (
    <ProjectProvider>
      <TaskProvider>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_32%),linear-gradient(135deg,_#07111f_0%,_#111827_100%)] dark:text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
            <aside className="glass-panel sticky top-4 z-20 h-fit rounded-lg p-4">
              <div className="flex items-center justify-between gap-3 lg:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                    TF
                  </span>
                  <div>
                    <p className="text-sm font-black">TaskFlow</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || 'USER'}</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={handleLogout} aria-label="Logout">
                  <FiLogOut className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              <nav className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1" aria-label="Application">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
                        isActive && 'bg-teal-500/10 text-teal-700 dark:text-teal-200',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <Button type="button" variant="outline" className="mt-5 hidden w-full lg:inline-flex" onClick={handleLogout}>
                <FiLogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            </aside>

            <main className="min-w-0 pb-10">
              <div className="mb-4 flex justify-end">
                <NotificationBell />
              </div>
              <Outlet />
              <AiTaskGenerator />
            </main>
          </div>
        </div>
      </TaskProvider>
    </ProjectProvider>
  )
}
