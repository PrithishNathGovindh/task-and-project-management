import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'

import { EmptyState } from '../../components/App/EmptyState'
import { LoadingState } from '../../components/App/LoadingState'
import { ProjectCard } from '../../components/App/ProjectCard'
import { ProjectModal } from '../../components/App/ProjectModal'
import { Button } from '../../components/ui/Button'
import { useProjects } from '../../hooks/useProjects'
import { useToast } from '../../hooks/useToast'

export function Projects() {
  const { projects, isLoadingProjects, createProject } = useProjects()
  const { showToast } = useToast()
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  async function handleCreateProject(payload) {
    const result = await createProject(payload)
    if (result.success) {
      showToast({ type: 'success', title: 'Workspace Created', message: 'Workspace is ready.' })
    }
    return result
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">Projects</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Workspaces</h1>
        </div>
        <Button type="button" variant="accent" onClick={() => setIsProjectModalOpen(true)}>
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          Create Project
        </Button>
      </section>

      {isLoadingProjects ? (
        <LoadingState rows={4} />
      ) : projects.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      ) : (
        <EmptyState title="No projects yet." description="Create your first workspace." actionLabel="Create Project" onAction={() => setIsProjectModalOpen(true)} />
      )}

      <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onSubmit={handleCreateProject} />
    </div>
  )
}
