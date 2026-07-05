import { FiCalendar, FiUsers } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { getColorClass, getProgressClass } from '../../data/appOptions'
import { cn } from '../../utils/cn'
import { formatDate, formatEnum } from '../../utils/formatters'

export function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-lg border border-slate-200/80 bg-white/75 p-5 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-slate-950/10 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-teal-400/60"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className={cn('mb-4 h-2 w-20 rounded-full', getColorClass(project.color))} />
          <h3 className="truncate text-xl font-black text-slate-950 dark:text-white">{project.workspaceName || project.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description || 'No description yet.'}</p>
        </div>
        <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-200">{formatEnum(project.status)}</span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span>{project.progress || 0}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-white/10">
          <div className={cn('h-2 rounded-full bg-teal-500', getProgressClass(project.progress))} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <FiCalendar className="h-4 w-4 text-teal-500" aria-hidden="true" />
          {formatDate(project.deadline)}
        </span>
        <span className="flex items-center gap-2">
          <FiUsers className="h-4 w-4 text-teal-500" aria-hidden="true" />
          {project.membersCount || 1} member{(project.membersCount || 1) === 1 ? '' : 's'}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{formatEnum(project.type)}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{formatEnum(project.category)}</span>
      </div>
    </Link>
  )
}
