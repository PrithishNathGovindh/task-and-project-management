import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiClock, FiFolder, FiPercent, FiTrendingUp } from 'react-icons/fi'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { EmptyState } from '../../components/App/EmptyState'
import { LoadingState } from '../../components/App/LoadingState'
import { StatCard } from '../../components/App/StatCard'
import { useToast } from '../../hooks/useToast'
import { analyticsService } from '../../services/analyticsService'
import { getApiErrorMessage } from '../../services/api'

const colors = ['#14b8a6', '#6366f1', '#f59e0b', '#22c55e']

function ChartPanel({ title, children }) {
  return (
    <section className="glass-panel rounded-lg p-5">
      <h2 className="text-lg font-black text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-4 h-72 animate-[fadeIn_0.35s_ease-out]">{children}</div>
    </section>
  )
}

export function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true)
    try {
      setAnalytics(await analyticsService.getAnalytics())
    } catch (error) {
      showToast({ type: 'error', title: 'Analytics Error', message: getApiErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const hasData = useMemo(() => analytics && (analytics.totalProjects > 0 || analytics.totalTasks > 0), [analytics])

  if (isLoading) {
    return <LoadingState rows={5} />
  }

  if (!hasData) {
    return <EmptyState title="No data available." description="Create projects and tasks to unlock analytics." />
  }

  const stats = [
    { label: 'Total Projects', value: analytics.totalProjects, icon: FiFolder },
    { label: 'Completed Projects', value: analytics.completedProjects, icon: FiCheckCircle },
    { label: 'Pending Projects', value: analytics.pendingProjects, icon: FiClock },
    { label: 'Total Tasks', value: analytics.totalTasks, icon: FiActivity },
    { label: 'Completed Tasks', value: analytics.completedTasks, icon: FiCheckCircle },
    { label: 'Pending Tasks', value: analytics.pendingTasks, icon: FiClock },
    { label: 'Overdue Tasks', value: analytics.overdueTasks, icon: FiAlertTriangle },
    { label: 'Completion', value: `${analytics.completionPercentage}%`, icon: FiPercent },
    { label: 'Productivity Score', value: analytics.productivityScore, icon: FiTrendingUp },
  ]

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg p-6">
        <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">Analytics</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Delivery Health</h1>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartPanel title="Weekly Productivity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.weeklyProductivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.24)" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Task Status Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analytics.taskStatusDistribution} dataKey="value" nameKey="label" innerRadius={58} outerRadius={96} paddingAngle={4}>
                {analytics.taskStatusDistribution.map((entry, index) => <Cell key={entry.label} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Monthly Activity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.24)" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Project Completion Trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.projectCompletionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.24)" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.22} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>
    </div>
  )
}
