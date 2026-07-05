import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiBell, FiCheck, FiTrash2 } from 'react-icons/fi'

import { useToast } from '../../hooks/useToast'
import { getApiErrorMessage } from '../../services/api'
import { notificationService } from '../../services/notificationService'
import { formatDate } from '../../utils/formatters'
import { Button } from '../ui/Button'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const panelRef = useRef(null)
  const { showToast } = useToast()

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.isRead).length, [notifications])

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      setNotifications(await notificationService.getNotifications())
    } catch (error) {
      showToast({ type: 'error', title: 'Notifications Error', message: getApiErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    function handlePointerDown(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  async function handleMarkAsRead(id) {
    await notificationService.markAsRead(id)
    showToast({ type: 'success', title: 'Notification Read', message: 'Marked as read.' })
    loadNotifications()
  }

  async function handleMarkAllAsRead() {
    setNotifications(await notificationService.markAllAsRead())
    showToast({ type: 'success', title: 'Notification Read', message: 'All notifications marked as read.' })
  }

  async function handleDelete(id) {
    await notificationService.deleteNotification(id)
    setNotifications((current) => current.filter((notification) => notification.id !== id))
  }

  return (
    <div className="relative" ref={panelRef}>
      <Button type="button" variant="ghost" size="icon" onClick={() => setIsOpen((current) => !current)} aria-label="Notifications">
        <FiBell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="glass-panel absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-lg p-3 shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-3 dark:border-white/10">
            <p className="text-sm font-black text-slate-950 dark:text-white">Notifications</p>
            <button type="button" className="text-xs font-bold text-teal-600 dark:text-teal-300" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto py-2">
            {isLoading ? (
              <div className="space-y-2 p-2">
                <div className="h-14 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
                <div className="h-14 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
              </div>
            ) : notifications.length ? (
              notifications.map((notification) => (
                <article key={notification.id} className="rounded-lg p-3 transition hover:bg-slate-900/5 dark:hover:bg-white/10">
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${notification.isRead ? 'bg-slate-300 dark:bg-slate-600' : 'bg-teal-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-950 dark:text-white">{notification.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{notification.message}</p>
                      <p className="mt-1 text-[11px] font-semibold uppercase text-slate-400">{formatDate(notification.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {!notification.isRead && (
                        <button type="button" className="rounded-md p-1.5 text-teal-600 hover:bg-teal-500/10" onClick={() => handleMarkAsRead(notification.id)} aria-label="Mark as read">
                          <FiCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button type="button" className="rounded-md p-1.5 text-rose-500 hover:bg-rose-500/10" onClick={() => handleDelete(notification.id)} aria-label="Delete notification">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="py-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
