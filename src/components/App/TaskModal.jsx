import { useEffect, useState } from 'react'

import { taskPriorities, taskStatuses } from '../../data/appOptions'
import { formatEnum } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { Modal } from './Modal'

const initialForm = {
  projectId: '',
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'TODO',
  deadline: '',
  assignedTo: '',
  assignedUserId: '',
  assignedUserName: '',
}

export function TaskModal({ isOpen, onClose, onSubmit, task, projects, defaultProjectId, members = [] }) {
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        projectId: task.projectId || defaultProjectId || '',
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'TODO',
        deadline: task.deadline || '',
        assignedTo: task.assignedTo || '',
        assignedUserId: task.assignedUserId || '',
        assignedUserName: task.assignedUserName || task.assignedTo || '',
      })
    } else {
      setFormData({ ...initialForm, projectId: defaultProjectId || projects[0]?.id || '' })
    }
    setError('')
  }, [defaultProjectId, isOpen, projects, task])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => {
      if (name === 'assignedUserId') {
        const member = members.find((item) => item.id === value)
        return {
          ...currentData,
          assignedUserId: value,
          assignedUserName: member?.fullName || '',
          assignedTo: member?.fullName || '',
        }
      }

      return { ...currentData, [name]: value }
    })
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.projectId) {
      setError('Select a project first')
      return
    }

    if (!formData.title.trim()) {
      setError('Task name is required')
      return
    }

    setIsSubmitting(true)
    const payload = {
      ...formData,
      deadline: formData.deadline || null,
    }
    const result = await onSubmit(payload)
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create Task'} description="Keep task scope, owner, status, and deadline clear.">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field label="Project">
          <select name="projectId" value={formData.projectId} onChange={handleChange} className={inputClassName} disabled={Boolean(defaultProjectId)}>
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Task Name">
          <input name="title" value={formData.title} onChange={handleChange} className={inputClassName} placeholder="Write acceptance criteria" required />
        </Field>
        <Field label="Description">
          <textarea name="description" value={formData.description} onChange={handleChange} className={inputClassName} rows="3" placeholder="What needs to be done?" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Priority">
            <select name="priority" value={formData.priority} onChange={handleChange} className={inputClassName}>
              {taskPriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {formatEnum(priority)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select name="status" value={formData.status} onChange={handleChange} className={inputClassName}>
              {taskStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatEnum(status)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Deadline">
            <input name="deadline" value={formData.deadline} onChange={handleChange} className={inputClassName} type="date" />
          </Field>
          <Field label="Assign User">
            {members.length ? (
              <select name="assignedUserId" value={formData.assignedUserId} onChange={handleChange} className={inputClassName}>
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            ) : (
              <input name="assignedTo" value={formData.assignedTo} onChange={handleChange} className={inputClassName} placeholder="Name or email" />
            )}
          </Field>
        </div>

        {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-teal-400 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-white/5 dark:text-white'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
    </label>
  )
}
