import { useCallback, useMemo, useState } from 'react'

import { TaskContext } from './task'
import { getApiErrorMessage } from '../services/api'
import { taskService } from '../services/taskService'

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)

  const loadTasks = useCallback(async (projectId) => {
    setIsLoadingTasks(true)
    try {
      const data = projectId ? await taskService.getProjectTasks(projectId) : await taskService.getTasks()
      setTasks(data)
      return { success: true, data }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    } finally {
      setIsLoadingTasks(false)
    }
  }, [])

  async function createTask(payload) {
    try {
      const data = await taskService.createTask(payload)
      setTasks((currentTasks) => [data, ...currentTasks])
      return { success: true, data }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }

  async function updateTask(id, payload) {
    try {
      const data = await taskService.updateTask(id, payload)
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === id ? data : task)))
      return { success: true, data }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }

  async function moveTask(id, payload) {
    try {
      const data = await taskService.moveTask(id, payload)
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === id ? data : task)))
      return { success: true, data }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }

  async function deleteTask(id) {
    try {
      await taskService.deleteTask(id)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
      return { success: true }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }

  const value = useMemo(
    () => ({
      tasks,
      isLoadingTasks,
      loadTasks,
      createTask,
      updateTask,
      moveTask,
      deleteTask,
    }),
    [isLoadingTasks, loadTasks, tasks],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
