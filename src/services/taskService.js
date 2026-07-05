import { api } from './api'

export const taskService = {
  async getTasks() {
    const { data } = await api.get('/tasks')
    return data
  },

  async getProjectTasks(projectId) {
    const { data } = await api.get(`/tasks/project/${projectId}`)
    return data
  },

  async getTask(id) {
    const { data } = await api.get(`/tasks/${id}`)
    return data
  },

  async createTask(payload) {
    const { data } = await api.post('/tasks', payload)
    return data
  },

  async updateTask(id, payload) {
    const { data } = await api.put(`/tasks/${id}`, payload)
    return data
  },

  async moveTask(id, payload) {
    const { data } = await api.put(`/tasks/${id}/move`, payload)
    return data
  },

  async deleteTask(id) {
    await api.delete(`/tasks/${id}`)
  },

  async getComments(taskId) {
    const { data } = await api.get(`/tasks/${taskId}/comments`)
    return data
  },

  async createComment(taskId, payload) {
    const { data } = await api.post(`/tasks/${taskId}/comments`, payload)
    return data
  },

  async deleteComment(commentId) {
    await api.delete(`/comments/${commentId}`)
  },

  async getAttachments(taskId) {
    const { data } = await api.get(`/tasks/${taskId}/attachments`)
    return data
  },

  async uploadAttachment(taskId, file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async deleteAttachment(attachmentId) {
    await api.delete(`/attachments/${attachmentId}`)
  },
}
