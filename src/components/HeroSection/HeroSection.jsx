import { motion } from 'framer-motion'
import { FiArrowRight, FiBell, FiCalendar, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { Button } from '../ui/Button'
import { FloatingTaskCard } from '../FloatingTaskCard/FloatingTaskCard'

export function HeroSection() {
  return (
    <section id="home" className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
      <div className="relative z-10">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-700 dark:text-teal-200"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <FiTrendingUp className="h-4 w-4" aria-hidden="true" />
          Sprint planning, docs, boards, and delivery in one place
        </motion.div>

        <motion.h1
          className="text-balance max-w-4xl text-5xl font-black leading-[1.02] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          Work Smarter Together
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-xl font-medium leading-9 text-slate-600 dark:text-slate-300 sm:text-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16 }}
        >
          Plan projects.
          <br />
          Manage tasks.
          <br />
          Collaborate efficiently.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24 }}
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
              <Link to="/register">
                Get Started
                <FiArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link to="/login">View Login</Link>
          </Button>
        </motion.div>
      </div>

      <div className="relative z-10 min-h-[520px]">
        <div className="absolute left-4 right-4 top-6 rounded-lg border border-slate-200 bg-white/45 p-4 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
          <div className="grid gap-4 rounded-lg border border-slate-200/70 bg-slate-950 p-4 text-white dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">Launch board</span>
              <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-200">Live</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Backlog', 'Active', 'Done'].map((column) => (
                <div key={column} className="rounded-lg bg-white/[0.06] p-3">
                  <p className="text-xs font-semibold text-slate-400">{column}</p>
                  <div className="mt-3 space-y-2">
                    {['opacity-100', 'opacity-80', 'opacity-60'].map((opacityClass) => (
                      <div key={opacityClass} className={`h-10 rounded-xl bg-white/[0.08] ${opacityClass}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FloatingTaskCard className="absolute left-0 top-14 w-[280px]" delay={0.25}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Task Progress</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">78%</h3>
            </div>
            <FiCheckCircle className="h-10 w-10 text-teal-500" aria-hidden="true" />
          </div>
          <div className="mt-5 h-3 rounded-full bg-slate-200 dark:bg-white/10">
            <motion.div
              className="h-3 rounded-full bg-teal-500"
              initial={{ width: 0 }}
              animate={{ width: '78%' }}
              transition={{ duration: 1.1, delay: 0.6, ease: 'easeOut' }}
            />
          </div>
        </FloatingTaskCard>

        <FloatingTaskCard className="absolute right-0 top-48 w-[260px]" delay={0.42}>
          <div className="flex gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <FiBell className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">Design review moved</p>
              <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">Today at 4:30 PM with the product team.</p>
            </div>
          </div>
        </FloatingTaskCard>

        <FloatingTaskCard className="absolute bottom-12 left-10 w-[300px]" delay={0.58}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Calendar</p>
              <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Sprint 12</h3>
            </div>
            <FiCalendar className="h-8 w-8 text-teal-500" aria-hidden="true" />
          </div>
          <div className="mt-5 grid grid-cols-5 gap-2">
            {['M', 'T', 'W', 'T', 'F'].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="flex h-12 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 dark:bg-white/10 dark:text-slate-200"
              >
                {day}
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <FiClock className="h-4 w-4 text-teal-500" aria-hidden="true" />
            3 milestones due this week
          </p>
        </FloatingTaskCard>
      </div>
    </section>
  )
}
