import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ProjectContext } from './project'
import { getApiErrorMessage } from '../services/api'
import { projectService } from '../services/projectService'
import { useConfetti } from '../hooks/useConfetti'
import { useToast } from '../hooks/useToast'

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const previousProjectsRef = useRef(new Map())
  const hasLoadedProjectsRef = useRef(false)
  const { fireConfetti } = useConfetti()
  const { showToast } = useToast()

  const celebrateCompletedProjects = useCallback((nextProjects) => {
    if (!hasLoadedProjectsRef.current) {
      previousProjectsRef.current = new Map(nextProjects.map((project) => [project.id, project.progress || 0]))
      hasLoadedProjectsRef.current = true
      return
    }

    nextProjects.forEach((project) => {
      const previousProgress = previousProjectsRef.current.get(project.id) || 0
      const nextProgress = project.progress || 0
      if (previousProgress < 100 && nextProgress >= 100) {
        fireConfetti()
        showToast({ type: 'success', title: 'Project Completed', message: `${project.name || 'Workspace'} reached 100% completion.` })
      }
    })

    previousProjectsRef.current = new Map(nextProjects.map((project) => [project.id, project.progress || 0]))
  }, [fireConfetti, showToast])

  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true)
    try {
      const data = await projectService.getProjects()
      celebrateCompletedProjects(data)
      setProjects(data)
      return { success: true, data }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    } finally {
      setIsLoadingProjects(false)
    }
  }, [celebrateCompletedProjects])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const createProject = useCallback(async (payload) => {
    try {
      const data = await projectService.createProject(payload)
      setProjects((currentProjects) => [data, ...currentProjects])
      previousProjectsRef.current.set(data.id, data.progress || 0)
      return { success: true, data }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }, [])

  const updateProject = useCallback(async (id, payload) => {
    try {
      const data = await projectService.updateProject(id, payload)
      setProjects((currentProjects) => currentProjects.map((project) => (project.id === id ? data : project)))
      celebrateCompletedProjects(projects.map((project) => (project.id === id ? data : project)))
      return { success: true, data }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }, [celebrateCompletedProjects, projects])

  const deleteProject = useCallback(async (id) => {
    try {
      await projectService.deleteProject(id)
      setProjects((currentProjects) => currentProjects.filter((project) => project.id !== id))
      previousProjectsRef.current.delete(id)
      return { success: true }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }, [])

  const value = useMemo(
    () => ({
      projects,
      isLoadingProjects,
      loadProjects,
      createProject,
      updateProject,
      deleteProject,
    }),
    [createProject, deleteProject, isLoadingProjects, loadProjects, projects, updateProject],
  )

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
