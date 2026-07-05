import { FiBarChart2, FiBell, FiCpu, FiFileText, FiUsers, FiZap } from 'react-icons/fi'

export const features = [
  {
    title: 'Solo Mode',
    description: 'Capture personal tasks, focus blocks, and priorities without workspace noise.',
    icon: FiZap,
  },
  {
    title: 'Team Mode',
    description: 'Plan sprints, assign owners, and keep product work visible across the team.',
    icon: FiUsers,
  },
  {
    title: 'Analytics',
    description: 'Understand delivery health with progress trends, cycle time, and workload signals.',
    icon: FiBarChart2,
  },
  {
    title: 'Notifications',
    description: 'Stay aligned with smart nudges for mentions, due dates, and project changes.',
    icon: FiBell,
  },
  {
    title: 'AI Task Generator',
    description: 'Turn rough ideas into scoped tasks, acceptance criteria, and launch checklists.',
    icon: FiCpu,
  },
  {
    title: 'File Sharing',
    description: 'Attach specs, assets, and notes directly to the work that needs them.',
    icon: FiFileText,
  },
]
