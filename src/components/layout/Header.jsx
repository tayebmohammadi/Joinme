import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES, getInitials, getAvatarColor } from '../../utils/constants'
import { useState } from 'react'

export default function Header() {
  const { currentUser, logout } = useAuth()
  const { navigate, page } = useNavigation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/60">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(PAGES.BROWSE)}
            className="font-serif text-xl text-bark leading-none hover:text-ember transition-colors"
          >
            Joinme
          </button>
          <span className="tag bg-parchment text-warm-gray-500 border border-warm-gray-200/80 text-[10px] font-bold uppercase tracking-[0.1em] hidden sm:inline-flex">
            Dartmouth Groups
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(PAGES.CREATE_GROUP)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
              page === PAGES.CREATE_GROUP
                ? 'bg-ember text-white'
                : 'bg-parchment border border-warm-gray-200/80 text-warm-gray-600 hover:text-bark hover:border-warm-gray-300'
            }`}
          >
            + New Group
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${getAvatarColor(currentUser?.displayName)} ${menuOpen ? 'ring-2 ring-ember/30' : ''}`}
            >
              {getInitials(currentUser?.displayName)}
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 z-50 card-base p-1 animate-fade-in">
                  <div className="px-3 py-2 border-b border-warm-gray-200/60 mb-1">
                    <p className="text-sm font-medium text-bark truncate">{currentUser?.displayName}</p>
                    <p className="text-xs text-warm-gray-400 truncate">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate(PAGES.PROFILE); setMenuOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-warm-gray-600 hover:bg-parchment/60 hover:text-bark transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
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
