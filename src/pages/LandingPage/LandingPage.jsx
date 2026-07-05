import { motion } from 'framer-motion'

import { FeatureCard } from '../../components/FeatureCard/FeatureCard'
import { HeroSection } from '../../components/HeroSection/HeroSection'
import { features } from '../../data/features'

export function LandingPage() {
  return (
    <>
      <HeroSection />

      <section id="features" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">Features</p>
          <h2 className="mt-4 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
            Everything your workflow expects, without the clutter.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            TaskFlow blends structured project management with flexible workspace thinking, so individuals and teams can plan with clarity.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>

      <section id="about" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <motion.div
          className="glass-panel rounded-lg p-8 sm:p-12 lg:p-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-teal-600 dark:text-teal-300">About</p>
              <h2 className="mt-4 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
                Built for teams that move from idea to shipped software.
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              <p>
                TaskFlow is a modern task and project management platform inspired by the flexibility of Notion, the visual clarity of Trello, and the execution depth of ClickUp.
              </p>
              <p>
                It gives solo builders and development teams a premium workspace for planning roadmaps, tracking sprint work, coordinating deadlines, and keeping every decision connected to the task it affects.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
