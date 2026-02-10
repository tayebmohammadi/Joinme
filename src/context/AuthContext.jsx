import { createContext, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId } from '../utils/ids'
import { isDartmouthEmail } from '../utils/validators'
import { generateVerificationCode } from '../utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('joinme_users', [])
  const [currentUserId, setCurrentUserId] = useLocalStorage('joinme_currentUser', null)

  const currentUser = useMemo(
    () => users.find(u => u.id === currentUserId) || null,
    [users, currentUserId]
  )

  const signup = useCallback((email, displayName, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!isDartmouthEmail(trimmedEmail)) {
      return { error: 'Only @dartmouth.edu emails are allowed' }
    }
    if (!displayName?.trim()) {
      return { error: 'Display name is required' }
    }
    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }
    const existing = users.find(u => u.email === trimmedEmail)
    if (existing) {
      return { error: 'An account with this email already exists' }
    }
    const code = generateVerificationCode()
    const newUser = {
      id: generateId('user'),
      email: trimmedEmail,
      displayName: displayName.trim(),
      password,
      verified: false,
      verificationCode: code,
      createdAt: new Date().toISOString(),
      favoriteGroupIds: [],
    }
    setUsers(prev => [...prev, newUser])
    setCurrentUserId(newUser.id)
    return { user: newUser, verificationCode: code }
  }, [users, setUsers, setCurrentUserId])

  const verifyEmail = useCallback((code) => {
    if (!currentUser) return { error: 'Not logged in' }
    if (currentUser.verified) return { success: true }
    if (currentUser.verificationCode !== code) {
      return { error: 'Invalid verification code' }
    }
    setUsers(prev => prev.map(u =>
      u.id === currentUser.id
        ? { ...u, verified: true, verificationCode: null }
        : u
    ))
    return { success: true }
  }, [currentUser, setUsers])

  const resendVerification = useCallback(() => {
    if (!currentUser) return { error: 'Not logged in' }
    const code = generateVerificationCode()
    setUsers(prev => prev.map(u =>
      u.id === currentUser.id ? { ...u, verificationCode: code } : u
    ))
    return { verificationCode: code }
  }, [currentUser, setUsers])

  const login = useCallback((email, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!isDartmouthEmail(trimmedEmail)) {
      return { error: 'Only @dartmouth.edu emails are allowed' }
    }
    const user = users.find(u => u.email === trimmedEmail)
    if (!user) {
      return { error: 'No account found with this email' }
    }
    if (user.password && user.password !== password) {
      return { error: 'Incorrect password' }
    }
    setCurrentUserId(user.id)
    return { user }
  }, [users, setCurrentUserId])

  const logout = useCallback(() => {
    setCurrentUserId(null)
  }, [setCurrentUserId])

  const requestPasswordReset = useCallback((email) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!isDartmouthEmail(trimmedEmail)) {
      return { error: 'Only @dartmouth.edu emails are allowed' }
    }
    const user = users.find(u => u.email === trimmedEmail)
    if (!user) {
      return { error: 'No account found with this email' }
    }
    const code = generateVerificationCode()
    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, resetCode: code } : u
    ))
    return { resetCode: code, userId: user.id }
  }, [users, setUsers])

  const resetPassword = useCallback((email, code, newPassword) => {
    const trimmedEmail = email.trim().toLowerCase()
    const user = users.find(u => u.email === trimmedEmail)
    if (!user) return { error: 'Account not found' }
    if (user.resetCode !== code) return { error: 'Invalid reset code' }
    if (!newPassword || newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }
    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, password: newPassword, resetCode: null } : u
    ))
    return { success: true }
  }, [users, setUsers])

  const toggleFavorite = useCallback((groupId) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== currentUserId) return u
      const favs = u.favoriteGroupIds || []
      const next = favs.includes(groupId)
        ? favs.filter(id => id !== groupId)
        : [...favs, groupId]
      return { ...u, favoriteGroupIds: next }
    }))
  }, [currentUserId, setUsers])

  const isFavorite = useCallback((groupId) => {
    return currentUser?.favoriteGroupIds?.includes(groupId) || false
  }, [currentUser])

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      signup,
      login,
      logout,
      verifyEmail,
      resendVerification,
      requestPasswordReset,
      resetPassword,
      toggleFavorite,
      isFavorite,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
