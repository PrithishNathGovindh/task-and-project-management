import { useEffect, useState } from 'react'

import { Button } from '../ui/Button'
import { Modal } from './Modal'

export function InviteMemberModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setError('')
    }
  }, [isOpen])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setIsSubmitting(true)
    const result = await onSubmit({ email })
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Member" description="Add an existing TaskFlow user to this team workspace.">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Member Email</span>
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-teal-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            placeholder="member@email.com"
            required
          />
        </label>

        {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
            Invite Member
          </Button>
        </div>
      </form>
    </Modal>
  )
}
