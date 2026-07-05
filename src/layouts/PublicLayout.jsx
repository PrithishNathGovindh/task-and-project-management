import { Outlet } from 'react-router-dom'

import { AnimatedBlob } from '../components/AnimatedBlob/AnimatedBlob'
import { Footer } from '../components/Footer/Footer'
import { Navbar } from '../components/Navbar/Navbar'

export function PublicLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.20),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#ecfeff_46%,_#eef2ff_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_32%),linear-gradient(135deg,_#07111f_0%,_#0f172a_50%,_#111827_100%)] dark:text-white">
      <AnimatedBlob className="-left-28 top-24 h-72 w-72 bg-teal-300/40 dark:bg-teal-400/20" />
      <AnimatedBlob className="right-0 top-80 h-80 w-80 bg-indigo-300/35 dark:bg-indigo-500/20" delay={1.5} />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
