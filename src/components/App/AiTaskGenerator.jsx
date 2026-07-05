import { useState } from 'react'
import { FiCheckSquare, FiCpu, FiPlus, FiX } from 'react-icons/fi'

import { useProjects } from '../../hooks/useProjects'
import { useTasks } from '../../hooks/useTasks'
import { useToast } from '../../hooks/useToast'
import { aiTaskService } from '../../services/aiTaskService'
import { getApiErrorMessage } from '../../services/api'
import { Button } from '../ui/Button'
import { Modal } from './Modal'

export function AiTaskGenerator() {
  const { projects, loadProjects } = useProjects()
  const { createTask } = useTasks()
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [idea, setIdea] = useState('')
  const [projectId, setProjectId] = useState('')
  const [generatedTasks, setGeneratedTasks] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  async function handleGenerate(event) {
    event.preventDefault()
    if (!idea.trim()) {
      showToast({ type: 'error', title: 'Idea Required', message: 'Enter a project idea first.' })
      return
    }

    setIsGenerating(true)
    try {
      const tasks = await aiTaskService.generateTasks(idea)
      setGeneratedTasks(tasks)
      setSelectedTasks(tasks.map((task) => task.title))
      showToast({ type: 'success', title: 'Tasks Generated', message: 'Review the AI suggestions below.' })
    } catch (error) {
      showToast({ type: 'error', title: 'AI Generator Error', message: getApiErrorMessage(error) })
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCreateAll() {
    const targetProjectId = projectId || projects[0]?.id
    if (!targetProjectId) {
      showToast({ type: 'error', title: 'Project Required', message: 'Create a workspace before generating tasks.' })
      return
    }

    const tasksToCreate = generatedTasks.filter((task) => selectedTasks.includes(task.title))
    if (!tasksToCreate.length) {
      showToast({ type: 'error', title: 'No Tasks Selected', message: 'Select at least one generated task.' })
      return
    }

    setIsCreating(true)
    const results = await Promise.all(tasksToCreate.map((task, index) => createTask({
      projectId: targetProjectId,
      title: task.title,
      description: task.description,
      priority: task.priority || 'MEDIUM',
      status: 'TODO',
      deadline: null,
      orderIndex: index,
    })))
    setIsCreating(false)

    const failed = results.find((result) => !result.success)
    if (failed) {
      showToast({ type: 'error', title: 'Task Creation Failed', message: failed.message })
      return
    }

    await loadProjects()
    showToast({ type: 'success', title: 'Task Created', message: `${tasksToCreate.length} generated tasks were added.` })
    setIsOpen(false)
    setIdea('')
    setGeneratedTasks([])
    setSelectedTasks([])
  }

  function toggleTask(title) {
    setSelectedTasks((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title])
  }

  return (
    <>
      <button
        type="button"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-teal-500/30 transition hover:-translate-y-1 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI task generator"
      >
        <FiCpu className="h-6 w-6" aria-hidden="true" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="AI Task Generator" description="Turn a project idea into a ready task checklist.">
        <div className="grid gap-5">
          <form className="grid gap-4" onSubmit={handleGenerate}>
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              Project
              <select
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                value={projectId || projects[0]?.id || ''}
                onChange={(event) => setProjectId(event.target.value)}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              Project Idea
              <textarea
                className="min-h-28 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="Build an E-Commerce Website"
              />
            </label>
            <Button type="submit" variant="accent" disabled={isGenerating || projects.length === 0}>
              {isGenerating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <FiCpu className="h-4 w-4" />}
              Generate Tasks
            </Button>
          </form>

          {generatedTasks.length > 0 && (
            <section className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Suggested Tasks</h3>
                <button type="button" className="text-sm font-bold text-teal-600 dark:text-teal-300" onClick={() => setSelectedTasks(generatedTasks.map((task) => task.title))}>
                  Select All
                </button>
              </div>
              <div className="grid max-h-72 gap-2 overflow-y-auto pr-1">
                {generatedTasks.map((task) => {
                  const selected = selectedTasks.includes(task.title)
                  return (
                    <button
                      key={task.title}
                      type="button"
                      className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${selected ? 'border-teal-400 bg-teal-500/10' : 'border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5'}`}
                      onClick={() => toggleTask(task.title)}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-300 dark:border-white/20'}`}>
                          {selected && <FiCheckSquare className="h-3.5 w-3.5" />}
                        </span>
                        <span>
                          <span className="block text-sm font-black text-slate-950 dark:text-white">{task.title}</span>
                          <span className="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-300">{task.description}</span>
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setGeneratedTasks([])}>
                  <FiX className="h-4 w-4" />
                  Clear
                </Button>
                <Button type="button" variant="accent" onClick={handleCreateAll} disabled={isCreating}>
                  {isCreating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <FiPlus className="h-4 w-4" />}
                  Create All Tasks
                </Button>
              </div>
            </section>
          )}
        </div>
      </Modal>
    </>
  )
}
