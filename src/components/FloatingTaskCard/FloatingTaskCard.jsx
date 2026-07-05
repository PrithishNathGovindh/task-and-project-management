import { motion } from 'framer-motion'

import { cn } from '../../utils/cn'

export function FloatingTaskCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={cn('glass-panel rounded-lg p-5', className)}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {children}
    </motion.div>
  )
}
