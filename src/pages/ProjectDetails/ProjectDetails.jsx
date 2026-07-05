import { useCallback, useEffect, useState } from 'react'
import { FiArrowLeft, FiCalendar, FiEdit3, FiMail, FiPlus, FiTrash2, FiUserPlus, FiUsers } from 'react-icons/fi'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { EmptyState } from '../../components/App/EmptyState'
import { InviteMemberModal } from '../../components/App/InviteMemberModal'
import { KanbanBoard } from '../../components/App/KanbanBoard'
import { LoadingState } from '../../components/App/LoadingState'
import { ProjectModal } from '../../components/App/ProjectModal'
import { TaskDetailsModal } from '../../components/App/TaskDetailsModal'
import { TaskModal } from '../../components/App/TaskModal'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { useTasks } from '../../hooks/useTasks'
import { useToast } from '../../hooks/useToast'
import { projectService } from '../../services/projectService'
import { getApiErrorMessage } from '../../services/api'
import { formatDate, formatEnum } from '../../utils/formatters'

const tabs = ['Overview', 'Tasks', 'Members']

export function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, updateProject, deleteProject, loadProjects } = useProjects()
  const { tasks, isLoadingTasks, loadTasks, createTask, updateTask, moveTask, deleteTask } = useTasks()
  const { showToast } = useToast()
  const [project, setProject] = useState(null)
  const [activeTab, setActiveTab] = useState('Overview')
  const [isLoading, setIsLoading] = useState(true)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  const loadProjectDetails = useCallback(async () => {
    setIsLoading(true)
    try {
      setProject(await projectService.getProject(id))
      await loadTasks(id)
    } catch (error) {
      showToast({ type: 'error', title: 'Project Error', message: getApiErrorMessage(error) })
      navigate('/projects')
    } finally {
      setIsLoading(false)
    }
  }, [id, loadTasks, navigate, showToast])

  useEffect(() => {
    loadProjectDetails()
  }, [loadProjectDetails])

  async function handleUpdateProject(payload) {
    const result = await updateProject(id, payload)
    if (result.success) {
      setProject(result.data)
      showToast({ type: 'success', title: 'Project Updated', message: 'Workspace details saved.' })
    }
    return result
  }

  async function handleDeleteProject() {
    if (!window.confirm('Delete this workspace? This will also remove its tasks.')) {
      return
    }

    const result = await deleteProject(id)
    if (result.success) {
      showToast({ type: 'success', title: 'Project Deleted', message: 'Workspace removed.' })
      navigate('/projects')
    }
  }

  async function handleInviteMember(payload) {
    try {
      const data = await projectService.inviteMember(id, payload)
      setProject(data)
      await loadProjects()
      showToast({ type: 'success', title: 'Member Invited', message: 'The member was added to this workspace.' })
      return { success: true, data }
    } catch (error) {
      const message = getApiErrorMessage(error)
      const title = message === 'User already added.' ? 'User Already Exists' : message === 'User not found.' ? 'User Not Found' : 'Invite Failed'
      showToast({ type: 'error', title, message })
      return { success: false, message }
    }
  }

  async function handleTaskSubmit(payload) {
    const result = editingTask ? await updateTask(editingTask.id, payload) : await createTask(payload)
    if (result.success) {
      showToast({ type: 'success', title: editingTask ? 'Task Updated' : 'Task Created', message: editingTask ? 'Task details saved.' : 'Task added to the workspace.' })
      setEditingTask(null)
      await loadTasks(id)
      await loadProjects()
      setProject(await projectService.getProject(id))
    }
    return result
  }

  async function handleDeleteTask(task) {
    if (!window.confirm('Delete this task?')) {
      return
    }

    const result = await deleteTask(task.id)
    if (result.success) {
      showToast({ type: 'success', title: 'Task Deleted', message: 'Task removed from the workspace.' })
      await loadTasks(id)
      await loadProjects()
      setProject(await projectService.getProject(id))
    }
  }

  async function handleMoveTask(task, payload) {
    const result = await moveTask(task.id, payload)
    if (result.success) {
      showToast({ type: 'success', title: 'Task Moved Successfully', message: 'Task position saved.' })
      await loadTasks(id)
      await loadProjects()
      setProject(await projectService.getProject(id))
    } else {
      showToast({ type: 'error', title: 'Move Failed', message: result.message })
    }
  }

  if (isLoading) {
    return <LoadingState rows={4} />
  }

  if (!project) {
    return <EmptyState title="Project not found." description="This workspace is unavailable." />
  }

  const isOwner = user?.id === project.ownerId
  const workspaceName = project.workspaceName || project.name

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300">
        <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Projects
      </Link>

      <section className="glass-panel rounded-lg p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">{formatEnum(project.category)}</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">{workspaceName}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description || 'No description yet.'}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2"><FiCalendar className="h-4 w-4 text-teal-500" />{formatDate(project.deadline)}</span>
              <span className="flex items-center gap-2"><FiUsers className="h-4 w-4 text-teal-500" />{project.membersCount || 1} member{(project.membersCount || 1) === 1 ? '' : 's'}</span>
              <span>Owner: {project.ownerName || 'Unknown owner'}</span>
              <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-200">{formatEnum(project.status)}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{formatEnum(project.type)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {isOwner && (
              <>
                <Button type="button" variant="outline" onClick={() => setIsProjectModalOpen(true)}>
                  <FiEdit3 className="h-4 w-4" aria-hidden="true" />
                  Edit Workspace
                </Button>
                <Button type="button" variant="outline" onClick={handleDeleteProject}>
                  <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                  Delete Workspace
                </Button>
              </>
            )}
            {isOwner && project.type === 'TEAM' && (
              <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(true)}>
                <FiUserPlus className="h-4 w-4" aria-hidden="true" />
                Invite Member
              </Button>
            )}
            <Button type="button" variant="accent" onClick={() => setIsTaskModalOpen(true)}>
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Create Task
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span>{project.progress || 0}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-white/10">
            <div className="h-2 rounded-full bg-teal-500" style={{ width: `${project.progress || 0}%` }} />
          </div>
        </div>
      </section>

      <section className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              activeTab === tab
                ? 'bg-teal-500 text-white'
                : 'bg-white/70 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      {activeTab === 'Overview' && (
        <section className="grid gap-4 md:grid-cols-3">
          <SummaryTile label="Type" value={formatEnum(project.type)} />
          <SummaryTile label="Owner" value={project.ownerName || 'Unknown owner'} />
          <SummaryTile label="Tasks" value={`${project.completedTaskCount || 0}/${project.taskCount || 0} complete`} />
          <SummaryTile label="Deadline" value={formatDate(project.deadline)} />
        </section>
      )}

      {activeTab === 'Tasks' && (
        <section className="space-y-4">
          {isLoadingTasks ? (
            <LoadingState rows={4} />
          ) : tasks.length ? (
            <KanbanBoard
              tasks={tasks}
              members={project.members || []}
              onMoveTask={handleMoveTask}
              onOpenTask={setSelectedTask}
              onEditTask={(selectedTask) => {
                  setEditingTask(selectedTask)
                  setIsTaskModalOpen(true)
              }}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <EmptyState title="No tasks available." description="Create a task to start moving this workspace forward." actionLabel="Create Task" onAction={() => setIsTaskModalOpen(true)} />
          )}
        </section>
      )}

      {activeTab === 'Members' && (
        <section className="glass-panel rounded-lg p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Members</h2>
            {isOwner && project.type === 'TEAM' && (
              <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(true)}>
                <FiUserPlus className="h-4 w-4" aria-hidden="true" />
                Invite Member
              </Button>
            )}
          </div>
          {project.members?.length ? (
            <div className="mt-4 grid gap-3">
              {project.members.map((member) => (
                <div key={member.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500/10 text-sm font-black text-teal-700 dark:text-teal-200">
                      {member.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-950 dark:text-white">{member.fullName}</p>
                        {member.owner && <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-bold text-teal-700 dark:text-teal-200">Owner</span>}
                      </div>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <FiMail className="h-4 w-4 text-teal-500" aria-hidden="true" />
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{member.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No members available." description="Member details will appear here." />
          )}
        </section>
      )}

      <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onSubmit={handleUpdateProject} project={project} />
      <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} onSubmit={handleInviteMember} />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        projects={projects}
        defaultProjectId={project.id}
        members={project.members || []}
      />
      <TaskDetailsModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        showToast={showToast}
        onChanged={async () => {
          await loadTasks(id)
          setProject(await projectService.getProject(id))
        }}
      />
    </div>
  )
}

function SummaryTile({ label, value }) {
  return (
    <article className="glass-panel rounded-lg p-5">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">{value}</p>
    </article>
  )
}
