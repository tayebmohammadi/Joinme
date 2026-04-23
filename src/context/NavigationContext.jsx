import { createContext, useContext, useState, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PAGES } from '../utils/constants'

const NavigationContext = createContext(null)
const RECENT_LIMIT = 6

export function NavigationProvider({ children }) {
  const [page, setPage] = useState(PAGES.BROWSE)
  const [params, setParams] = useState({})
  const [, setHistory] = useState([])
  const [recentGroupIds, setRecentGroupIds] = useLocalStorage('joinme_recent_groups', [])

  const trackRecentGroup = useCallback((groupId) => {
    if (!groupId) return
    setRecentGroupIds(prev => {
      const next = [groupId, ...prev.filter(id => id !== groupId)]
      return next.slice(0, RECENT_LIMIT)
    })
  }, [setRecentGroupIds])

  const navigate = useCallback((newPage, newParams = {}) => {
    setHistory(prev => [...prev, { page, params }])
    setPage(newPage)
    setParams(newParams)
    if (newPage === PAGES.GROUP_DETAIL && newParams.groupId) {
      trackRecentGroup(newParams.groupId)
    }
  }, [page, params, trackRecentGroup])

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) {
        setPage(PAGES.BROWSE)
        setParams({})
        return prev
      }
      const last = prev[prev.length - 1]
      setPage(last.page)
      setParams(last.params)
      return prev.slice(0, -1)
    })
  }, [])

  const clearRecentGroups = useCallback(() => {
    setRecentGroupIds([])
  }, [setRecentGroupIds])

  return (
    <NavigationContext.Provider value={{
      page,
      params,
      navigate,
      goBack,
      recentGroupIds,
      clearRecentGroups,
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}
