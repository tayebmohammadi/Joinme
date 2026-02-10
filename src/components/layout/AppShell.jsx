import Header from './Header'
import Sidebar from './Sidebar'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex gap-0">
        <Sidebar />
        <main className="flex-1 lg:pl-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
