import Sidebar from './Sidebar'

export default function AppShell({ children }) {
  return (
    <div className="h-screen flex bg-cream overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full px-6 lg:px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
