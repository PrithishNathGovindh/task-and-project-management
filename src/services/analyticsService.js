import { api } from './api'

function emptyChartData() {
  return {
    weeklyProductivity: [],
    taskStatusDistribution: [],
    monthlyActivity: [],
    projectCompletionTrend: [],
  }
}

export const analyticsService = {
  async getAnalytics() {
    try {
      const { data } = await api.get('/analytics')
      return data
    } catch {
      const { data } = await api.get('/dashboard')
      const totalTasks = data.taskCount || 0
      const completedTasks = data.completedTasks || 0
      const pendingTasks = data.pendingTasks || 0
      const completionPercentage = totalTasks ? Math.round((completedTasks * 100) / totalTasks) : 0

      return {
        totalProjects: data.projectCount || 0,
        completedProjects: data.recentProjects?.filter((project) => project.status === 'COMPLETED').length || 0,
        pendingProjects: data.projectCount || 0,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks: 0,
        completionPercentage,
        productivityScore: completionPercentage,
        ...emptyChartData(),
      }
    }
  },
}
