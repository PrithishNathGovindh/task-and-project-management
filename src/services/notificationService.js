import { api } from './api'

export const notificationService = {
  async getNotifications() {
    const { data } = await api.get('/notifications')
    return data
  },
  async markAsRead(id) {
    const { data } = await api.put(`/notifications/${id}/read`)
    return data
  },
  async markAllAsRead() {
    const { data } = await api.put('/notifications/read-all')
    return data
  },
  async deleteNotification(id) {
    await api.delete(`/notifications/${id}`)
  },
}
