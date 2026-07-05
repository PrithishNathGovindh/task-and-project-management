import { motion } from 'framer-motion'

export function FeatureCard({ feature, index }) {
  const Icon = feature.icon

  return (
    <motion.article
      className="group rounded-lg border border-slate-200/80 bg-white/75 p-6 shadow-sm shadow-slate-950/5 backdrop-blur transition-colors duration-300 hover:border-teal-300 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-teal-400/60"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      whileHover={{ y: -10 }}
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 ring-1 ring-teal-500/15 transition-colors group-hover:bg-teal-500 group-hover:text-white dark:text-teal-300">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
    </motion.article>
  )
}
