import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function PublicOnlyRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuth()

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-teal-500" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
