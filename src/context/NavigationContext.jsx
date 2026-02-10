import { createContext, useContext, useState, useCallback } from 'react'
import { PAGES } from '../utils/constants'

const NavigationContext = createContext(null)

export function NavigationProvider({ children }) {
  const [page, setPage] = useState(PAGES.BROWSE)
  const [params, setParams] = useState({})
  const [, setHistory] = useState([])

  const navigate = useCallback((newPage, newParams = {}) => {
    setHistory(prev => [...prev, { page, params }])
    setPage(newPage)
    setParams(newParams)
  }, [page, params])

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

  return (
    <NavigationContext.Provider value={{ page, params, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}
