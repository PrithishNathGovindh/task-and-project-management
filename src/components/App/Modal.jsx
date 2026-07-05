import { FiX } from 'react-icons/fi'

export function Modal({ title, description, isOpen, onClose, children }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <div className="glass-panel max-h-[92vh] w-full max-w-2xl animate-[fadeIn_0.18s_ease-out] overflow-y-auto rounded-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>}
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-900/5 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
