export function LoadingState({ rows = 3 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="glass-panel animate-pulse rounded-lg p-5">
          <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-4 h-4 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-5 h-3 w-full rounded bg-slate-200 dark:bg-white/10" />
        </div>
      ))}
    </div>
  )
}
