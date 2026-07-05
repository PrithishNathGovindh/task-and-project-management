export function StatCard({ icon: Icon, label, value }) {
  return (
    <article className="glass-panel rounded-lg p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-300">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}
