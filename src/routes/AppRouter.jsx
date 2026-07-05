import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from '../context/AuthContext'
import { ConfettiProvider } from '../context/ConfettiContext'
import { ThemeProvider } from '../context/ThemeContext'
import { ToastProvider } from '../context/ToastContext'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { AppShell } from '../components/AppShell/AppShell'
import { AuthLayout } from '../layouts/AuthLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { Analytics } from '../pages/Analytics/Analytics'
import { LandingPage } from '../pages/LandingPage/LandingPage'
import { Login } from '../pages/Login/Login'
import { NotFound } from '../pages/NotFound/NotFound'
import { Profile } from '../pages/Profile/Profile'
import { ProjectDetails } from '../pages/ProjectDetails/ProjectDetails'
import { Projects } from '../pages/Projects/Projects'
import { Register } from '../pages/Register/Register'
import { Search } from '../pages/Search/Search'
import { Tasks } from '../pages/Tasks/Tasks'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

function RouterContent() {
  useScrollToTop()

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}

export function AppRouter() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ConfettiProvider>
          <BrowserRouter>
            <AuthProvider>
              <RouterContent />
            </AuthProvider>
          </BrowserRouter>
        </ConfettiProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
