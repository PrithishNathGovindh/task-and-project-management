import { useState } from 'react'
import { DndContext, KeyboardSensor, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiCalendar, FiEdit3, FiPaperclip, FiMessageCircle, FiSearch, FiTrash2, FiUser } from 'react-icons/fi'

import { taskPriorities, taskStatuses } from '../../data/appOptions'
import { cn } from '../../utils/cn'
import { formatDate, formatEnum } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { EmptyState } from './EmptyState'

const priorityClasses = {
  LOW: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  MEDIUM: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  HIGH: 'bg-red-500/10 text-red-700 dark:text-red-300',
}

const columnTitles = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
}

export function KanbanBoard({ tasks, members = [], onMoveTask, onEditTask, onDeleteTask, onOpenTask }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('')
  const [status, setStatus] = useState('')
  const [assigned, setAssigned] = useState('')

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter((task) => (priority ? task.priority === priority : true))
    .filter((task) => (status ? task.status === status : true))
    .filter((task) => (assigned ? (task.assignedUserId || task.assignedTo) === assigned : true))

  const tasksByStatus = taskStatuses.reduce((acc, item) => {
    acc[item] = filteredTasks
      .filter((task) => task.status === item)
      .sort((first, second) => (first.orderIndex || 0) - (second.orderIndex || 0))
    return acc
  }, {})

  async function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }

    const task = tasks.find((item) => item.id === active.id)
    if (!task) {
      return
    }

    const overTask = tasks.find((item) => item.id === over.id)
    const nextStatus = overTask?.status || over.id
    if (!taskStatuses.includes(nextStatus)) {
      return
    }

    const nextIndex = overTask ? tasksByStatus[nextStatus].findIndex((item) => item.id === overTask.id) : tasksByStatus[nextStatus].length
    await onMoveTask(task, { status: nextStatus, orderIndex: Math.max(0, nextIndex) })
  }

  if (!tasks.length) {
    return <EmptyState title="No tasks available." description="Create a task to start moving this workspace forward." />
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_160px_160px_190px]">
        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5">
          <FiSearch className="h-4 w-4" aria-hidden="true" />
          <input className="w-full bg-transparent text-slate-950 outline-none dark:text-white" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" />
        </label>
        <FilterSelect label="Priority" value={priority} onChange={setPriority} options={taskPriorities} />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={taskStatuses} />
        <FilterSelect
          label="Assigned"
          value={assigned}
          onChange={setAssigned}
          options={members.map((member) => ({ value: member.id, label: member.fullName }))}
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <section className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
          {taskStatuses.map((columnStatus) => (
            <KanbanColumn
              key={columnStatus}
              status={columnStatus}
              title={columnTitles[columnStatus]}
              tasks={tasksByStatus[columnStatus]}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onOpenTask={onOpenTask}
            />
          ))}
        </section>
      </DndContext>
    </div>
  )
}

function KanbanColumn({ status, title, tasks, onEditTask, onDeleteTask, onOpenTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div ref={setNodeRef} id={status} className={cn('glass-panel flex min-h-[28rem] flex-col rounded-lg p-3 transition', isOver && 'ring-2 ring-teal-400')}>
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-950 dark:text-white">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 overflow-y-auto">
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onOpenTask={onOpenTask} />
          ))}
          {!tasks.length && <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">Drop tasks here</div>}
        </div>
      </SortableContext>
    </div>
  )
}

function KanbanTaskCard({ task, onEditTask, onDeleteTask, onOpenTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'rounded-lg border border-slate-200/80 bg-white/85 p-4 shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/70',
        isDragging && 'opacity-70 ring-2 ring-teal-400',
      )}
    >
      <button type="button" className="block w-full text-left" onClick={() => onOpenTask(task)} {...attributes} {...listeners}>
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-black text-slate-950 dark:text-white">{task.title}</h4>
          <span className={cn('shrink-0 rounded-full px-2 py-1 text-[11px] font-bold', priorityClasses[task.priority] || priorityClasses.MEDIUM)}>{formatEnum(task.priority)}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{task.description || 'No description.'}</p>
        <div className="mt-4 grid gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-2"><FiCalendar className="h-3.5 w-3.5 text-teal-500" />{formatDate(task.deadline)}</span>
          <span className="flex items-center gap-2"><FiUser className="h-3.5 w-3.5 text-teal-500" />{task.assignedUserName || task.assignedTo || 'Unassigned'}</span>
        </div>
      </button>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><FiMessageCircle />{task.commentCount || 0}</span>
          <span className="flex items-center gap-1"><FiPaperclip />{task.attachmentCount || 0}</span>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={() => onEditTask(task)} aria-label="Edit task">
            <FiEdit3 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => onDeleteTask(task)} aria-label="Delete task">
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  const normalizedOptions = options.map((option) => (typeof option === 'string' ? { value: option, label: formatEnum(option) } : option))

  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" aria-label={label}>
      <option value="">{label}</option>
      {normalizedOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
