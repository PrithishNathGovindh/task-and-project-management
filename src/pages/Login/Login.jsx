import { useEffect, useState } from 'react'
import { FiArrowLeft, FiChrome, FiLock, FiMail } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, sessionMessage, consumeSessionMessage } = useAuth()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (sessionMessage) {
      showToast({ type: 'error', title: sessionMessage, message: 'Please log in again to continue.' })
      consumeSessionMessage()
    }
  }, [consumeSessionMessage, sessionMessage, showToast])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setError('')
  }

  function validateForm() {
    if (!formData.email.trim()) {
      return 'Email is required'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Enter a valid email address'
    }

    if (!formData.password) {
      return 'Password is required'
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationMessage = validateForm()

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setIsSubmitting(true)
    const result = await login({
      email: formData.email,
      password: formData.password,
    })
    setIsSubmitting(false)

    if (!result.success) {
      const message = result.message || 'Invalid Credentials'
      setError(message)
      showToast({ type: 'error', title: 'Invalid Credentials', message })
      return
    }

    showToast({ type: 'success', title: 'Login Successful', message: 'Welcome back to TaskFlow.' })
    navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-lg border border-white/60 bg-white/70 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/30 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="hidden bg-slate-950 p-10 text-white dark:bg-white/[0.04] lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-slate-300 transition hover:text-white">
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <div>
            <p className="text-sm font-bold uppercase text-teal-300">Welcome back</p>
            <h1 className="mt-5 text-5xl font-black leading-tight">Pick up where your best work paused.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Review sprint movement, clear blockers, and keep your project rooms organized from one polished workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Plan', 'Track', 'Ship'].map((item) => (
              <div key={item} className="rounded-lg bg-white/10 p-4 text-sm font-bold text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300 lg:hidden">
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <div className="mx-auto max-w-md">
            <div>
              <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">Login</p>
              <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Access your workspace</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Return to your project rhythm with a focused, calm workspace.</p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <FiMail className="h-5 w-5" aria-hidden="true" />
                  <input
                    className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <FiLock className="h-5 w-5" aria-hidden="true" />
                  <input
                    className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </span>
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-teal-500" />
                  Remember Me
                </label>
                <a href="/login" className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300">
                  Forgot Password
                </a>
              </div>

              {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">{error}</p>}

              <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              <span className="text-xs font-bold uppercase text-slate-400">OR</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            <Button type="button" variant="outline" size="lg" className="w-full">
              <FiChrome className="h-5 w-5" aria-hidden="true" />
              Continue with Google
            </Button>

            <p className="mt-7 text-center text-sm text-slate-600 dark:text-slate-300">
              New to TaskFlow?{' '}
              <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700 dark:text-teal-300">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
