export const projectTypes = ['SOLO', 'TEAM']
export const projectCategories = ['SOFTWARE', 'EXAM', 'STARTUP', 'RESEARCH']
export const projectStatuses = ['ACTIVE', 'COMPLETED']
export const taskStatuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']
export const taskPriorities = ['LOW', 'MEDIUM', 'HIGH']

export const projectColors = [
  { label: 'Teal', value: '#14b8a6', className: 'bg-teal-500' },
  { label: 'Indigo', value: '#6366f1', className: 'bg-indigo-500' },
  { label: 'Rose', value: '#f43f5e', className: 'bg-rose-500' },
  { label: 'Amber', value: '#f59e0b', className: 'bg-amber-500' },
]

export const progressWidthClasses = {
  0: 'w-0',
  10: 'w-[10%]',
  20: 'w-[20%]',
  30: 'w-[30%]',
  40: 'w-[40%]',
  50: 'w-[50%]',
  60: 'w-[60%]',
  70: 'w-[70%]',
  80: 'w-[80%]',
  90: 'w-[90%]',
  100: 'w-full',
}

export function getProgressClass(progress = 0) {
  const roundedProgress = Math.max(0, Math.min(100, Math.round(progress / 10) * 10))
  return progressWidthClasses[roundedProgress]
}

export function getColorClass(color) {
  return projectColors.find((item) => item.value === color)?.className || 'bg-teal-500'
}
