import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES, getInitials, getAvatarColor } from '../../utils/constants'
import { useState } from 'react'

export default function Header() {
  const { currentUser, logout } = useAuth()
  const { navigate, page } = useNavigation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-warm-gray-200/60 shadow-sm">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] gradient-line" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(PAGES.BROWSE)}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ember to-violet flex items-center justify-center group-hover:shadow-glow-orange transition-all duration-300 group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <span className="font-serif text-xl text-bark leading-none group-hover:text-ember transition-colors duration-300">
              Joinme
            </span>
          </button>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-ember to-violet text-white tracking-[0.1em] uppercase shadow-sm hidden sm:inline-flex">
            Dartmouth
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(PAGES.CREATE_GROUP)}
            className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
              page === PAGES.CREATE_GROUP
                ? 'bg-gradient-to-r from-ember to-ember-light text-white shadow-glow-orange'
                : 'bg-white border border-warm-gray-200 text-bark hover:border-ember hover:text-ember hover:shadow-md active:scale-95'
            }`}
          >
            + New Group
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${getAvatarColor(currentUser?.displayName)} ${menuOpen ? 'ring-2 ring-ember/30 scale-105' : 'hover:scale-105'}`}
            >
              {getInitials(currentUser?.displayName)}
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 z-50 bg-white/95 backdrop-blur-xl rounded-2xl border border-warm-gray-200/60 shadow-xl shadow-black/[0.08] p-1.5 animate-fade-in">
                  <div className="px-3 py-2.5 border-b border-warm-gray-100 mb-1">
                    <p className="text-sm font-semibold text-bark truncate">{currentUser?.displayName}</p>
                    <p className="text-[11px] text-warm-gray-400 truncate">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate(PAGES.PROFILE); setMenuOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-warm-gray-600 hover:bg-parchment/60 hover:text-bark transition-all duration-200"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
