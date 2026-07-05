import { useState } from 'react'
import { FiFolder, FiSearch, FiUser, FiCheckSquare } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { EmptyState } from '../../components/App/EmptyState'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { getApiErrorMessage } from '../../services/api'
import { searchService } from '../../services/searchService'

const groups = [
  { key: 'projects', title: 'Projects', icon: FiFolder },
  { key: 'tasks', title: 'Tasks', icon: FiCheckSquare },
  { key: 'members', title: 'Members', icon: FiUser },
]

function ResultGroup({ group, results }) {
  const Icon = group.icon
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-teal-500" />
        <h2 className="text-xl font-black text-slate-950 dark:text-white">{group.title}</h2>
      </div>
      {results.length ? (
        <div className="grid gap-3">
          {results.map((result) => (
            <Link key={`${result.type}-${result.id}`} to={result.url} className="glass-panel rounded-lg p-4 transition hover:-translate-y-0.5">
              <p className="text-sm font-black text-slate-950 dark:text-white">{result.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{result.subtitle || result.type}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">No matching results.</p>
      )}
    </section>
  )
}

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ projects: [], tasks: [], members: [] })
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  async function handleSearch(event) {
    event.preventDefault()
    setIsLoading(true)
    try {
      const data = await searchService.search(query)
      setResults(data)
      setHasSearched(true)
      showToast({ type: 'success', title: 'Search Completed', message: 'Results are ready.' })
    } catch (error) {
      showToast({ type: 'error', title: 'Search Error', message: getApiErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const totalResults = groups.reduce((sum, group) => sum + (results[group.key]?.length || 0), 0)

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg p-6">
        <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">Global Search</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Find Work Fast</h1>
        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
          <label className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded-lg border border-slate-200 bg-white/70 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-teal-400 dark:border-white/10 dark:bg-white/5"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, tasks, workspace, members"
            />
          </label>
          <Button type="submit" variant="accent" disabled={isLoading}>
            <FiSearch className="h-4 w-4" />
            Search
          </Button>
        </form>
      </section>

      {hasSearched && totalResults === 0 ? (
        <EmptyState title="No results found." description="No matching results." />
      ) : (
        <section className="grid gap-6 xl:grid-cols-3">
          {groups.map((group) => <ResultGroup key={group.key} group={group} results={results[group.key] || []} />)}
        </section>
      )}
    </div>
  )
}
