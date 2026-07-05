import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-white/10 dark:hover:bg-slate-200',
        accent:
          'bg-primary text-primary-foreground shadow-lg shadow-teal-500/25 hover:-translate-y-0.5 hover:bg-teal-600',
        outline:
          'border border-slate-200 bg-white/70 text-slate-800 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-teal-400/60 dark:hover:bg-teal-400/10',
        ghost:
          'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-5',
        lg: 'h-14 px-7 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
