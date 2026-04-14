import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId } from '../utils/ids'
import { isDartmouthEmail } from '../utils/validators'
import { generateVerificationCode } from '../utils/constants'
import { isCloudEnabled, supabase } from '../lib/cloud'
import { mapUserRow, mapUserToRow } from '../lib/cloudMappers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [localUsers, setLocalUsers] = useLocalStorage('joinme_users', [])
  const [currentUserId, setCurrentUserId] = useLocalStorage('joinme_currentUser', null)
  const [cloudUsers, setCloudUsers] = useState([])

  const users = isCloudEnabled ? cloudUsers : localUsers
  const setUsers = isCloudEnabled ? setCloudUsers : setLocalUsers

  const refreshCloudUsers = useCallback(async () => {
    if (!isCloudEnabled) return
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })
    setCloudUsers((data || []).map(mapUserRow))
  }, [])

  useEffect(() => {
    if (!isCloudEnabled) return
    refreshCloudUsers()
  }, [refreshCloudUsers])

  const currentUser = useMemo(
    () => users.find(u => u.id === currentUserId) || null,
    [users, currentUserId]
  )

  const signup = useCallback(async (email, displayName, password) => {
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

    if (isCloudEnabled) {
      const { error } = await supabase.from('users').insert(mapUserToRow(newUser))
      if (error) return { error: error.message }
      await refreshCloudUsers()
    } else {
      setUsers(prev => [...prev, newUser])
    }
    setCurrentUserId(newUser.id)
    return { user: newUser, verificationCode: code }
  }, [users, setUsers, setCurrentUserId, refreshCloudUsers])

  const verifyEmail = useCallback(async (code) => {
    if (!currentUser) return { error: 'Not logged in' }
    if (currentUser.verified) return { success: true }
    if (currentUser.verificationCode !== code) {
      return { error: 'Invalid verification code' }
    }

    if (isCloudEnabled) {
      const { error } = await supabase
        .from('users')
        .update({ verified: true, verification_code: null })
        .eq('id', currentUser.id)
      if (error) return { error: error.message }
      await refreshCloudUsers()
    } else {
      setUsers(prev => prev.map(u =>
        u.id === currentUser.id
          ? { ...u, verified: true, verificationCode: null }
          : u
      ))
    }
    return { success: true }
  }, [currentUser, setUsers, refreshCloudUsers])

  const resendVerification = useCallback(async () => {
    if (!currentUser) return { error: 'Not logged in' }
    const code = generateVerificationCode()

    if (isCloudEnabled) {
      const { error } = await supabase
        .from('users')
        .update({ verification_code: code })
        .eq('id', currentUser.id)
      if (error) return { error: error.message }
      await refreshCloudUsers()
    } else {
      setUsers(prev => prev.map(u =>
        u.id === currentUser.id ? { ...u, verificationCode: code } : u
      ))
    }
    return { verificationCode: code }
  }, [currentUser, setUsers, refreshCloudUsers])

  const login = useCallback(async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!isDartmouthEmail(trimmedEmail)) {
      return { error: 'Only @dartmouth.edu emails are allowed' }
    }
    let user = users.find(u => u.email === trimmedEmail)
    if (!user && isCloudEnabled) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', trimmedEmail)
        .maybeSingle()
      user = mapUserRow(data)
      if (user) {
        setCloudUsers(prev => {
          const exists = prev.some(u => u.id === user.id)
          return exists ? prev : [...prev, user]
        })
      }
    }
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

  const requestPasswordReset = useCallback(async (email) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!isDartmouthEmail(trimmedEmail)) {
      return { error: 'Only @dartmouth.edu emails are allowed' }
    }
    const user = users.find(u => u.email === trimmedEmail)
    if (!user) {
      return { error: 'No account found with this email' }
    }
    const code = generateVerificationCode()
    if (isCloudEnabled) {
      const { error } = await supabase
        .from('users')
        .update({ reset_code: code })
        .eq('id', user.id)
      if (error) return { error: error.message }
      await refreshCloudUsers()
    } else {
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, resetCode: code } : u
      ))
    }
    return { resetCode: code, userId: user.id }
  }, [users, setUsers, refreshCloudUsers])

  const resetPassword = useCallback(async (email, code, newPassword) => {
    const trimmedEmail = email.trim().toLowerCase()
    const user = users.find(u => u.email === trimmedEmail)
    if (!user) return { error: 'Account not found' }
    if (user.resetCode !== code) return { error: 'Invalid reset code' }
    if (!newPassword || newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }
    if (isCloudEnabled) {
      const { error } = await supabase
        .from('users')
        .update({ password: newPassword, reset_code: null })
        .eq('id', user.id)
      if (error) return { error: error.message }
      await refreshCloudUsers()
    } else {
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, password: newPassword, resetCode: null } : u
      ))
    }
    return { success: true }
  }, [users, setUsers, refreshCloudUsers])

  const toggleFavorite = useCallback(async (groupId) => {
    const nextUsers = users.map(u => {
      if (u.id !== currentUserId) return u
      const favs = u.favoriteGroupIds || []
      const next = favs.includes(groupId)
        ? favs.filter(id => id !== groupId)
        : [...favs, groupId]
      return { ...u, favoriteGroupIds: next }
    })

    if (isCloudEnabled) {
      const me = nextUsers.find(u => u.id === currentUserId)
      if (!me) return
      const { error } = await supabase
        .from('users')
        .update({ favorite_group_ids: me.favoriteGroupIds || [] })
        .eq('id', currentUserId)
      if (!error) {
        setUsers(nextUsers)
      }
      return
    }

    setUsers(nextUsers)
  }, [currentUserId, setUsers, users])

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
