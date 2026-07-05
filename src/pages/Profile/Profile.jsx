import { useCallback, useEffect, useState } from 'react'
import { FiBell, FiCheckCircle, FiClock, FiEdit3, FiFolder, FiImage, FiLock, FiLogOut, FiMoon, FiSave, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { LoadingState } from '../../components/App/LoadingState'
import { StatCard } from '../../components/App/StatCard'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useToast } from '../../hooks/useToast'
import { getApiErrorMessage } from '../../services/api'
import { profileService } from '../../services/profileService'
import { formatDate } from '../../utils/formatters'

const achievementIcons = {
  'First Workspace': 'Trophy',
  '100 Tasks Completed': 'Star',
  '7 Day Streak': 'Flame',
  'Project Master': 'Rocket',
}

export function Profile() {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ fullName: '', profilePicture: '', bio: '', password: '', notificationsEnabled: true })

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await profileService.getProfile()
      setProfile(data)
      setForm({
        fullName: data.fullName || '',
        profilePicture: data.profilePicture || '',
        bio: data.bio || '',
        password: '',
        notificationsEnabled: data.notificationsEnabled !== false,
      })
    } catch (error) {
      showToast({ type: 'error', title: 'Profile Error', message: getApiErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const payload = { ...form }
      if (!payload.password) {
        delete payload.password
      }
      const updatedProfile = await profileService.updateProfile(payload)
      setProfile(updatedProfile)
      setForm((current) => ({ ...current, password: '' }))
      setIsEditing(false)
      showToast({ type: 'success', title: 'Profile Updated', message: 'Your profile changes are saved.' })
    } catch (error) {
      showToast({ type: 'error', title: 'Profile Error', message: getApiErrorMessage(error) })
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (isLoading) {
    return <LoadingState rows={5} />
  }

  const stats = profile?.statistics || {}
  const statCards = [
    { icon: FiFolder, label: 'Total Projects', value: stats.totalProjects || 0 },
    { icon: FiCheckCircle, label: 'Completed Projects', value: stats.completedProjects || 0 },
    { icon: FiClock, label: 'Pending Projects', value: stats.pendingProjects || 0 },
    { icon: FiFolder, label: 'Total Tasks', value: stats.totalTasks || 0 },
    { icon: FiCheckCircle, label: 'Completed Tasks', value: stats.completedTasks || 0 },
    { icon: FiClock, label: 'Pending Tasks', value: stats.pendingTasks || 0 },
  ]

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg p-6 transition hover:-translate-y-0.5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-teal-500/10 text-4xl font-black text-teal-700 dark:text-teal-200">
              {profile?.profilePicture ? <img src={profile.profilePicture} alt="" className="h-full w-full object-cover" /> : profile?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">Profile</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">{profile?.fullName}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{profile?.bio || 'No bio added yet.'}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span>{profile?.email}</span>
                <span>{profile?.role}</span>
                <span>Member since {formatDate(profile?.memberSince)}</span>
                <span>{profile?.currentStreak || 0} day streak</span>
              </div>
            </div>
          </div>
          <Button type="button" variant="accent" onClick={() => setIsEditing((current) => !current)}>
            <FiEdit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      {isEditing && (
        <form className="glass-panel grid gap-4 rounded-lg p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2"><FiUser className="h-4 w-4 text-teal-500" />Name</span>
              <input className="rounded-lg border border-slate-200 bg-white/70 px-4 py-3 outline-none focus:border-teal-400 dark:border-white/10 dark:bg-white/5" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2"><FiImage className="h-4 w-4 text-teal-500" />Profile Picture</span>
              <input className="rounded-lg border border-slate-200 bg-white/70 px-4 py-3 outline-none focus:border-teal-400 dark:border-white/10 dark:bg-white/5" value={form.profilePicture} onChange={(event) => setForm({ ...form, profilePicture: event.target.value })} />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            Bio
            <textarea className="min-h-28 rounded-lg border border-slate-200 bg-white/70 px-4 py-3 outline-none focus:border-teal-400 dark:border-white/10 dark:bg-white/5" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-2"><FiLock className="h-4 w-4 text-teal-500" />Password</span>
            <input type="password" className="rounded-lg border border-slate-200 bg-white/70 px-4 py-3 outline-none focus:border-teal-400 dark:border-white/10 dark:bg-white/5" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="accent"><FiSave className="h-4 w-4" />Save</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <section className="glass-panel rounded-lg p-5">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Achievements</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(profile?.achievements?.length ? profile.achievements : ['First Workspace']).map((achievement) => (
                <div key={achievement} className="rounded-lg border border-slate-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-black text-slate-950 dark:text-white">{achievementIcons[achievement] || 'Award'} {achievement}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-lg p-5">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Recent History</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <HistoryColumn title="Recent Projects" items={profile?.recentProjects} />
              <HistoryColumn title="Completed Projects" items={profile?.completedProjects} />
              <HistoryColumn title="Recently Finished Tasks" items={profile?.recentlyFinishedTasks} />
            </div>
          </section>
        </div>

        <section className="glass-panel h-fit rounded-lg p-5">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Settings</h2>
          <div className="mt-4 grid gap-3">
            <button type="button" className="flex items-center justify-between rounded-lg border border-slate-200 p-4 text-left text-sm font-bold dark:border-white/10" onClick={toggleTheme}>
              <span className="flex items-center gap-2"><FiMoon className="h-4 w-4 text-teal-500" />Dark Mode</span>
              <span>{theme === 'dark' ? 'On' : 'Off'}</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4 text-left text-sm font-bold dark:border-white/10"
              onClick={async () => {
                const updatedProfile = await profileService.updateProfile({ notificationsEnabled: !(profile?.notificationsEnabled !== false) })
                setProfile(updatedProfile)
                showToast({ type: 'success', title: 'Settings Saved', message: 'Notification settings updated.' })
              }}
            >
              <span className="flex items-center gap-2"><FiBell className="h-4 w-4 text-teal-500" />Notification Settings</span>
              <span>{profile?.notificationsEnabled !== false ? 'On' : 'Off'}</span>
            </button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(true)}><FiEdit3 className="h-4 w-4" />Edit Profile</Button>
            <Button type="button" variant="ghost" onClick={handleLogout}><FiLogOut className="h-4 w-4" />Logout</Button>
          </div>
        </section>
      </section>
    </div>
  )
}

function HistoryColumn({ title, items = [] }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="mt-3 grid gap-2">
        {items.length ? items.map((item) => (
          <div key={item.id} className="rounded-lg bg-slate-900/5 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
            {item.name || item.title}
          </div>
        )) : <p className="text-sm text-slate-500 dark:text-slate-400">No items yet.</p>}
      </div>
    </div>
  )
}
