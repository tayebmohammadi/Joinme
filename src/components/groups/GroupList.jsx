import GroupCard from './GroupCard'
import GroupFilters from './GroupFilters'
import EmptyState from '../shared/EmptyState'
import { useFilteredGroups } from '../../hooks/useFilteredGroups'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES } from '../../utils/constants'
import { useGroups } from '../../context/GroupsContext'

export default function GroupList() {
  const filters = useFilteredGroups()
  const { navigate } = useNavigation()
  const { groups } = useGroups()

  const totalMembers = groups.reduce((total, group) => {
    return total + group.memberIds.length
  }, 0)

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="font-serif text-3xl md:text-4xl mb-3 bg-gradient-to-r from-bark via-ember to-violet bg-clip-text text-transparent leading-tight">
          Discover Your Community
        </h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-glow-pulse" />
            <span className="text-sm text-warm-gray-500">
              <span className="font-semibold text-bark">{filters.totalActive}</span> active {filters.totalActive === 1 ? 'group' : 'groups'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ocean" />
            <span className="text-sm text-warm-gray-500">
              <span className="font-semibold text-bark">{totalMembers}</span> students connected
            </span>
          </div>
        </div>
      </div>

      <GroupFilters {...filters} />

      {filters.filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filters.filtered.map((group, i) => (
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          }
          title={filters.activeFilterCount > 0 ? 'No matching groups' : 'No groups yet'}
          description={
            filters.activeFilterCount > 0
              ? 'Try adjusting your filters or search terms'
              : 'Be the first to create a group!'
          }
          action={
            filters.activeFilterCount === 0 && (
              <button
                onClick={() => navigate(PAGES.CREATE_GROUP)}
                className="btn-primary"
              >
                Create Group
              </button>
            )
          }
        />
      )}
    </div>
  )
}
