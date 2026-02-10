import { useAuth } from '../../context/AuthContext'
import { getInitials, getAvatarColor } from '../../utils/constants'

export default function JoinRequestList({ requests, onApprove, onDeny }) {
  const { users } = useAuth()

  if (!requests || requests.length === 0) {
    return <p className="text-sm text-warm-gray-400">No pending requests</p>
  }

  return (
    <div className="space-y-2">
      {requests.map(req => {
        const user = users.find(u => u.id === req.userId)
        if (!user) return null
        return (
          <div key={req.userId} className="flex items-center gap-3 py-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(user.displayName)}`}>
              {getInitials(user.displayName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-bark truncate">{user.displayName}</p>
              <p className="text-xs text-warm-gray-400 truncate">{user.email}</p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => onApprove(req.userId)}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => onDeny(req.userId)}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-600 border border-red-200/60 hover:bg-red-100 transition-colors"
              >
                Deny
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
