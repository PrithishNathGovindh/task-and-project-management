import { api } from './api'

function toFallbackProfile(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    role: user.role,
    memberSince: user.createdAt,
    currentStreak: 0,
    notificationsEnabled: user.notificationsEnabled !== false,
    statistics: {
      totalProjects: 0,
      completedProjects: 0,
      pendingProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
    },
    achievements: [],
    recentProjects: [],
    completedProjects: [],
    recentlyFinishedTasks: [],
  }
}

export const profileService = {
  async getProfile() {
    try {
      const { data } = await api.get('/profile')
      return data
    } catch {
      const { data } = await api.get('/auth/me')
      return toFallbackProfile(data)
    }
  },
  async updateProfile(payload) {
    try {
      const { data } = await api.put('/profile', payload)
      return data
    } catch {
      const { data } = await api.get('/auth/me')
      return toFallbackProfile({ ...data, ...payload })
    }
  },
}
