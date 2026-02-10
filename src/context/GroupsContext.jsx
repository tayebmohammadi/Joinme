import { createContext, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'
import { generateId } from '../utils/ids'
import { getWaitlistCapacity } from '../utils/constants'

const GroupsContext = createContext(null)

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useLocalStorage('joinme_groups', [])
  const { currentUser } = useAuth()

  const createGroup = useCallback((data) => {
    const newGroup = {
      id: generateId('grp'),
      ownerId: currentUser.id,
      name: data.name.trim(),
      title: data.title.trim(),
      description: data.description.trim(),
      capacity: parseInt(data.capacity, 10),
      visibility: data.visibility,
      meetingType: data.meetingType,
      meetingDetail: data.meetingDetail.trim(),
      space: data.space,
      dateTime: data.dateTime,
      endDateTime: data.endDateTime,
      memberIds: [currentUser.id],
      waitlistIds: [],
      joinRequests: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    setGroups(prev => [...prev, newGroup])
    return newGroup
  }, [currentUser, setGroups])

  const updateGroup = useCallback((groupId, updates) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...updates } : g))
  }, [setGroups])

  const deleteGroup = useCallback((groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId))
  }, [setGroups])

  const joinGroup = useCallback((groupId) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      if (g.memberIds.includes(currentUser.id)) return g
      if (g.memberIds.length < g.capacity) {
        return {
          ...g,
          memberIds: [...g.memberIds, currentUser.id],
          joinRequests: g.joinRequests.filter(r => r.userId !== currentUser.id),
        }
      }
      return g
    }))
  }, [currentUser, setGroups])

  const leaveGroup = useCallback((groupId) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      const newMemberIds = g.memberIds.filter(id => id !== currentUser.id)
      const newWaitlistIds = [...g.waitlistIds]
      // Auto-promote from waitlist
      if (newMemberIds.length < g.capacity && newWaitlistIds.length > 0) {
        const promoted = newWaitlistIds.shift()
        newMemberIds.push(promoted)
      }
      return {
        ...g,
        memberIds: newMemberIds,
        waitlistIds: newWaitlistIds,
      }
    }))
  }, [currentUser, setGroups])

  const joinWaitlist = useCallback((groupId) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      if (g.waitlistIds.includes(currentUser.id)) return g
      const maxWaitlist = getWaitlistCapacity(g.capacity)
      if (g.waitlistIds.length >= maxWaitlist) return g
      return { ...g, waitlistIds: [...g.waitlistIds, currentUser.id] }
    }))
  }, [currentUser, setGroups])

  const leaveWaitlist = useCallback((groupId) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      return { ...g, waitlistIds: g.waitlistIds.filter(id => id !== currentUser.id) }
    }))
  }, [currentUser, setGroups])

  const requestToJoin = useCallback((groupId) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      if (g.joinRequests.some(r => r.userId === currentUser.id)) return g
      return {
        ...g,
        joinRequests: [...g.joinRequests, { userId: currentUser.id, requestedAt: new Date().toISOString() }],
      }
    }))
  }, [currentUser, setGroups])

  const approveRequest = useCallback((groupId, userId) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      if (g.memberIds.length >= g.capacity) return g
      return {
        ...g,
        memberIds: [...g.memberIds, userId],
        joinRequests: g.joinRequests.filter(r => r.userId !== userId),
      }
    }))
  }, [setGroups])

  const denyRequest = useCallback((groupId, userId) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      return {
        ...g,
        joinRequests: g.joinRequests.filter(r => r.userId !== userId),
      }
    }))
  }, [setGroups])

  const removeMember = useCallback((groupId, userId) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      const newMemberIds = g.memberIds.filter(id => id !== userId)
      const newWaitlistIds = [...g.waitlistIds]
      if (newMemberIds.length < g.capacity && newWaitlistIds.length > 0) {
        const promoted = newWaitlistIds.shift()
        newMemberIds.push(promoted)
      }
      return { ...g, memberIds: newMemberIds, waitlistIds: newWaitlistIds }
    }))
  }, [setGroups])

  const getGroup = useCallback((groupId) => {
    return groups.find(g => g.id === groupId) || null
  }, [groups])

  const getUserRelation = useCallback((group) => {
    if (!currentUser || !group) return 'none'
    if (group.ownerId === currentUser.id) return 'owner'
    if (group.memberIds.includes(currentUser.id)) return 'member'
    if (group.waitlistIds.includes(currentUser.id)) return 'waitlist'
    if (group.joinRequests.some(r => r.userId === currentUser.id)) return 'requested'
    return 'none'
  }, [currentUser])

  const getActionState = useCallback((group) => {
    const relation = getUserRelation(group)
    if (relation === 'owner') return { label: 'Manage', action: 'manage', style: 'bark' }
    if (relation === 'member') return { label: 'Joined', action: 'leave', style: 'green' }
    if (relation === 'waitlist') return { label: 'On Waitlist', action: 'leave_waitlist', style: 'amber' }
    if (relation === 'requested') return { label: 'Requested', action: null, style: 'amber', disabled: true }

    const hasSpace = group.memberIds.length < group.capacity
    const maxWaitlist = getWaitlistCapacity(group.capacity)
    const waitlistHasSpace = group.waitlistIds.length < maxWaitlist

    if (group.visibility === 'public') {
      if (hasSpace) return { label: 'Join Group', action: 'join', style: 'ember' }
      if (waitlistHasSpace) return { label: 'Join Waitlist', action: 'join_waitlist', style: 'ember' }
      return { label: 'Full', action: null, style: 'gray', disabled: true }
    }

    // private
    if (hasSpace) return { label: 'Request to Join', action: 'request', style: 'ember' }
    if (waitlistHasSpace) return { label: 'Join Waitlist', action: 'join_waitlist', style: 'ember' }
    return { label: 'Full', action: null, style: 'gray', disabled: true }
  }, [getUserRelation])

  const handleAction = useCallback((group, actionState) => {
    switch (actionState.action) {
      case 'join': joinGroup(group.id); break
      case 'leave': leaveGroup(group.id); break
      case 'join_waitlist': joinWaitlist(group.id); break
      case 'leave_waitlist': leaveWaitlist(group.id); break
      case 'request': requestToJoin(group.id); break
      default: break
    }
  }, [joinGroup, leaveGroup, joinWaitlist, leaveWaitlist, requestToJoin])

  const value = useMemo(() => ({
    groups,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    joinWaitlist,
    leaveWaitlist,
    requestToJoin,
    approveRequest,
    denyRequest,
    removeMember,
    getGroup,
    getUserRelation,
    getActionState,
    handleAction,
  }), [
    groups, createGroup, updateGroup, deleteGroup,
    joinGroup, leaveGroup, joinWaitlist, leaveWaitlist,
    requestToJoin, approveRequest, denyRequest, removeMember,
    getGroup, getUserRelation, getActionState, handleAction,
  ])

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  )
}

export function useGroups() {
  const ctx = useContext(GroupsContext)
  if (!ctx) throw new Error('useGroups must be used within GroupsProvider')
  return ctx
}
