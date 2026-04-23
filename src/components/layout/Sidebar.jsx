import { useNavigation } from '../../context/NavigationContext'
import { useGroups } from '../../context/GroupsContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../shared/Toast'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { PAGES, isGroupArchived, getInitials, getAvatarColor } from '../../utils/constants'

const HomeIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12 12 3l9.75 9M4.5 9.75V21h5.25v-6h4.5v6H19.5V9.75" />
  </svg>
)

const BookmarkIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
  </svg>
)

const InboxIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.671 1.09-.085 2.17-.207 3.238-.364 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
)

const CollectionIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
  </svg>
)

const ProfileIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z" />
  </svg>
)

const PlusIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const SearchIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)

const ClockIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const PanelToggleIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5v13.5H3.75zM9 5.25v13.5" />
  </svg>
)

const PhoneIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5h-6A1.5 1.5 0 0 0 3 3v18a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 21V12m0-9-9 9m9-9h-5.25M21 3v5.25" />
  </svg>
)

const SignInIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
  </svg>
)

const SignOutIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
  </svg>
)

const BrandLogo = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-full bg-ember flex items-center justify-center shadow-ring`}>
    <svg className="w-4 h-4 text-ember-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  </div>
)

export default function Sidebar() {
  const { page, params, navigate, recentGroupIds, clearRecentGroups } = useNavigation()
  const { groups } = useGroups()
  const { currentUser, logout } = useAuth()
  const { addToast } = useToast()
  const [collapsed, setCollapsed] = useLocalStorage('joinme_sidebar_collapsed', false)

  const isGuest = !currentUser || currentUser.id === 'guest-user'

  const activeGroups = groups.filter((g) => !isGroupArchived(g))
  const myGroups = activeGroups.filter(
    (g) => g.memberIds.includes(currentUser?.id) || g.ownerId === currentUser?.id
  )
  const favoriteGroups = groups.filter((g) =>
    currentUser?.favoriteGroupIds?.includes(g.id)
  )
  const recentGroups = (recentGroupIds || [])
    .map((id) => groups.find((g) => g.id === id))
    .filter(Boolean)
    .slice(0, 5)

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, page: PAGES.BROWSE, count: activeGroups.length },
    { id: 'inbox', label: 'Events', icon: InboxIcon, page: PAGES.EVENTS },
    { id: 'bookmarks', label: 'Favorites', icon: BookmarkIcon, page: PAGES.PROFILE, count: favoriteGroups.length, params: { tab: 'Favorites' } },
    { id: 'collections', label: 'My Groups', icon: CollectionIcon, page: PAGES.PROFILE, count: myGroups.length, params: { tab: 'Active' } },
    { id: 'profile', label: 'Profile', icon: ProfileIcon, page: PAGES.PROFILE },
  ]

  const isItemActive = (item) => {
    if (page !== item.page) return false
    if (item.page !== PAGES.PROFILE) return true
    const currentTab = params?.tab
    if (item.id === 'bookmarks') return currentTab === 'Favorites'
    if (item.id === 'collections') return currentTab === 'Active'
    if (item.id === 'profile') return !currentTab
    return false
  }

  const handleSignIn = () => {
    if (isGuest) {
      addToast('Sign in is coming soon — you are browsing as a guest', 'info')
      return
    }
    logout()
    addToast('Signed out', 'success')
  }

  const handleInstall = () => {
    addToast('App install will be available soon', 'info')
  }

  const goToRecent = (groupId) => {
    navigate(PAGES.GROUP_DETAIL, { groupId })
  }

  return (
    <aside
      className={`shrink-0 h-screen flex flex-col bg-white border-r border-warm-gray-200/70 transition-[width] duration-200 ease-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16 px-4 border-b border-warm-gray-200/60`}>
        {!collapsed && (
          <button
            onClick={() => navigate(PAGES.BROWSE)}
            className="flex items-center gap-2.5 group"
          >
            <BrandLogo />
            <span className="font-bold text-lg tracking-tight text-bark group-hover:text-ember-dark transition-colors">
              Joinme
            </span>
          </button>
        )}
        {collapsed && (
          <button onClick={() => navigate(PAGES.BROWSE)} className="group">
            <BrandLogo />
          </button>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-1.5 rounded-lg text-warm-gray-400 hover:text-bark hover:bg-warm-gray-100 transition-colors"
            title="Collapse sidebar"
          >
            <PanelToggleIcon />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center pt-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-1.5 rounded-lg text-warm-gray-400 hover:text-bark hover:bg-warm-gray-100 transition-colors"
            title="Expand sidebar"
          >
            <PanelToggleIcon />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 pt-4">
        {!collapsed && (
          <button
            onClick={() => navigate(PAGES.CREATE_GROUP)}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-sm font-semibold mb-3 transition-all duration-150 ${
              page === PAGES.CREATE_GROUP
                ? 'bg-ember text-ember-dark shadow-ring hover:scale-[1.02] active:scale-[0.97]'
                : 'bg-bark text-white hover:bg-warm-gray-800 hover:scale-[1.02] active:scale-[0.97]'
            }`}
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Group</span>
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => navigate(PAGES.CREATE_GROUP)}
            title="New Group"
            className={`w-full flex items-center justify-center p-2.5 rounded-full mb-3 transition-all duration-150 ${
              page === PAGES.CREATE_GROUP
                ? 'bg-ember text-ember-dark shadow-ring hover:scale-[1.05] active:scale-[0.97]'
                : 'bg-bark text-white hover:bg-warm-gray-800 hover:scale-[1.05] active:scale-[0.97]'
            }`}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        )}

        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isItemActive(item)
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.page, item.params || {})}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-bark shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] border border-warm-gray-200/70'
                    : 'text-warm-gray-600 hover:text-bark hover:bg-warm-gray-100/70'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-bark' : 'text-warm-gray-500'}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count != null && item.count > 0 && (
                      <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-warm-gray-100 text-warm-gray-500">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </div>

        {!collapsed && (
          <>
            <div className="my-4 mx-1 h-px bg-warm-gray-200/70" />

            <div className="px-2 flex items-center justify-between">
              <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-[0.18em]">
                Recent Groups
              </p>
              <button
                onClick={() => navigate(PAGES.BROWSE)}
                className="p-1 rounded-md text-warm-gray-400 hover:text-bark hover:bg-warm-gray-100 transition-colors"
                title="Browse all groups"
              >
                <SearchIcon />
              </button>
            </div>

            <div className="mt-2">
              {recentGroups.length === 0 ? (
                <div className="mt-6 text-center px-4 pb-6">
                  <div className="w-10 h-10 rounded-full bg-warm-gray-100 flex items-center justify-center mx-auto mb-3 text-warm-gray-400">
                    <ClockIcon />
                  </div>
                  <p className="text-sm font-semibold text-bark">Your recent groups</p>
                  <p className="mt-1 text-xs text-warm-gray-500 leading-snug">
                    {isGuest
                      ? 'Sign in to save your activity and pick up where you left off.'
                      : 'Open a group and it will show up here.'}
                  </p>
                  {isGuest && (
                    <button
                      onClick={handleSignIn}
                      className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bark text-white text-xs font-semibold hover:bg-warm-gray-800 transition-colors"
                    >
                      <SignInIcon className="w-3.5 h-3.5" />
                      Sign in
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-0.5">
                  {recentGroups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => goToRecent(g.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-warm-gray-600 hover:text-bark hover:bg-warm-gray-100/70 transition-colors"
                    >
                      <span className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-[10px] font-bold ${getAvatarColor(g.name)}`}>
                        {getInitials(g.name)}
                      </span>
                      <span className="text-xs font-medium truncate">{g.name}</span>
                    </button>
                  ))}
                  <button
                    onClick={clearRecentGroups}
                    className="w-full text-left px-3 py-1.5 text-[11px] text-warm-gray-400 hover:text-bark transition-colors"
                  >
                    Clear recent
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className={`border-t border-warm-gray-200/60 ${collapsed ? 'p-2' : 'p-3'} space-y-1`}>
        <button
          onClick={handleInstall}
          title={collapsed ? 'Install App' : undefined}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium text-warm-gray-600 hover:text-bark hover:bg-warm-gray-100 transition-colors`}
        >
          <PhoneIcon className="w-5 h-5" />
          {!collapsed && <span>Install App</span>}
        </button>
        <button
          onClick={handleSignIn}
          title={collapsed ? (isGuest ? 'Sign in' : 'Sign out') : undefined}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium text-warm-gray-600 hover:text-bark hover:bg-warm-gray-100 transition-colors`}
        >
          {isGuest ? <SignInIcon className="w-5 h-5" /> : <SignOutIcon className="w-5 h-5" />}
          {!collapsed && (
            <span className="flex-1 text-left">
              {isGuest ? 'Sign in' : 'Sign out'}
            </span>
          )}
          {!collapsed && !isGuest && currentUser && (
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(currentUser.displayName)}`}>
              {getInitials(currentUser.displayName)}
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
