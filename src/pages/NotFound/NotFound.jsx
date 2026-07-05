import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { Button } from '../../components/ui/Button'

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">404</p>
      <h1 className="mt-4 text-5xl font-black text-slate-950 dark:text-white">Page not found</h1>
      <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
        This route is not part of the current Sprint 1 surface.
      </p>
      <Button asChild variant="accent" size="lg" className="mt-8">
        <Link to="/">
          <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
          Back Home
        </Link>
      </Button>
    </section>
  )
}
