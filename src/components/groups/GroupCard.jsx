import { useGroups } from '../../context/GroupsContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES, formatDateTimeRange, getDefaultGroupVisual, getGroupVisualById } from '../../utils/constants'
import CapacityBadge from './CapacityBadge'

const BUTTON_STYLES = {
  ember: 'bg-gradient-to-r from-ember to-ember-light text-white hover:shadow-glow-orange',
  green: 'bg-gradient-to-r from-forest to-forest-light text-white hover:shadow-glow-green',
  amber: 'bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:shadow-lg',
  bark: 'bg-gradient-to-r from-bark to-warm-gray-800 text-cream hover:shadow-lg',
  gray: 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed',
}

export default function GroupCard({ group, className = '' }) {
  const { getActionState, handleAction } = useGroups()
  const { isFavorite, toggleFavorite } = useAuth()
  const { navigate } = useNavigation()
  const actionState = getActionState(group)
  const favorited = isFavorite(group.id)
  const visual = getGroupVisualById(group.visualId) || getDefaultGroupVisual(group.name)
  const date = group.dateTime ? new Date(group.dateTime) : null
  const month = date ? date.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'TBD'
  const day = date ? date.getDate() : '--'

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

  return (
    <div
      onClick={() => navigate(PAGES.GROUP_DETAIL, { groupId: group.id })}
      className={`card-base p-0 overflow-hidden cursor-pointer group ${className}`}
    >
      <div className="relative h-40" style={{ background: `linear-gradient(135deg, ${visual.colors[0]}, ${visual.colors[1]})` }}>
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(115deg,rgba(255,255,255,0.55)_0%,transparent_28%,transparent_58%,rgba(255,255,255,0.45)_100%)]" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.9)_0,transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.7)_0,transparent_25%)]" />
        <div className="absolute right-4 bottom-4 rounded-lg border border-white/40 px-3 py-1.5 bg-black/10">
          <p className="text-[11px] font-bold tracking-[0.08em] text-white">{visual.badge}</p>
        </div>
        <div className="absolute left-3 top-3 rounded-xl bg-white px-2.5 py-1.5 text-center shadow-md">
          <p className="text-[10px] font-bold tracking-wide text-ember">{month}</p>
          <p className="text-sm font-bold text-bark leading-none mt-0.5">{day}</p>
        </div>
        <button
          onClick={onFavorite}
          className="absolute right-3 top-3 shrink-0 p-1.5 rounded-lg bg-white/95 hover:bg-white transition-all duration-200 hover:scale-110"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-4 h-4 transition-all duration-300 ${favorited ? 'text-ember fill-ember' : 'text-warm-gray-300 hover:text-warm-gray-400'}`}
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            fill={favorited ? 'currentColor' : 'none'}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="font-serif text-lg text-bark leading-snug truncate group-hover:text-ember transition-colors duration-300">
              {group.name}
            </h3>
            <p className="text-[11px] text-warm-gray-400 mt-0.5 font-medium tracking-wide">{group.title}</p>
          </div>
        </div>

        <p className="text-sm text-warm-gray-500 leading-relaxed line-clamp-2 mb-4">
          {group.description}
        </p>

        <p className="mb-3 text-xs font-semibold text-warm-gray-600">
          {group.dateTime ? formatDateTimeRange(group.dateTime, group.endDateTime) : 'Time to be announced'}
        </p>

        <p className="mb-4 text-xs text-warm-gray-500 truncate">
          {group.meetingType === 'online' ? 'Online session' : `At ${group.meetingDetail || 'Dartmouth campus'}`}
        </p>

        <div className="flex gap-1.5 flex-wrap mb-4">
          <span className={`tag ${
            group.meetingType === 'online'
              ? 'bg-ocean/10 text-ocean border border-ocean/15'
              : 'bg-violet/10 text-violet border border-violet/15'
          }`}>
            {group.meetingType === 'online' ? 'Online' : 'In-Person'}
          </span>
          <span className={`tag ${
            group.visibility === 'public'
              ? 'bg-forest/10 text-forest border border-forest/15'
              : 'bg-warm-gray-100 text-warm-gray-500 border border-warm-gray-200/60'
          }`}>
            {group.visibility === 'public' ? 'Public' : 'Private'}
          </span>
        </div>

        <div className="mb-4">
          <CapacityBadge current={group.memberIds.length} max={group.capacity} />
        </div>

        <button
          onClick={onAction}
          disabled={actionState.disabled}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${BUTTON_STYLES[actionState.style]} ${
            actionState.disabled ? '' : 'active:scale-[0.98]'
          }`}
        >
          {actionState.label}
        </button>
      </div>
    </div>
  )
}
