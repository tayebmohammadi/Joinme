import { useNavigation } from '../../context/NavigationContext'
import { useGroups } from '../../context/GroupsContext'
import { useAuth } from '../../context/AuthContext'
import { PAGES, isGroupArchived } from '../../utils/constants'

const BrowseIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
  </svg>
)

const CreateIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const ProfileIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
)

export default function Sidebar() {
  const { page, navigate } = useNavigation()
  const { groups } = useGroups()
  const { currentUser } = useAuth()

  const activeGroups = groups.filter(g => !isGroupArchived(g))
  const myGroups = activeGroups.filter(g =>
    g.memberIds.includes(currentUser?.id) || g.ownerId === currentUser?.id
  )

  const items = [
    { page: PAGES.BROWSE, label: 'Browse', icon: BrowseIcon, count: activeGroups.length },
    { page: PAGES.CREATE_GROUP, label: 'Create Group', icon: CreateIcon, count: null },
    { page: PAGES.PROFILE, label: 'My Profile', icon: ProfileIcon, count: myGroups.length },
  ]

  return (
    <nav className="w-56 shrink-0 pr-6 border-r border-warm-gray-200/60 hidden lg:block">
      <div className="space-y-1 sticky top-24">
        <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-[0.15em] mb-3 pl-3">
          Navigation
        </p>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = page === item.page
          return (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                isActive
                  ? 'bg-white/80 text-bark shadow-sm border border-warm-gray-200/60'
                  : 'text-warm-gray-500 hover:text-bark hover:bg-white/40'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-ember to-violet" />
              )}
              <span className={`transition-colors duration-300 ${isActive ? 'text-ember' : 'text-warm-gray-400 group-hover:text-warm-gray-600'}`}>
                <Icon />
              </span>
              <span>{item.label}</span>
              {item.count !== null && (
                <span className={`ml-auto text-[10px] font-bold rounded-full px-1.5 py-0.5 transition-colors duration-300 ${
                  isActive ? 'bg-gradient-to-r from-ember/10 to-violet/10 text-ember' : 'bg-warm-gray-100 text-warm-gray-400'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          )
        })}

        <div className="!mt-6 px-3">
          <div className="h-px bg-gradient-to-r from-warm-gray-200/60 via-warm-gray-200 to-warm-gray-200/60 mb-4" />
          <div className="flex items-center gap-1.5 text-[10px] text-warm-gray-400 uppercase tracking-wider font-bold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
            Live Stats
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-warm-gray-500">Active groups</p>
              <p className="text-xs font-bold text-bark">{activeGroups.length}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-warm-gray-500">Your groups</p>
              <p className="text-xs font-bold text-bark">{myGroups.length}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
