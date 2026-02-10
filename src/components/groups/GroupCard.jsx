import { useGroups } from '../../context/GroupsContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES, formatDateTimeRange } from '../../utils/constants'
import CapacityBadge from './CapacityBadge'

const BUTTON_STYLES = {
  ember: 'bg-ember text-white hover:bg-ember-light',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200/60',
  bark: 'bg-bark text-cream hover:bg-warm-gray-800',
  gray: 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed',
}

export default function GroupCard({ group, className = '' }) {
  const { getActionState, handleAction } = useGroups()
  const { isFavorite, toggleFavorite } = useAuth()
  const { navigate } = useNavigation()
  const actionState = getActionState(group)
  const favorited = isFavorite(group.id)

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
      className={`card-base p-5 cursor-pointer group ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-bark leading-snug truncate group-hover:text-ember transition-colors">
            {group.name}
          </h3>
          <p className="text-xs text-warm-gray-400 mt-0.5">{group.title}</p>
        </div>
        <button
          onClick={onFavorite}
          className="shrink-0 p-1 rounded-md hover:bg-parchment transition-colors"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-4 h-4 transition-colors ${favorited ? 'text-ember fill-ember' : 'text-warm-gray-300 hover:text-warm-gray-400'}`}
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            fill={favorited ? 'currentColor' : 'none'}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-warm-gray-500 leading-relaxed line-clamp-2 mb-3">
        {group.description}
      </p>

      <div className="flex gap-1.5 flex-wrap mb-3">
        <span className="tag bg-parchment text-warm-gray-600 border border-warm-gray-200/60">
          {group.meetingType === 'online' ? 'Online' : 'In-Person'}
        </span>
        <span className="tag bg-parchment text-warm-gray-600 border border-warm-gray-200/60">
          {group.space === 'quiet' ? 'Quiet' : 'Loud'}
        </span>
        <span className={`tag border ${
          group.visibility === 'public'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
            : 'bg-amber-50 text-amber-700 border-amber-200/60'
        }`}>
          {group.visibility === 'public' ? 'Public' : 'Private'}
        </span>
      </div>

      {group.dateTime && (
        <p className="text-xs text-warm-gray-400 mb-3">
          {formatDateTimeRange(group.dateTime, group.endDateTime)}
        </p>
      )}

      <div className="mb-3">
        <CapacityBadge current={group.memberIds.length} max={group.capacity} />
      </div>

      <button
        onClick={onAction}
        disabled={actionState.disabled}
        className={`w-full py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${BUTTON_STYLES[actionState.style]} ${
          actionState.disabled ? '' : 'active:scale-[0.98]'
        }`}
      >
        {actionState.label}
      </button>
    </div>
  )
}
