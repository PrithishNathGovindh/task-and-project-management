import { useCallback, useMemo, useState } from 'react'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'

import { ToastContext } from './toast'

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback(({ title, message, type = 'info' }) => {
    const id = crypto.randomUUID()

    setToasts((currentToasts) => [...currentToasts, { id, title, message, type }])
    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
    }, 4200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || FiInfo

          return (
            <div
              key={toast.id}
              className="glass-panel flex items-start gap-3 rounded-lg p-4 text-slate-950 dark:text-white"
              role="status"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{toast.title}</p>
                {toast.message && <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{toast.message}</p>}
              </div>
              <button
                type="button"
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-900/5 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <FiX className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
