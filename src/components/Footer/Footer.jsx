import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200/80 bg-white/55 dark:border-white/10 dark:bg-slate-950/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <Link to="/" className="text-lg font-black text-slate-950 dark:text-white">
            TaskFlow
          </Link>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            A modern task and project management experience for founders, students, and software teams shipping together.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {[FiTwitter, FiGithub, FiLinkedin].map((Icon, index) => (
            <a
              key={index}
              href="/#contact"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-teal-300"
              aria-label="Social link"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
