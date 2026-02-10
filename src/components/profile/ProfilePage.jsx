import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGroups } from '../../context/GroupsContext'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES, isGroupArchived, getInitials, getAvatarColor } from '../../utils/constants'
import GroupCard from '../groups/GroupCard'
import EmptyState from '../shared/EmptyState'

const TABS = ['Active', 'Archived', 'Favorites']

export default function ProfilePage() {
  const { currentUser } = useAuth()
  const { groups } = useGroups()
  const { navigate } = useNavigation()
  const [tab, setTab] = useState('Active')

  const myGroups = useMemo(() =>
    groups.filter(g => g.memberIds.includes(currentUser?.id) || g.ownerId === currentUser?.id),
    [groups, currentUser]
  )

  const activeGroups = useMemo(() => myGroups.filter(g => !isGroupArchived(g)), [myGroups])
  const archivedGroups = useMemo(() => myGroups.filter(g => isGroupArchived(g)), [myGroups])
  const favoriteGroups = useMemo(() =>
    groups.filter(g => currentUser?.favoriteGroupIds?.includes(g.id)),
    [groups, currentUser]
  )

  const displayed = tab === 'Active' ? activeGroups
    : tab === 'Archived' ? archivedGroups
    : favoriteGroups

  const counts = { Active: activeGroups.length, Archived: archivedGroups.length, Favorites: favoriteGroups.length }

  return (
    <div>
      <div className="animate-fade-in mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(currentUser?.displayName)}`}>
            {getInitials(currentUser?.displayName)}
          </div>
          <div>
            <h2 className="font-serif text-3xl text-bark">{currentUser?.displayName}</h2>
            <p className="text-warm-gray-500 text-sm">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex bg-parchment/80 border border-warm-gray-200/60 rounded-lg p-0.5 mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-150 ${
              tab === t
                ? 'bg-white text-bark shadow-sm'
                : 'text-warm-gray-400 hover:text-warm-gray-600'
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((group, i) => (
            <GroupCard
              key={group.id}
              group={group}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
          }
          title={
            tab === 'Active' ? 'No active groups'
            : tab === 'Archived' ? 'No archived groups'
            : 'No favorites yet'
          }
          description={
            tab === 'Favorites'
              ? 'Heart a group to save it here'
              : 'Join or create a group to get started'
          }
          action={
            tab !== 'Archived' && (
              <button
                onClick={() => navigate(PAGES.BROWSE)}
                className="px-5 py-2.5 rounded-xl bg-ember text-white font-semibold text-sm hover:bg-ember-light active:scale-[0.98] transition-all duration-150"
              >
                Browse Groups
              </button>
            )
          }
        />
      )}
    </div>
  )
}
