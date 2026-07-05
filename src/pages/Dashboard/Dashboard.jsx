import { useCallback, useEffect, useState } from 'react'
import { FiCheckCircle, FiClock, FiFolder, FiPlus, FiTarget } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { EmptyState } from '../../components/App/EmptyState'
import { LoadingState } from '../../components/App/LoadingState'
import { ProjectCard } from '../../components/App/ProjectCard'
import { ProjectModal } from '../../components/App/ProjectModal'
import { StatCard } from '../../components/App/StatCard'
import { TaskCard } from '../../components/App/TaskCard'
import { TaskModal } from '../../components/App/TaskModal'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { useTasks } from '../../hooks/useTasks'
import { dashboardService } from '../../services/dashboardService'
import { getApiErrorMessage } from '../../services/api'
import { getGreeting } from '../../utils/formatters'
import { useToast } from '../../hooks/useToast'

export function Dashboard() {
  const { user } = useAuth()
  const { projects, createProject, loadProjects } = useProjects()
  const { createTask } = useTasks()
  const { showToast } = useToast()
  const [dashboard, setDashboard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    try {
      setDashboard(await dashboardService.getDashboard())
    } catch (error) {
      showToast({ type: 'error', title: 'Dashboard Error', message: getApiErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  async function handleCreateProject(payload) {
    const result = await createProject(payload)
    if (result.success) {
      showToast({ type: 'success', title: 'Workspace Created', message: 'Workspace is ready.' })
      loadDashboard()
    }
    return result
  }

  async function handleCreateTask(payload) {
    const result = await createTask(payload)
    if (result.success) {
      showToast({ type: 'success', title: 'Task Created', message: 'Task added to your workspace.' })
      loadDashboard()
      loadProjects()
    }
    return result
  }

  const stats = [
    { label: 'Total Projects', value: dashboard?.projectCount || 0, icon: FiFolder },
    { label: "Today's Tasks", value: dashboard?.todaysTasks?.length || 0, icon: FiTarget },
    { label: 'Completed Tasks', value: dashboard?.completedTasks || 0, icon: FiCheckCircle },
    { label: 'Pending Tasks', value: dashboard?.pendingTasks || 0, icon: FiClock },
  ]

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">{getGreeting()}</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Hello {user?.fullName || 'there'}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Plan your day, scan delivery health, and keep the next task visible.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => setIsProjectModalOpen(true)}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Create Project
            </Button>
            <Button type="button" variant="accent" onClick={() => setIsTaskModalOpen(true)} disabled={projects.length === 0}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Create Task
            </Button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <LoadingState rows={4} />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">Recent Projects</h2>
                <Link to="/projects" className="text-sm font-bold text-teal-600 dark:text-teal-300">View all</Link>
              </div>
              {dashboard?.recentProjects?.length ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {dashboard.recentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No projects yet." description="Create your first workspace." actionLabel="Create Project" onAction={() => setIsProjectModalOpen(true)} />
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Upcoming Deadlines</h2>
              {dashboard?.upcomingDeadlines?.length ? (
                <div className="grid gap-3">
                  {dashboard.upcomingDeadlines.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={() => setIsTaskModalOpen(true)} onDelete={() => {}} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No upcoming deadlines." description="Tasks with deadlines will appear here." />
              )}
            </div>
          </section>
        </>
      )}

      <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onSubmit={handleCreateProject} />
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSubmit={handleCreateTask} projects={projects} />
    </div>
  )
}
