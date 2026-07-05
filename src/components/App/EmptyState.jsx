import { FiInbox } from 'react-icons/fi'

import { Button } from '../ui/Button'

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="glass-panel rounded-lg p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-300">
        <FiInbox className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
      {actionLabel && (
        <Button type="button" variant="accent" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
