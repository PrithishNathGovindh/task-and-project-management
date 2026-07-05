import { useEffect, useState } from 'react'

import { projectCategories, projectColors, projectStatuses, projectTypes } from '../../data/appOptions'
import { formatEnum } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { Modal } from './Modal'

const initialForm = {
  name: '',
  description: '',
  type: 'SOLO',
  category: 'SOFTWARE',
  deadline: '',
  color: '#14b8a6',
  status: 'ACTIVE',
}

export function ProjectModal({ isOpen, onClose, onSubmit, project }) {
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        type: project.type || 'SOLO',
        category: project.category || 'SOFTWARE',
        deadline: project.deadline || '',
        color: project.color || '#14b8a6',
        status: project.status || 'ACTIVE',
      })
    } else {
      setFormData(initialForm)
    }
    setError('')
  }, [project, isOpen])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.name.trim()) {
      setError('Workspace name is required')
      return
    }

    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }

    if (!formData.deadline) {
      setError('Deadline is required')
      return
    }

    setIsSubmitting(true)
    const result = await onSubmit({
      ...formData,
      deadline: formData.deadline || null,
      progress: project?.progress || 0,
    })
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Workspace' : 'Create Workspace'}
      description="Plan solo work or team delivery inside a focused project space."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field label="Workspace Name">
          <input name="name" value={formData.name} onChange={handleChange} className={inputClassName} placeholder="Mobile app launch" required />
        </Field>
        <Field label="Description">
          <textarea name="description" value={formData.description} onChange={handleChange} className={inputClassName} rows="3" placeholder="What are you trying to ship?" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type">
            <select name="type" value={formData.type} onChange={handleChange} className={inputClassName}>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {formatEnum(type)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select name="category" value={formData.category} onChange={handleChange} className={inputClassName}>
              {projectCategories.map((category) => (
                <option key={category} value={category}>
                  {formatEnum(category)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Deadline">
            <input name="deadline" value={formData.deadline} onChange={handleChange} className={inputClassName} type="date" />
          </Field>
          <Field label="Status">
            <select name="status" value={formData.status} onChange={handleChange} className={inputClassName}>
              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatEnum(status)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Color">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {projectColors.map((color) => (
              <label
                key={color.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <input type="radio" name="color" value={color.value} checked={formData.color === color.value} onChange={handleChange} className="accent-teal-500" />
                <span className={`h-4 w-4 rounded-full ${color.className}`} />
                {color.label}
              </label>
            ))}
          </div>
        </Field>

        {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-teal-400 dark:border-white/10 dark:bg-white/5 dark:text-white'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
    </label>
  )
}
