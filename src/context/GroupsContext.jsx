import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'
import { generateId } from '../utils/ids'
import { getWaitlistCapacity, getDefaultGroupVisual } from '../utils/constants'
import { isCloudEnabled, supabase } from '../lib/cloud'
import { mapGroupRow, mapGroupToRow } from '../lib/cloudMappers'

const GroupsContext = createContext(null)

export function GroupsProvider({ children }) {
  const [localGroups, setLocalGroups] = useLocalStorage('joinme_groups', [])
  const [cloudGroups, setCloudGroups] = useState([])
  const { currentUser } = useAuth()
  const groups = isCloudEnabled ? cloudGroups : localGroups
  const setGroups = isCloudEnabled ? setCloudGroups : setLocalGroups

  const refreshCloudGroups = useCallback(async () => {
    if (!isCloudEnabled) return
    const { data } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false })
    setCloudGroups((data || []).map(mapGroupRow))
  }, [])

  useEffect(() => {
    if (!isCloudEnabled) return
    refreshCloudGroups()
    const interval = setInterval(refreshCloudGroups, 4000)
    return () => clearInterval(interval)
  }, [refreshCloudGroups])

  const createGroup = useCallback((data) => {
    const startDate = new Date(`${data.meetingDate}T${data.meetingTime}`)
    const durationMinutes = parseInt(data.durationMinutes, 10)
    const recurrenceCount = data.recurrence === 'none'
      ? 1
      : Math.max(1, parseInt(data.recurrenceCount, 10) || 1)
    const stepDays = data.recurrence === 'daily'
      ? 1
      : data.recurrence === 'weekly'
        ? 7
        : data.recurrence === 'biweekly'
          ? 14
          : 0

    let occurrenceStarts = []
    if (data.recurrence === 'custom-weekdays') {
      const selectedDays = new Set((data.recurrenceWeekdays || []).map((day) => Number(day)))
      const cursor = new Date(startDate)
      while (occurrenceStarts.length < recurrenceCount) {
        if (selectedDays.has(cursor.getDay())) {
          occurrenceStarts.push(new Date(cursor))
        }
        cursor.setDate(cursor.getDate() + 1)
      }
    } else {
      occurrenceStarts = Array.from({ length: recurrenceCount }, (_, index) => {
        const start = new Date(startDate)
        if (stepDays > 0 && index > 0) {
          start.setDate(start.getDate() + stepDays * index)
        }
        return start
      })
    }

    const baseName = data.name.trim()
    const newGroups = occurrenceStarts.map((start, index) => {
      const end = new Date(start)
      end.setMinutes(end.getMinutes() + durationMinutes)

      const hasSeriesLabel = recurrenceCount > 1
      const occurrenceLabel = hasSeriesLabel ? ` (${index + 1}/${recurrenceCount})` : ''

      return {
        id: generateId('grp'),
        ownerId: currentUser.id,
        name: `${baseName}${occurrenceLabel}`,
        title: data.title.trim(),
        description: data.description.trim(),
        capacity: parseInt(data.capacity, 10),
        visibility: data.visibility,
        meetingType: data.meetingType,
        meetingDetail: data.meetingDetail.trim(),
        space: data.space,
        visualId: data.visualId || getDefaultGroupVisual(data.name).id,
        dateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        memberIds: [currentUser.id],
        waitlistIds: [],
        joinRequests: [],
        status: 'active',
        createdAt: new Date().toISOString(),
      }
    })

    if (isCloudEnabled) {
      setGroups(prev => [...newGroups, ...prev])
      supabase.from('groups').insert(newGroups.map(mapGroupToRow)).then(() => {
        refreshCloudGroups()
      })
    } else {
      setGroups(prev => [...prev, ...newGroups])
    }
    return newGroups[0]
  }, [currentUser, setGroups, refreshCloudGroups])

  const updateGroup = useCallback((groupId, updates) => {
    if (isCloudEnabled) {
      const target = groups.find(g => g.id === groupId)
      if (!target) return
      const next = { ...target, ...updates }
      setGroups(prev => prev.map(g => g.id === groupId ? next : g))
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...updates } : g))
  }, [setGroups, groups, refreshCloudGroups])

  const deleteGroup = useCallback((groupId) => {
    if (isCloudEnabled) {
      setGroups(prev => prev.filter(g => g.id !== groupId))
      supabase.from('groups').delete().eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(prev => prev.filter(g => g.id !== groupId))
  }, [setGroups, refreshCloudGroups])

  const joinGroup = useCallback((groupId) => {
    const nextGroups = groups.map(g => {
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
    })
    if (isCloudEnabled) {
      const next = nextGroups.find(g => g.id === groupId)
      if (!next) return
      setGroups(nextGroups)
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(nextGroups)
  }, [currentUser, setGroups, groups, refreshCloudGroups])

  const leaveGroup = useCallback((groupId) => {
    const nextGroups = groups.map(g => {
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
    })
    if (isCloudEnabled) {
      const next = nextGroups.find(g => g.id === groupId)
      if (!next) return
      setGroups(nextGroups)
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(nextGroups)
  }, [currentUser, setGroups, groups, refreshCloudGroups])

  const joinWaitlist = useCallback((groupId) => {
    const nextGroups = groups.map(g => {
      if (g.id !== groupId) return g
      if (g.waitlistIds.includes(currentUser.id)) return g
      const maxWaitlist = getWaitlistCapacity(g.capacity)
      if (g.waitlistIds.length >= maxWaitlist) return g
      return { ...g, waitlistIds: [...g.waitlistIds, currentUser.id] }
    })
    if (isCloudEnabled) {
      const next = nextGroups.find(g => g.id === groupId)
      if (!next) return
      setGroups(nextGroups)
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(nextGroups)
  }, [currentUser, setGroups, groups, refreshCloudGroups])

  const leaveWaitlist = useCallback((groupId) => {
    const nextGroups = groups.map(g => {
      if (g.id !== groupId) return g
      return { ...g, waitlistIds: g.waitlistIds.filter(id => id !== currentUser.id) }
    })
    if (isCloudEnabled) {
      const next = nextGroups.find(g => g.id === groupId)
      if (!next) return
      setGroups(nextGroups)
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(nextGroups)
  }, [currentUser, setGroups, groups, refreshCloudGroups])

  const requestToJoin = useCallback((groupId) => {
    const nextGroups = groups.map(g => {
      if (g.id !== groupId) return g
      if (g.joinRequests.some(r => r.userId === currentUser.id)) return g
      return {
        ...g,
        joinRequests: [...g.joinRequests, { userId: currentUser.id, requestedAt: new Date().toISOString() }],
      }
    })
    if (isCloudEnabled) {
      const next = nextGroups.find(g => g.id === groupId)
      if (!next) return
      setGroups(nextGroups)
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(nextGroups)
  }, [currentUser, setGroups, groups, refreshCloudGroups])

  const approveRequest = useCallback((groupId, userId) => {
    const nextGroups = groups.map(g => {
      if (g.id !== groupId) return g
      if (g.memberIds.length >= g.capacity) return g
      return {
        ...g,
        memberIds: [...g.memberIds, userId],
        joinRequests: g.joinRequests.filter(r => r.userId !== userId),
      }
    })
    if (isCloudEnabled) {
      const next = nextGroups.find(g => g.id === groupId)
      if (!next) return
      setGroups(nextGroups)
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(nextGroups)
  }, [setGroups, groups, refreshCloudGroups])

  const denyRequest = useCallback((groupId, userId) => {
    const nextGroups = groups.map(g => {
      if (g.id !== groupId) return g
      return {
        ...g,
        joinRequests: g.joinRequests.filter(r => r.userId !== userId),
      }
    })
    if (isCloudEnabled) {
      const next = nextGroups.find(g => g.id === groupId)
      if (!next) return
      setGroups(nextGroups)
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(nextGroups)
  }, [setGroups, groups, refreshCloudGroups])

  const removeMember = useCallback((groupId, userId) => {
    const nextGroups = groups.map(g => {
      if (g.id !== groupId) return g
      const newMemberIds = g.memberIds.filter(id => id !== userId)
      const newWaitlistIds = [...g.waitlistIds]
      if (newMemberIds.length < g.capacity && newWaitlistIds.length > 0) {
        const promoted = newWaitlistIds.shift()
        newMemberIds.push(promoted)
      }
      return { ...g, memberIds: newMemberIds, waitlistIds: newWaitlistIds }
    })
    if (isCloudEnabled) {
      const next = nextGroups.find(g => g.id === groupId)
      if (!next) return
      supabase.from('groups').update(mapGroupToRow(next)).eq('id', groupId).then(() => {
        refreshCloudGroups()
      })
      return
    }
    setGroups(nextGroups)
  }, [setGroups, groups, refreshCloudGroups])

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
