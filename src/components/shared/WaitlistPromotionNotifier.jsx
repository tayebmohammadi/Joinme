import { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useGroups } from '../../context/GroupsContext'
import { useToast } from './Toast'

function relationForUser(group, userId) {
  if (!userId || !group) return 'none'
  if (group.memberIds.includes(userId)) return 'member'
  if (group.waitlistIds.includes(userId)) return 'waitlist'
  return 'none'
}

/**
 * When group data updates (e.g. after someone leaves and spots open), detect
 * waitlist → member for the current user and show an in-app toast. Promoted
 * users see this after the next refresh/poll; there is no email/push yet.
 */
export default function WaitlistPromotionNotifier() {
  const { currentUser } = useAuth()
  const { groups } = useGroups()
  const { addToast } = useToast()
  const prevRef = useRef(null)

  useEffect(() => {
    if (!currentUser?.id) {
      prevRef.current = null
      return
    }
    if (!groups?.length) {
      prevRef.current = null
      return
    }

    const uid = currentUser.id
    const snapshot = Object.fromEntries(groups.map((g) => [g.id, relationForUser(g, uid)]))

    if (prevRef.current) {
      for (const g of groups) {
        const prev = prevRef.current[g.id]
        const next = snapshot[g.id]
        if (prev === 'waitlist' && next === 'member') {
          const label = (g.title || g.name || 'A group').trim()
          addToast(
            `${label}: You're in! A spot opened — you're now a member. If you're no longer interested, leave the group so someone else can take your place.`,
            'success',
            11000
          )
        }
      }
    }

    prevRef.current = snapshot
  }, [groups, currentUser?.id, addToast])

  return null
}
