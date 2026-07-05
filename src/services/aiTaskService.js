import { api } from './api'

export const aiTaskService = {
  async generateTasks(idea) {
    const { data } = await api.post('/ai/tasks', { idea })
    return data
  },
}
