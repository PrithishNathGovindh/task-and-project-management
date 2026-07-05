import { api } from './api'

export const projectService = {
  async getProjects() {
    const { data } = await api.get('/projects')
    return data
  },

  async getProject(id) {
    const { data } = await api.get(`/projects/${id}`)
    return data
  },

  async createProject(payload) {
    const { data } = await api.post('/projects', payload)
    return data
  },

  async updateProject(id, payload) {
    const { data } = await api.put(`/projects/${id}`, payload)
    return data
  },

  async deleteProject(id) {
    await api.delete(`/projects/${id}`)
  },

  async inviteMember(projectId, payload) {
    const { data } = await api.post(`/projects/${projectId}/invite`, payload)
    return data
  },
}
