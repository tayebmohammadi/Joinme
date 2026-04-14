import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(249,115,22,0.10),transparent_30%),radial-gradient(circle_at_88%_16%,rgba(14,165,233,0.08),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(5,150,105,0.07),transparent_26%)]" />
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
