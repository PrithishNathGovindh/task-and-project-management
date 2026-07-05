import { FiCalendar, FiEdit3, FiTrash2, FiUser } from 'react-icons/fi'

import { formatDate, formatEnum } from '../../utils/formatters'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

const priorityClasses = {
  LOW: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  MEDIUM: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  HIGH: 'bg-red-500/10 text-red-700 dark:text-red-300',
}

export function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="rounded-lg border border-slate-200/80 bg-white/75 p-5 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/[0.06]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-slate-950 dark:text-white">{task.title}</h3>
            <span className={cn('rounded-full px-3 py-1 text-xs font-bold', priorityClasses[task.priority] || priorityClasses.MEDIUM)}>
              {formatEnum(task.priority)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{task.description || 'No description.'}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
            <FiEdit3 className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={() => onDelete(task)} aria-label="Delete task">
            <FiTrash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{formatEnum(task.status)}</span>
        <span className="flex items-center gap-2">
          <FiCalendar className="h-4 w-4 text-teal-500" aria-hidden="true" />
          {formatDate(task.deadline)}
        </span>
        <span className="flex items-center gap-2">
          <FiUser className="h-4 w-4 text-teal-500" aria-hidden="true" />
          {task.assignedTo || 'Unassigned'}
        </span>
        <span className="truncate text-slate-500 dark:text-slate-400">{task.projectName || 'Project'}</span>
      </div>
    </article>
  )
}
