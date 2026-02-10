import { useAuth } from '../../context/AuthContext'
import { getInitials, getAvatarColor } from '../../utils/constants'

export default function MemberList({ memberIds, ownerId, onRemove }) {
  const { users, currentUser } = useAuth()
  const isOwner = currentUser?.id === ownerId

  const members = memberIds
    .map(id => users.find(u => u.id === id))
    .filter(Boolean)

  if (members.length === 0) {
    return <p className="text-sm text-warm-gray-400">No members yet</p>
  }

  return (
    <div className="space-y-2">
      {members.map(member => (
        <div key={member.id} className="flex items-center gap-3 py-1.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(member.displayName)}`}>
            {getInitials(member.displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-bark truncate">
              {member.displayName}
              {member.id === ownerId && (
                <span className="ml-1.5 text-[10px] font-bold text-ember uppercase">Owner</span>
              )}
            </p>
            <p className="text-xs text-warm-gray-400 truncate">{member.email}</p>
          </div>
          {isOwner && member.id !== ownerId && onRemove && (
            <button
              onClick={() => onRemove(member.id)}
              className="text-xs text-warm-gray-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
