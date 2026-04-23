import { useGroups } from '../../context/GroupsContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES, formatDateTimeRange, getDefaultGroupVisual, getGroupVisualById, getInitials, getAvatarColor } from '../../utils/constants'

const ACTION_PILL_STYLES = {
  ember: 'bg-ember text-ember-dark hover:bg-ember-light',
  green: 'bg-wise-mint text-ember-dark hover:bg-ember-light',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200/70 hover:bg-amber-100',
  bark: 'bg-bark text-white hover:bg-warm-gray-800',
  gray: 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed',
}

const PinIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
)

const ClockIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const PeopleIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
)

const LockIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
)

const GlobeIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
)

const ArrowIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
)

const HeartIcon = ({ className = 'w-4 h-4', filled = false }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    fill={filled ? 'currentColor' : 'none'}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)

function getCapacityStatus(current, max) {
  if (current >= max) return { label: 'Full', cls: 'bg-warm-gray-100 text-warm-gray-500' }
  const pct = current / max
  if (pct >= 0.75) return { label: 'Almost full', cls: 'bg-amber-50 text-amber-700' }
  return { label: 'Open', cls: 'bg-wise-mint text-ember-dark' }
}

export default function GroupCard({ group, className = '' }) {
  const { getActionState, handleAction } = useGroups()
  const { isFavorite, toggleFavorite, users, currentUser } = useAuth()
  const { navigate } = useNavigation()

  const actionState = getActionState(group)
  const favorited = isFavorite(group.id)
  const visual = getGroupVisualById(group.visualId) || getDefaultGroupVisual(group.name)
  const capacity = getCapacityStatus(group.memberIds.length, group.capacity)

  const owner = users.find((u) => u.id === group.ownerId)
    || (currentUser?.id === group.ownerId ? currentUser : null)
  const ownerName = owner?.displayName || 'Group host'

  const memberAvatars = group.memberIds.slice(0, 4).map((id) => {
    const u = users.find((x) => x.id === id) || (currentUser?.id === id ? currentUser : null)
    return {
      id,
      name: u?.displayName || 'Member',
      color: getAvatarColor(u?.displayName || id),
    }
  })
  const extraMembers = Math.max(0, group.memberIds.length - memberAvatars.length)

  const onAction = (e) => {
    e.stopPropagation()
    if (actionState.action === 'manage') {
      navigate(PAGES.GROUP_DETAIL, { groupId: group.id })
      return
    }
    handleAction(group, actionState)
  }

  const onFavorite = (e) => {
    e.stopPropagation()
    toggleFavorite(group.id)
  }

  const isOnline = group.meetingType === 'online'
  const isPublic = group.visibility === 'public'
  const locationLine = isOnline
    ? 'Online session'
    : group.meetingDetail || 'Dartmouth campus'

  return (
    <div
      onClick={() => navigate(PAGES.GROUP_DETAIL, { groupId: group.id })}
      className={`group bg-white rounded-2xl border border-warm-gray-200/70 p-4 cursor-pointer transition-all duration-200 hover:shadow-ring-strong hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <p
          className="text-[10px] font-bold tracking-[0.14em] uppercase"
          style={{ color: visual.colors[0] }}
        >
          {visual.badge}
        </p>
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${capacity.cls}`}>
            {capacity.label}
          </span>
          <button
            onClick={onFavorite}
            className="p-1 rounded-md text-warm-gray-300 hover:text-ember-dark hover:bg-wise-mint transition-colors"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon
              className={`w-3.5 h-3.5 transition-colors ${favorited ? 'text-ember-dark' : ''}`}
              filled={favorited}
            />
          </button>
        </div>
      </div>

      <h3 className="font-serif text-base text-bark leading-snug line-clamp-1 group-hover:text-ember-dark transition-colors">
        {group.name}
      </h3>

      {group.description && (
        <p className="mt-1 text-[13px] text-warm-gray-500 leading-snug line-clamp-2">
          {group.description}
        </p>
      )}

      <div className="mt-3 space-y-1 text-[12px] text-warm-gray-600">
        <div className="flex items-center gap-1.5 truncate">
          <PinIcon className="w-3.5 h-3.5 text-warm-gray-400 shrink-0" />
          <span className="truncate">{locationLine}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <ClockIcon className="w-3.5 h-3.5 text-warm-gray-400 shrink-0" />
          <span className="truncate">
            {group.dateTime ? formatDateTimeRange(group.dateTime, group.endDateTime) : 'Time to be announced'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-warm-gray-600">
          <span className="flex items-center gap-1.5">
            <PeopleIcon className="w-3.5 h-3.5 text-warm-gray-400" />
            <span className="tabular-nums">{group.memberIds.length}/{group.capacity}</span>
          </span>
          <span className="flex items-center gap-1.5">
            {isPublic ? (
              <GlobeIcon className="w-3.5 h-3.5 text-warm-gray-400" />
            ) : (
              <LockIcon className="w-3.5 h-3.5 text-warm-gray-400" />
            )}
            <span>{isPublic ? 'Public' : 'Private'}</span>
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-warm-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center min-w-0">
          <div className="flex -space-x-1.5">
            {memberAvatars.map((m) => (
              <span
                key={m.id}
                title={m.name}
                className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold ${m.color}`}
              >
                {getInitials(m.name)}
              </span>
            ))}
            {extraMembers > 0 && (
              <span className="w-6 h-6 rounded-full border-2 border-white bg-warm-gray-100 text-warm-gray-600 flex items-center justify-center text-[9px] font-bold">
                +{extraMembers}
              </span>
            )}
          </div>
          <span className="ml-2 text-[11px] text-warm-gray-500 truncate">
            Hosted by <span className="font-semibold text-warm-gray-700">{ownerName}</span>
          </span>
        </div>

        <button
          onClick={onAction}
          disabled={actionState.disabled}
          className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${ACTION_PILL_STYLES[actionState.style]} ${
            actionState.disabled ? '' : 'hover:scale-[1.04] active:scale-[0.97]'
          }`}
        >
          {actionState.label}
          {!actionState.disabled && actionState.action !== 'leave' && (
            <ArrowIcon className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  )
}
