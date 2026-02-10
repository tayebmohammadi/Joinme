import { useGroups } from '../../context/GroupsContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { PAGES, formatDateTimeRange, getWaitlistCapacity, isGroupArchived } from '../../utils/constants'
import CapacityBadge from './CapacityBadge'
import MemberList from './MemberList'
import JoinRequestList from './JoinRequestList'
import Modal from '../shared/Modal'
import { useState } from 'react'

const BUTTON_STYLES = {
  ember: 'bg-ember text-white hover:bg-ember-light',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200/60',
  bark: 'bg-bark text-cream hover:bg-warm-gray-800',
  gray: 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed',
}

export default function GroupDetail({ groupId }) {
  const { getGroup, getActionState, handleAction, approveRequest, denyRequest, removeMember, deleteGroup } = useGroups()
  const { isFavorite, toggleFavorite, currentUser } = useAuth()
  const { navigate, goBack } = useNavigation()
  const [deleteModal, setDeleteModal] = useState(false)

  const group = getGroup(groupId)
  if (!group) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <h3 className="font-serif text-xl text-bark mb-1">Group not found</h3>
        <button onClick={() => navigate(PAGES.BROWSE)} className="text-sm text-ember hover:text-ember-light transition-colors mt-2">
          Back to Browse
        </button>
      </div>
    )
  }

  const actionState = getActionState(group)
  const isOwner = group.ownerId === currentUser?.id
  const archived = isGroupArchived(group)
  const waitlistCap = getWaitlistCapacity(group.capacity)

  const onAction = () => {
    if (actionState.action === 'manage') return
    handleAction(group, actionState)
  }

  const onDelete = () => {
    deleteGroup(group.id)
    navigate(PAGES.BROWSE)
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={goBack}
        className="flex items-center gap-1.5 text-sm text-warm-gray-500 hover:text-bark transition-colors mb-4 animate-fade-in"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      <div className="card-base p-6 animate-fade-in-up">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-serif text-2xl text-bark">{group.name}</h2>
              {archived && (
                <span className="tag bg-warm-gray-100 text-warm-gray-500 border border-warm-gray-200/60">
                  Archived
                </span>
              )}
            </div>
            <p className="text-sm text-warm-gray-500">{group.title}</p>
          </div>
          <button
            onClick={() => toggleFavorite(group.id)}
            className="shrink-0 p-2 rounded-lg hover:bg-parchment transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-colors ${isFavorite(group.id) ? 'text-ember fill-ember' : 'text-warm-gray-300 hover:text-warm-gray-400'}`}
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              fill={isFavorite(group.id) ? 'currentColor' : 'none'}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-warm-gray-600 leading-relaxed mb-5">{group.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
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

        <div className="grid grid-cols-2 gap-4 mb-5 p-4 rounded-lg bg-parchment/50 border border-warm-gray-200/60">
          <div>
            <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider mb-1">When</p>
            <p className="text-sm text-bark font-medium">
              {group.dateTime ? formatDateTimeRange(group.dateTime, group.endDateTime) : 'TBD'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider mb-1">Where</p>
            <p className="text-sm text-bark font-medium">{group.meetingDetail || 'TBD'}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[10px] font-bold text-warm-gray-400 uppercase tracking-wider mb-2">Capacity</p>
          <CapacityBadge current={group.memberIds.length} max={group.capacity} />
          {group.waitlistIds.length > 0 && (
            <p className="text-xs text-warm-gray-400 mt-1">
              {group.waitlistIds.length}/{waitlistCap} on waitlist
            </p>
          )}
        </div>

        {!archived && !isOwner && (
          <button
            onClick={onAction}
            disabled={actionState.disabled}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 mb-5 ${BUTTON_STYLES[actionState.style]} ${
              actionState.disabled ? '' : 'active:scale-[0.98]'
            }`}
          >
            {actionState.label}
          </button>
        )}

        <div className="border-t border-warm-gray-200/60 pt-5">
          <h3 className="text-xs font-bold text-warm-gray-400 uppercase tracking-wider mb-3">
            Members ({group.memberIds.length})
          </h3>
          <MemberList
            memberIds={group.memberIds}
            ownerId={group.ownerId}
            onRemove={isOwner ? (userId) => removeMember(group.id, userId) : null}
          />
        </div>

        {isOwner && group.joinRequests.length > 0 && (
          <div className="border-t border-warm-gray-200/60 pt-5 mt-5">
            <h3 className="text-xs font-bold text-warm-gray-400 uppercase tracking-wider mb-3">
              Join Requests ({group.joinRequests.length})
            </h3>
            <JoinRequestList
              requests={group.joinRequests}
              onApprove={(userId) => approveRequest(group.id, userId)}
              onDeny={(userId) => denyRequest(group.id, userId)}
            />
          </div>
        )}

        {isOwner && group.waitlistIds.length > 0 && (
          <div className="border-t border-warm-gray-200/60 pt-5 mt-5">
            <h3 className="text-xs font-bold text-warm-gray-400 uppercase tracking-wider mb-3">
              Waitlist ({group.waitlistIds.length})
            </h3>
            <MemberList
              memberIds={group.waitlistIds}
              ownerId={group.ownerId}
              onRemove={null}
            />
          </div>
        )}

        {isOwner && (
          <div className="border-t border-warm-gray-200/60 pt-5 mt-5">
            <button
              onClick={() => setDeleteModal(true)}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Delete Group
            </button>
          </div>
        )}
      </div>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Group?">
        <p className="text-sm text-warm-gray-600 mb-4">
          This will permanently remove <span className="font-semibold text-bark">{group.name}</span> and all its data. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteModal(false)}
            className="flex-1 py-2.5 rounded-xl bg-parchment border border-warm-gray-200 text-sm font-semibold text-warm-gray-600 hover:text-bark transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-[0.98] transition-all"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
