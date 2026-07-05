import { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'

import { EmptyState } from '../../components/App/EmptyState'
import { KanbanBoard } from '../../components/App/KanbanBoard'
import { LoadingState } from '../../components/App/LoadingState'
import { TaskDetailsModal } from '../../components/App/TaskDetailsModal'
import { TaskModal } from '../../components/App/TaskModal'
import { Button } from '../../components/ui/Button'
import { useProjects } from '../../hooks/useProjects'
import { useTasks } from '../../hooks/useTasks'
import { useToast } from '../../hooks/useToast'

export function Tasks() {
  const { projects, loadProjects } = useProjects()
  const { tasks, isLoadingTasks, loadTasks, createTask, updateTask, moveTask, deleteTask } = useTasks()
  const { showToast } = useToast()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function handleSubmit(payload) {
    const result = editingTask ? await updateTask(editingTask.id, payload) : await createTask(payload)
    if (result.success) {
      showToast({ type: 'success', title: editingTask ? 'Task Updated' : 'Task Created', message: editingTask ? 'Task details saved.' : 'Task added to your workspace.' })
      loadProjects()
      setEditingTask(null)
    }
    return result
  }

  async function handleDelete(task) {
    if (!window.confirm('Delete this task?')) {
      return
    }

    const result = await deleteTask(task.id)
    if (result.success) {
      showToast({ type: 'success', title: 'Task Deleted', message: 'Task removed from the workspace.' })
      loadProjects()
    }
  }

  async function handleMove(task, payload) {
    const result = await moveTask(task.id, payload)
    if (result.success) {
      showToast({ type: 'success', title: 'Task Moved Successfully', message: 'Task position saved.' })
      loadTasks()
      loadProjects()
    } else {
      showToast({ type: 'error', title: 'Move Failed', message: result.message })
    }
  }

  function openCreateModal() {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">Tasks</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">All Tasks</h1>
        </div>
        <Button type="button" variant="accent" onClick={openCreateModal} disabled={projects.length === 0}>
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          Create Task
        </Button>
      </section>

      {isLoadingTasks ? (
        <LoadingState rows={5} />
      ) : tasks.length ? (
        <KanbanBoard
          tasks={tasks}
          onMoveTask={handleMove}
          onOpenTask={setSelectedTask}
          onEditTask={(selectedTask) => {
                setEditingTask(selectedTask)
                setIsTaskModalOpen(true)
          }}
          onDeleteTask={handleDelete}
        />
      ) : (
        <EmptyState title="No tasks available." description={projects.length ? 'Create your first task.' : 'Create a project before adding tasks.'} actionLabel={projects.length ? 'Create Task' : ''} onAction={openCreateModal} />
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleSubmit}
        task={editingTask}
        projects={projects}
      />
      <TaskDetailsModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        showToast={showToast}
        onChanged={async () => {
          await loadTasks()
          await loadProjects()
        }}
      />
    </div>
  )
}
