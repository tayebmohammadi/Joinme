import { useEffect, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function AppShell({ children }) {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const top = window.scrollY
          const height = document.documentElement.scrollHeight - window.innerHeight
          setScroll(height > 0 ? Math.min(top / height, 1) : 0)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Scroll-reactive background — warm at top, cool at bottom */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* Scroll-reactive orbs — each also gently breathes on its own */}
        <div
          className="scroll-orb"
          style={{
            width: 700,
            height: 700,
            background: `rgba(249, 115, 22, ${(0.10 - scroll * 0.06).toFixed(3)})`,
            top: `${-15 + scroll * 25}%`,
            left: `${-8 + scroll * 20}%`,
            animation: 'orbFloat 20s ease-in-out infinite',
          }}
        />
        <div
          className="scroll-orb"
          style={{
            width: 600,
            height: 600,
            background: `rgba(139, 92, 246, ${(0.04 + scroll * 0.07).toFixed(3)})`,
            top: `${20 + scroll * 25}%`,
            right: `${-12 + scroll * 15}%`,
            animation: 'orbFloat 26s ease-in-out infinite reverse',
          }}
        />
        <div
          className="scroll-orb"
          style={{
            width: 500,
            height: 500,
            background: `rgba(14, 165, 233, ${(0.02 + scroll * 0.08).toFixed(3)})`,
            bottom: `${-10 + scroll * 20}%`,
            left: `${25 - scroll * 15}%`,
            animation: 'orbFloat 32s ease-in-out infinite',
          }}
        />
        <div
          className="scroll-orb"
          style={{
            width: 300,
            height: 300,
            background: `rgba(249, 115, 22, ${(0.03 + scroll * 0.04).toFixed(3)})`,
            bottom: `${5 + scroll * 10}%`,
            right: `${5 + scroll * 5}%`,
            animation: 'orbFloat 24s ease-in-out infinite reverse',
          }}
        />

        {/* Floating particles — constant gentle motion */}
        <div className="floating-particle" style={{ width: 14, height: 14, background: 'rgba(249,115,22,0.18)', top: '12%', left: '10%', animation: 'drift1 22s ease-in-out infinite' }} />
        <div className="floating-particle" style={{ width: 10, height: 10, background: 'rgba(139,92,246,0.15)', top: '30%', right: '15%', animation: 'drift2 28s ease-in-out infinite' }} />
        <div className="floating-particle" style={{ width: 18, height: 18, background: 'rgba(14,165,233,0.12)', top: '55%', left: '60%', animation: 'drift3 24s ease-in-out infinite' }} />
        <div className="floating-particle" style={{ width: 8, height: 8, background: 'rgba(5,150,105,0.2)', top: '70%', left: '20%', animation: 'drift1 30s ease-in-out infinite reverse' }} />
        <div className="floating-particle" style={{ width: 20, height: 20, background: 'rgba(249,115,22,0.1)', top: '40%', left: '78%', animation: 'drift2 35s ease-in-out infinite reverse' }} />
        <div className="floating-particle" style={{ width: 12, height: 12, background: 'rgba(139,92,246,0.14)', top: '82%', right: '30%', animation: 'drift3 20s ease-in-out infinite' }} />
      </div>

      <Header />
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex gap-0">
        <Sidebar />
        <main className="flex-1 lg:pl-8 min-w-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
