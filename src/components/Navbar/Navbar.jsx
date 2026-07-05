import { useState } from 'react'
import { FiLogOut, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useToast } from '../../hooks/useToast'
import { Button } from '../ui/Button'

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Features', href: '/#features' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const ThemeIcon = theme === 'dark' ? FiSun : FiMoon

  function handleLogout() {
    logout()
    showToast({ type: 'info', title: 'Logged Out', message: 'You have been signed out successfully.' })
    navigate('/')
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10" aria-label="Primary">
        <Link to="/" className="flex items-center gap-3" aria-label="TaskFlow home">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">
            TF
          </span>
          <span className="text-lg font-black text-slate-950 dark:text-white">TaskFlow</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/70 p-1 shadow-sm dark:border-white/10 dark:bg-white/5 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            <ThemeIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
          {isAuthenticated ? (
            <Button type="button" variant="accent" onClick={handleLogout}>
              <FiLogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
          ) : (
            <Button asChild variant="accent">
              <NavLink to="/register">Get Started</NavLink>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            <ThemeIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" type="button" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle menu">
            {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 px-5 py-4 shadow-xl dark:border-white/10 dark:bg-slate-950/95 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}
            {isAuthenticated ? (
              <Button type="button" variant="accent" className="mt-2" onClick={handleLogout}>
                <FiLogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            ) : (
              <Button asChild variant="accent" className="mt-2">
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
