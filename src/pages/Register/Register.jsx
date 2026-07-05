import { useState } from 'react'
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setError('')
  }

  function validateForm() {
    if (!formData.fullName.trim()) {
      return 'Name is required'
    }

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

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
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
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    })
    setIsSubmitting(false)

    if (!result.success) {
      const message = result.message || 'Registration failed'
      setError(message)
      showToast({ type: 'error', title: message === 'Email already exists' ? 'Email Already Exists' : 'Registration Failed', message })
      return
    }

    showToast({ type: 'success', title: 'Registration Successful', message: 'You can now log in to your workspace.' })
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-lg border border-white/60 bg-white/70 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/30 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="p-6 sm:p-10">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300">
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <div className="mx-auto max-w-md">
            <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">Register</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Create your workspace</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Start with a beautiful frontend-only account screen for the competition demo.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <AuthField icon={FiUser} label="Name" name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Alex Morgan" />
              <AuthField icon={FiMail} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" />
              <AuthField icon={FiLock} label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create password" />
              <AuthField
                icon={FiLock}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />

              {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">{error}</p>}

              <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
                {isSubmitting ? 'Creating account...' : 'Register'}
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600 dark:text-slate-300">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700 dark:text-teal-300">
                Login
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden bg-slate-950 p-10 text-white dark:bg-white/[0.04] lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-950">TF</span>
            <span className="text-lg font-black">TaskFlow</span>
          </div>
          <div>
            <p className="text-sm font-bold uppercase text-teal-300">Workspace setup</p>
            <h2 className="mt-5 text-5xl font-black leading-tight">Bring every task, doc, and deadline into focus.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Designed for competitive demos with real product polish and a clear path toward future dashboard sprints.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-5">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
              <span>Workspace readiness</span>
              <span>92%</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-white/10">
              <div className="h-3 w-[92%] rounded-full bg-teal-400" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function AuthField({ icon: Icon, label, name, type, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5">
        <Icon className="h-5 w-5" aria-hidden="true" />
        <input
          className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />
      </span>
    </label>
  )
}
