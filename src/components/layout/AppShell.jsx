import PublicLandingBackdrop from '../public/PublicLandingBackdrop'
import Sidebar from './Sidebar'

export default function AppShell({ children }) {
  return (
    <div className="relative h-screen flex overflow-hidden">
      <PublicLandingBackdrop />
      <Sidebar />
      <main className="relative z-10 flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full px-6 lg:px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
