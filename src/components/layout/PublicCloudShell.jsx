import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES } from '../../utils/constants'
import { focusDartmouthSignIn } from '../../utils/focusDartmouthSignIn'
import { JoinmeEmblem } from '../branding/JoinmeWordmark'
import PublicLandingBackdrop from '../public/PublicLandingBackdrop'

export default function PublicCloudShell({ children }) {
  const { page, navigate } = useNavigation()
  const { oauthGateError } = useAuth()

  const Tab = ({ active, label, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-colors ${
        active
          ? 'bg-bark text-white shadow-sm'
          : 'bg-white/65 text-warm-gray-600 border border-warm-gray-200/80 hover:bg-white hover:text-bark'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <PublicLandingBackdrop />
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/55 backdrop-blur-xl shadow-[0_1px_0_rgba(14,15,12,0.04)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center gap-4 justify-between">
          <button
            type="button"
            onClick={() => navigate(PAGES.BROWSE)}
            className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity"
          >
            <JoinmeEmblem />
            <div>
              <p className="font-serif text-lg text-bark leading-tight tracking-tight">Joinme</p>
              <p className="text-[11px] text-warm-gray-500 uppercase tracking-[0.12em] font-semibold mt-0.5">
                Dartmouth community
              </p>
            </div>
          </button>

          <nav className="flex flex-wrap items-center gap-2 justify-end">
            <Tab
              active={page === PAGES.BROWSE || page === PAGES.GROUP_DETAIL || page === PAGES.CREATE_GROUP || page === PAGES.PROFILE}
              label="Discover"
              onClick={() => navigate(PAGES.BROWSE)}
            />
            <Tab active={page === PAGES.EVENTS} label="Events" onClick={() => navigate(PAGES.EVENTS)} />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                if (page !== PAGES.BROWSE && page !== PAGES.EVENTS) {
                  navigate(PAGES.BROWSE)
                }
                focusDartmouthSignIn()
              }}
              className="inline-flex ml-2 items-center px-3 sm:px-4 py-2 rounded-full bg-ember text-ember-dark text-[11px] sm:text-xs font-bold tracking-wide shadow-ring hover:bg-ember-light transition-colors shrink-0"
            >
              <span className="sm:hidden">Dartmouth</span>
              <span className="hidden sm:inline">Dartmouth sign in</span>
            </button>
          </nav>
        </div>
      </header>

      {oauthGateError && (
        <div className="relative z-20 bg-red-50/95 border-b border-red-200/80 backdrop-blur-sm px-5 sm:px-8 py-3">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm font-semibold text-red-900">Sign-in issue</p>
            <p className="text-sm text-red-800 mt-1 whitespace-pre-wrap">{oauthGateError}</p>
          </div>
        </div>
      )}

      <main className="relative z-10 flex-1 w-full">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-16">{children}</div>
      </main>

      <footer className="relative z-10 border-t border-white/35 bg-white/25 backdrop-blur-md py-7 text-center text-[11px] text-warm-gray-500 px-6">
        <p>Joinme · Dartmouth community · Public guests can open the Events teaser without signing in.</p>
      </footer>
    </div>
  )
}
