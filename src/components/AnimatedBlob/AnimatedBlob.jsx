import { motion } from 'framer-motion'

import { cn } from '../../utils/cn'

export function AnimatedBlob({ className, delay = 0 }) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn('pointer-events-none absolute rounded-full blur-3xl', className)}
      animate={{
        x: [0, 28, -18, 0],
        y: [0, -24, 22, 0],
        scale: [1, 1.12, 0.96, 1],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
