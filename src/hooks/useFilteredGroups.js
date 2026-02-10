import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useGroups } from '../context/GroupsContext'
import { useAuth } from '../context/AuthContext'
import { isGroupArchived } from '../utils/constants'

export function useFilteredGroups() {
  const { groups } = useGroups()
  const { currentUser } = useAuth()
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [meetingType, setMeetingType] = useState('')
  const [spaceType, setSpaceType] = useState('')
  const [visibility, setVisibility] = useState('')
  const [hasOpenSpots, setHasOpenSpots] = useState(false)
  const timerRef = useRef(null)

  // Capture which groups the user was already a member of when browse first mounted.
  // Groups joined AFTER mount stay visible until next mount (page refresh / nav away & back).
  const initialMemberIds = useRef(null)
  if (initialMemberIds.current === null && currentUser) {
    initialMemberIds.current = new Set(
      groups
        .filter(g => g.memberIds.includes(currentUser.id))
        .map(g => g.id)
    )
  }

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 200)
    return () => clearTimeout(timerRef.current)
  }, [searchInput])

  const activeGroups = useMemo(
    () => groups.filter(g => !isGroupArchived(g)),
    [groups]
  )

  const filtered = useMemo(() => {
    let result = activeGroups

    // Hide groups the user was already in when they opened Browse
    if (initialMemberIds.current && currentUser) {
      result = result.filter(g => !initialMemberIds.current.has(g.id))
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      )
    }

    if (meetingType) {
      result = result.filter(g => g.meetingType === meetingType)
    }

    if (spaceType) {
      result = result.filter(g => g.space === spaceType)
    }

    if (visibility) {
      result = result.filter(g => g.visibility === visibility)
    }

    if (hasOpenSpots) {
      result = result.filter(g => g.memberIds.length < g.capacity)
    }

    return result
  }, [activeGroups, currentUser, debouncedSearch, meetingType, spaceType, visibility, hasOpenSpots])

  const activeFilterCount = [meetingType, spaceType, visibility, hasOpenSpots].filter(Boolean).length
    + (debouncedSearch ? 1 : 0)

  const clearAll = useCallback(() => {
    setSearchInput('')
    setDebouncedSearch('')
    setMeetingType('')
    setSpaceType('')
    setVisibility('')
    setHasOpenSpots(false)
  }, [])

  return {
    filtered,
    totalActive: activeGroups.length,
    searchInput,
    setSearchInput,
    meetingType,
    setMeetingType,
    spaceType,
    setSpaceType,
    visibility,
    setVisibility,
    hasOpenSpots,
    setHasOpenSpots,
    activeFilterCount,
    clearAll,
  }
}
