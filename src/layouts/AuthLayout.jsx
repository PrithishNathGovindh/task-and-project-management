import { Outlet } from 'react-router-dom'

import { AnimatedBlob } from '../components/AnimatedBlob/AnimatedBlob'

export function AuthLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#e0f2fe_45%,_#eef2ff_100%)] px-5 py-8 text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_34%),linear-gradient(135deg,_#07111f_0%,_#0f172a_55%,_#111827_100%)] dark:text-white sm:px-8">
      <AnimatedBlob className="left-8 top-8 h-64 w-64 bg-teal-300/35 dark:bg-teal-400/20" />
      <AnimatedBlob className="bottom-0 right-8 h-80 w-80 bg-indigo-300/35 dark:bg-indigo-500/20" delay={1.2} />
      <Outlet />
    </main>
  )
}
