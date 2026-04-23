import { useState, useRef } from 'react'
import { useGroups } from '../../context/GroupsContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { useToast } from '../shared/Toast'
import {
  PAGES,
  formatDateTimeRange,
  getDefaultGroupVisual,
  getGroupVisualById,
  getCategoryById,
  getWaitlistCapacity,
  isGroupArchived,
} from '../../utils/constants'
import CapacityBadge from './CapacityBadge'
import MemberList from './MemberList'
import JoinRequestList from './JoinRequestList'
import Modal from '../shared/Modal'

const ACTION_BUTTON_STYLES = {
  ember: 'bg-ember text-ember-dark hover:bg-ember-light hover:scale-[1.03] active:scale-[0.97] shadow-ring',
  green: 'bg-wise-mint text-ember-dark border border-ember/30 hover:bg-ember-light',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200/70',
  bark: 'bg-bark text-white hover:bg-warm-gray-800 hover:scale-[1.03] active:scale-[0.97] shadow-ring',
  gray: 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed',
}

const CalendarIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
)

const PinIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
)

const PeopleIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72M3 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m12-3a3 3 0 1 0-6 0M12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </svg>
)

const ShieldIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 5.25-3.75 9-9 9s-9-3.75-9-9 3.75-9 9-9 9 3.75 9 9Z" />
  </svg>
)

const RepeatIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
)

const SoundIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
)

const LinkIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  </svg>
)

const PencilIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
  </svg>
)

const MegaphoneIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
  </svg>
)

const ArchiveIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
)

const TrashIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)

const InboxIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
  </svg>
)

function recurrenceLabel(recurrence) {
  switch (recurrence) {
    case 'daily':
      return 'Daily'
    case 'weekly':
      return 'Weekly'
    case 'biweekly':
      return 'Every 2 weeks'
    case 'custom-weekdays':
      return 'Custom weekdays'
    default:
      return 'One-time'
  }
}

function StatTile({ label, value, sub, accent = 'mint' }) {
  const cls = {
    mint: 'bg-wise-mint text-ember-dark',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/70',
    gray: 'bg-warm-gray-100 text-warm-gray-700',
  }[accent]
  return (
    <div className={`flex-1 min-w-0 rounded-xl px-3 py-2.5 ${cls}`}>
      <p className="text-[9px] font-bold tracking-[0.14em] uppercase opacity-80">{label}</p>
      <p className="text-lg font-bold leading-none mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-[10px] opacity-70 mt-1 truncate">{sub}</p>}
    </div>
  )
}

function OwnerActionRow({ icon: Icon, label, hint, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors press ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-bark hover:bg-warm-gray-100/70'
      }`}
    >
      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
        danger ? 'bg-red-50 text-red-500' : 'bg-warm-gray-100 text-warm-gray-600'
      }`}>
        <Icon className="w-4 h-4" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold leading-tight">{label}</span>
        {hint && <span className="block text-[11px] text-warm-gray-500 leading-tight mt-0.5">{hint}</span>}
      </span>
    </button>
  )
}

export default function GroupDetail({ groupId }) {
  const {
    getGroup,
    getActionState,
    handleAction,
    approveRequest,
    denyRequest,
    removeMember,
    deleteGroup,
  } = useGroups()
  const { isFavorite, toggleFavorite, currentUser, users } = useAuth()
  const { navigate, goBack } = useNavigation()
  const { addToast } = useToast()
  const [deleteModal, setDeleteModal] = useState(false)
  const requestsRef = useRef(null)

  const group = getGroup(groupId)
  if (!group) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h3 className="font-serif text-2xl text-bark mb-2">Group not found</h3>
        <p className="text-sm text-warm-gray-500 mb-4">It may have been removed.</p>
        <button
          onClick={() => navigate(PAGES.BROWSE)}
          className="text-sm font-semibold text-ember-dark hover:text-wise-positive transition-colors"
        >
          Back to Browse
        </button>
      </div>
    )
  }

  const actionState = getActionState(group)
  const isOwner = group.ownerId === currentUser?.id
  const archived = isGroupArchived(group)
  const waitlistCap = getWaitlistCapacity(group.capacity)
  const visual = getGroupVisualById(group.visualId) || getDefaultGroupVisual(group.name)
  const category = getCategoryById(visual.category)
  const startDate = group.dateTime ? new Date(group.dateTime) : null
  const owner = users.find((u) => u.id === group.ownerId)
    || (currentUser?.id === group.ownerId ? currentUser : null)
  const recurrence = recurrenceLabel(group.recurrence || 'none')
  const favorited = isFavorite(group.id)

  const onAction = () => {
    if (actionState.action === 'manage') return
    handleAction(group, actionState)
  }

  const onDelete = () => {
    deleteGroup(group.id)
    navigate(PAGES.BROWSE)
  }

  const inviteLink = `${window.location.origin}${window.location.pathname}#group=${group.id}`

  const onCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      addToast('Invite link copied to clipboard', 'success')
    } catch {
      addToast('Could not copy — try again', 'error')
    }
  }

  const onEdit = () => addToast('Editing groups is coming soon', 'info')
  const onAnnounce = () => addToast('Announcements are coming soon', 'info')
  const onArchive = () => addToast('Archive flow is coming soon', 'info')

  const scrollToRequests = () => {
    requestsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sectionClass = 'rounded-2xl border border-warm-gray-200/70 bg-white p-6'
  const sectionTitleClass = 'text-xs font-bold tracking-[0.18em] uppercase text-warm-gray-400 mb-4'

  const pendingCount = group.joinRequests.length
  const waitlistCount = group.waitlistIds.length
  const memberCount = group.memberIds.length
  const capacityPct = Math.min(100, Math.round((memberCount / group.capacity) * 100))

  return (
    <div className="animate-fade-in">
      <button
        onClick={goBack}
        className="inline-flex items-center gap-1.5 text-sm text-warm-gray-500 hover:text-bark transition-colors mb-5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      <div
        className="relative overflow-hidden rounded-3xl shadow-sm border border-warm-gray-200/60 mb-6"
        style={{ background: `linear-gradient(135deg, ${visual.colors[0]}, ${visual.colors[1]})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="relative h-56 sm:h-64 px-6 sm:px-8 flex flex-col">
          <div className="pt-5 flex items-start justify-between gap-3">
            {startDate ? (
              <div className="rounded-2xl bg-white px-3 py-2 text-center shadow-md">
                <p className="text-[10px] font-bold tracking-wide text-ember-dark">
                  {startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                </p>
                <p className="text-xl font-bold text-bark leading-none mt-0.5">
                  {startDate.getDate()}
                </p>
                <p className="text-[10px] text-warm-gray-500 mt-1">
                  {startDate.toLocaleString('en-US', { weekday: 'short' })}
                </p>
              </div>
            ) : <span />}

            <div className="flex items-center gap-2">
              {isOwner && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] text-ember-dark bg-ember rounded-full px-2.5 py-1 shadow-ring uppercase">
                  <ShieldIcon className="w-3 h-3" />
                  Owner
                </span>
              )}
              <button
                onClick={() => toggleFavorite(group.id)}
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/95 hover:bg-white transition-all shadow-sm hover:scale-105"
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${favorited ? 'text-ember-dark fill-ember-dark' : 'text-warm-gray-400'}`}
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  fill={favorited ? 'currentColor' : 'none'}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-auto pb-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center text-[10px] font-bold tracking-[0.12em] text-white bg-black/30 backdrop-blur rounded px-2 py-1">
                {visual.badge}
              </span>
              {category && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-white/15 backdrop-blur rounded-full px-2.5 py-1">
                  <span>{category.emoji}</span>
                  <span>{category.label}</span>
                </span>
              )}
              {archived && (
                <span className="inline-flex items-center text-[10px] font-bold tracking-[0.12em] text-white bg-bark/60 backdrop-blur rounded-full px-2.5 py-1 uppercase">
                  Archived
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight drop-shadow-sm">
              {group.name}
            </h1>
            {group.title && (
              <p className="mt-1.5 text-sm sm:text-base text-white/85">{group.title}</p>
            )}
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button onClick={onEdit} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-warm-gray-200 text-xs font-semibold text-bark hover:bg-warm-gray-100 press">
            <PencilIcon className="w-3.5 h-3.5" />
            Edit details
          </button>
          <button onClick={onCopyInvite} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-ember text-ember-dark text-xs font-semibold shadow-ring press">
            <LinkIcon className="w-3.5 h-3.5" />
            Copy invite link
          </button>
          <button onClick={onAnnounce} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-warm-gray-200 text-xs font-semibold text-bark hover:bg-warm-gray-100 press">
            <MegaphoneIcon className="w-3.5 h-3.5" />
            Announce
          </button>
          <button onClick={onArchive} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-warm-gray-200 text-xs font-semibold text-warm-gray-700 hover:bg-warm-gray-100 press">
            <ArchiveIcon className="w-3.5 h-3.5" />
            Archive
          </button>
          <button onClick={() => setDeleteModal(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 press ml-auto">
            <TrashIcon className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
        <div className="space-y-6 min-w-0">
          {isOwner && pendingCount > 0 && (
            <section className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 sm:p-5 flex items-center gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <InboxIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-bark">
                  {pendingCount} {pendingCount === 1 ? 'person is' : 'people are'} waiting to join
                </p>
                <p className="text-xs text-warm-gray-600 mt-0.5">
                  Approve or deny requests to keep your group moving.
                </p>
              </div>
              <button
                onClick={scrollToRequests}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-full bg-bark text-white text-xs font-semibold press"
              >
                Review
              </button>
            </section>
          )}

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>About</h2>
            <p className="text-sm text-warm-gray-700 leading-relaxed whitespace-pre-line">
              {group.description}
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <span className="inline-flex items-center justify-center text-xs font-medium text-warm-gray-600 bg-warm-gray-100 rounded-lg px-3 py-1.5">
                {group.meetingType === 'online' ? 'Online' : 'In-Person'}
              </span>
              <span className="inline-flex items-center justify-center text-xs font-medium text-warm-gray-600 bg-warm-gray-100 rounded-lg px-3 py-1.5">
                {group.visibility === 'public' ? 'Public' : 'Private'}
              </span>
              <span className="inline-flex items-center justify-center text-xs font-medium text-warm-gray-600 bg-warm-gray-100 rounded-lg px-3 py-1.5 capitalize">
                {group.space}
              </span>
              <span className="inline-flex items-center justify-center text-xs font-medium text-warm-gray-600 bg-warm-gray-100 rounded-lg px-3 py-1.5">
                {recurrence}
              </span>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-warm-gray-400">
                  Members
                </h2>
                <span className="text-[11px] font-semibold text-warm-gray-500 tabular-nums">
                  {memberCount}/{group.capacity}
                </span>
              </div>
              {isOwner && (
                <button
                  onClick={onCopyInvite}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-wise-mint text-ember-dark text-[11px] font-semibold press"
                >
                  <LinkIcon className="w-3 h-3" />
                  Invite
                </button>
              )}
            </div>
            <MemberList
              memberIds={group.memberIds}
              ownerId={group.ownerId}
              onRemove={isOwner ? (userId) => removeMember(group.id, userId) : null}
            />
          </section>

          {isOwner && (
            <section ref={requestsRef} className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-warm-gray-400">
                  Join Requests
                </h2>
                {pendingCount > 0 ? (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full px-2 py-0.5">
                    {pendingCount} pending
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-warm-gray-500">
                    None pending
                  </span>
                )}
              </div>
              {pendingCount > 0 ? (
                <JoinRequestList
                  requests={group.joinRequests}
                  onApprove={(userId) => approveRequest(group.id, userId)}
                  onDeny={(userId) => denyRequest(group.id, userId)}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-warm-gray-200 px-4 py-5 text-center">
                  <div className="w-9 h-9 mx-auto rounded-full bg-warm-gray-100 text-warm-gray-400 flex items-center justify-center mb-2">
                    <InboxIcon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-bark">No pending requests</p>
                  <p className="text-xs text-warm-gray-500 mt-1">
                    {group.visibility === 'public'
                      ? 'Public groups don’t require approval — people join directly.'
                      : 'When someone asks to join, they’ll show up here.'}
                  </p>
                </div>
              )}
            </section>
          )}

          {isOwner && (
            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-warm-gray-400">
                  Waitlist
                </h2>
                <span className="text-[11px] font-semibold text-warm-gray-500 tabular-nums">
                  {waitlistCount}/{waitlistCap}
                </span>
              </div>
              {waitlistCount > 0 ? (
                <MemberList
                  memberIds={group.waitlistIds}
                  ownerId={group.ownerId}
                  onRemove={null}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-warm-gray-200 px-4 py-5 text-center">
                  <div className="w-9 h-9 mx-auto rounded-full bg-warm-gray-100 text-warm-gray-400 flex items-center justify-center mb-2">
                    <PeopleIcon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-bark">Waitlist is empty</p>
                  <p className="text-xs text-warm-gray-500 mt-1">
                    People will join the waitlist when your group fills up.
                  </p>
                </div>
              )}
            </section>
          )}

          {isOwner && (
            <section className="rounded-2xl border border-red-200/70 bg-red-50/40 p-6">
              <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-red-600 mb-2">
                Danger Zone
              </h2>
              <p className="text-sm text-warm-gray-600 mb-4">
                Deleting this group will permanently remove it and all its data. This can&apos;t be undone.
              </p>
              <button
                onClick={() => setDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-100 press"
              >
                <TrashIcon className="w-4 h-4" />
                Delete Group
              </button>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-6 self-start space-y-4">
          {!isOwner && !archived && (
            <div className={sectionClass}>
              <button
                onClick={onAction}
                disabled={actionState.disabled}
                className={`w-full py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-150 ${ACTION_BUTTON_STYLES[actionState.style]}`}
              >
                {actionState.label}
              </button>

              <div className="mt-5">
                <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider mb-2">
                  Capacity
                </p>
                <CapacityBadge current={memberCount} max={group.capacity} />
                {waitlistCount > 0 && (
                  <p className="text-[11px] text-warm-gray-500 mt-1.5">
                    {waitlistCount}/{waitlistCap} on waitlist
                  </p>
                )}
              </div>
            </div>
          )}

          {!isOwner && archived && (
            <div className={sectionClass}>
              <div className="px-3 py-2.5 rounded-xl bg-warm-gray-100 text-center">
                <p className="text-xs font-bold text-warm-gray-600 tracking-wide">ARCHIVED</p>
                <p className="text-[11px] text-warm-gray-500 mt-0.5">This group has ended</p>
              </div>
              <div className="mt-5">
                <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider mb-2">
                  Capacity
                </p>
                <CapacityBadge current={memberCount} max={group.capacity} />
              </div>
            </div>
          )}

          {isOwner && (
            <>
              <div className={sectionClass}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex w-7 h-7 rounded-lg bg-ember items-center justify-center text-ember-dark">
                    <ShieldIcon className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-bark leading-none">Owner controls</p>
                    <p className="text-[11px] text-warm-gray-500 mt-0.5">Manage your group</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <StatTile label="Members" value={`${memberCount}/${group.capacity}`} sub={`${capacityPct}% full`} accent="mint" />
                  <StatTile label="Pending" value={pendingCount} sub={pendingCount > 0 ? 'needs review' : 'all clear'} accent={pendingCount > 0 ? 'amber' : 'gray'} />
                  <StatTile label="Waitlist" value={waitlistCount} sub={`of ${waitlistCap}`} accent="gray" />
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider mb-2">
                    Capacity
                  </p>
                  <CapacityBadge current={memberCount} max={group.capacity} />
                </div>

                <div className="-mx-2 space-y-0.5">
                  <OwnerActionRow
                    icon={LinkIcon}
                    label="Copy invite link"
                    hint="Share with anyone on campus"
                    onClick={onCopyInvite}
                  />
                  <OwnerActionRow
                    icon={PencilIcon}
                    label="Edit details"
                    hint="Coming soon"
                    onClick={onEdit}
                  />
                  <OwnerActionRow
                    icon={MegaphoneIcon}
                    label="Send announcement"
                    hint="Notify all members"
                    onClick={onAnnounce}
                  />
                  <OwnerActionRow
                    icon={ArchiveIcon}
                    label="Archive group"
                    hint="Hide from browse"
                    onClick={onArchive}
                  />
                  <div className="my-2 mx-2 h-px bg-warm-gray-100" />
                  <OwnerActionRow
                    icon={TrashIcon}
                    label="Delete group"
                    hint="This can’t be undone"
                    onClick={() => setDeleteModal(true)}
                    danger
                  />
                </div>
              </div>

              <div className={sectionClass}>
                <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-warm-gray-400 mb-4">
                  Quick Facts
                </h3>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3">
                    <CalendarIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">When</p>
                      <p className="text-sm text-bark font-medium">
                        {group.dateTime ? formatDateTimeRange(group.dateTime, group.endDateTime) : 'TBD'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <PinIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">Where</p>
                      <p className="text-sm text-bark font-medium truncate">
                        {group.meetingType === 'online'
                          ? group.meetingDetail || 'Online'
                          : group.meetingDetail || 'Dartmouth campus'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <SoundIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">Vibe</p>
                      <p className="text-sm text-bark font-medium capitalize">{group.space}</p>
                    </div>
                  </li>
                  {group.recurrence && group.recurrence !== 'none' && (
                    <li className="flex items-start gap-3">
                      <RepeatIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">Repeats</p>
                        <p className="text-sm text-bark font-medium">{recurrence}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}

          {!isOwner && (
            <div className={sectionClass}>
              <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-warm-gray-400 mb-4">
                Quick Facts
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <CalendarIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">When</p>
                    <p className="text-sm text-bark font-medium">
                      {group.dateTime ? formatDateTimeRange(group.dateTime, group.endDateTime) : 'TBD'}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <PinIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">Where</p>
                    <p className="text-sm text-bark font-medium truncate">
                      {group.meetingType === 'online'
                        ? group.meetingDetail || 'Online'
                        : group.meetingDetail || 'Dartmouth campus'}
                    </p>
                  </div>
                </li>
                {owner && (
                  <li className="flex items-start gap-3">
                    <PeopleIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">Host</p>
                      <p className="text-sm text-bark font-medium truncate">{owner.displayName}</p>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <SoundIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">Vibe</p>
                    <p className="text-sm text-bark font-medium capitalize">{group.space}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">Visibility</p>
                    <p className="text-sm text-bark font-medium">
                      {group.visibility === 'public' ? 'Public' : 'Private'}
                    </p>
                  </div>
                </li>
                {group.recurrence && group.recurrence !== 'none' && (
                  <li className="flex items-start gap-3">
                    <RepeatIcon className="w-4 h-4 mt-0.5 text-warm-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider">Repeats</p>
                      <p className="text-sm text-bark font-medium">{recurrence}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Group?">
        <p className="text-sm text-warm-gray-600 mb-4">
          This will permanently remove{' '}
          <span className="font-semibold text-bark">{group.name}</span> and all its data. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteModal(false)}
            className="flex-1 py-2.5 rounded-full bg-white border border-warm-gray-200 text-sm font-semibold text-warm-gray-600 hover:text-bark transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-[0.97] transition-all"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
