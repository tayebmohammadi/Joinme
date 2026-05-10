import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId } from '../utils/ids'
import { getAuthEmail, isDartmouthEmail } from '../utils/validators'
import { generateVerificationCode } from '../utils/constants'
import { isCloudEnabled, supabase } from '../lib/cloud'
import { mapUserRow, mapUserToRow } from '../lib/cloudMappers'
import { startDartmouthGoogleSignIn } from '../lib/googleAuth'
import { exchangePkceCodeOnce } from '../lib/pkceExchange'

const AuthContext = createContext(null)

function oauthAppUserFallback(authUser) {
  const email = getAuthEmail(authUser)
  return {
    id: authUser.id,
    email,
    displayName:
      authUser.user_metadata?.full_name
      ?? authUser.user_metadata?.name
      ?? email.split('@')[0],
    password: '',
    verified: true,
    verificationCode: null,
    createdAt: authUser.created_at ?? new Date().toISOString(),
    favoriteGroupIds: [],
    resetCode: null,
  }
}

export function AuthProvider({ children }) {
  const [localUsers, setLocalUsers] = useLocalStorage('joinme_users', [])
  const [currentUserId, setCurrentUserId] = useLocalStorage('joinme_currentUser', null)
  const [cloudUsers, setCloudUsers] = useState([])
  const [oauthUser, setOauthUser] = useState(null)
  const [oauthGateError, setOauthGateError] = useState(null)
  const [cloudAuthHydrated, setCloudAuthHydrated] = useState(() => !isCloudEnabled)

  const users = isCloudEnabled ? cloudUsers : localUsers
  const setUsers = isCloudEnabled ? setCloudUsers : setLocalUsers

  const refreshCloudUsers = useCallback(async () => {
    if (!isCloudEnabled || !supabase) return
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })
    setCloudUsers((data || []).map(mapUserRow))
  }, [])

  const ensureOAuthProfileUpsert = useCallback(async (authUser) => {
    if (!supabase) return
    const email = getAuthEmail(authUser)
    if (!email) {
      setOauthGateError(
        'Your Google account did not return an email to Joinme. In Google Cloud OAuth consent screen, add your account as a Test user if the app is in Testing; then try again.'
      )
      return
    }
    const displayName =
      authUser.user_metadata?.full_name
      ?? authUser.user_metadata?.name
      ?? email.split('@')[0]

    const { data: existingData } = await supabase.from('users').select('*').eq('id', authUser.id).maybeSingle()
    const existing = existingData ? mapUserRow(existingData) : null

    if (!existing) {
      const { data: sameEmail } = await supabase.from('users').select('id').eq('email', email).maybeSingle()
      if (sameEmail && sameEmail.id !== authUser.id) {
        setOauthGateError(
          'This @dartmouth.edu address already exists in Joinme under a different account (often from an old password signup). In Supabase → Table Editor → public.users, delete the row with that email, then sign in with Google again — or contact whoever manages the database.'
        )
        await supabase.auth.signOut()
        return
      }

      const payload = mapUserToRow({
        ...oauthAppUserFallback(authUser),
        displayName,
        password: '(oauth-google)',
      })
      const { error } = await supabase.from('users').insert(payload)
      if (error?.code === '23505') {
        setOauthGateError(
          'This Dartmouth email is already registered with another account format. Remove the duplicate row in Supabase public.users or ask an admin to merge accounts.'
        )
        await supabase.auth.signOut()
        return
      }
      if (error) {
        console.error('[Joinme] OAuth profile insert:', error.message)
        setOauthGateError(
          `Could not save your profile in the database: ${error.message}. If it mentions RLS or permission, check Supabase → Table Editor → public.users policies, or open the browser Network tab for the failed request.`
        )
      }
      return
    }

    const { error: upErr } = await supabase
      .from('users')
      .update({
        display_name: displayName,
        email,
        verified: true,
      })
      .eq('id', authUser.id)
    if (upErr) {
      console.error('[Joinme] OAuth profile update:', upErr.message)
      setOauthGateError(`Could not update your profile: ${upErr.message}`)
    }
  }, [])

  const applyCloudSession = useCallback(async (session) => {
    const u = session?.user ?? null
    setOauthUser(u)
    if (!u) {
      setOauthGateError(null)
      setCurrentUserId(null)
      return
    }

    const email = getAuthEmail(u)
    if (!email) {
      await supabase.auth.signOut()
      setOauthUser(null)
      setCurrentUserId(null)
      setOauthGateError(
        'Google did not share an email with Joinme. In Google Cloud → OAuth consent screen, add the email scope; in Supabase ensure Google provider is enabled. Try again or use a different Dartmouth account.'
      )
      return
    }
    if (!isDartmouthEmail(email)) {
      await supabase.auth.signOut()
      setOauthUser(null)
      setCurrentUserId(null)
      setOauthGateError('Only @dartmouth.edu Google accounts are allowed. Choose a Dartmouth account or contact support.')
      return
    }

    setOauthGateError(null)
    setCurrentUserId(u.id)
    await ensureOAuthProfileUpsert(u)
    await refreshCloudUsers()
  }, [ensureOAuthProfileUpsert, refreshCloudUsers, setCurrentUserId])

  useEffect(() => {
    if (!isCloudEnabled || !supabase) return undefined

    let cancelled = false

    const bootstrap = async () => {
      try {
        // After Google OAuth, Supabase redirects here with ?code=… (PKCE). Exchange it for a session
        // or getSession() alone often leaves you logged out on the landing page.
        if (typeof window !== 'undefined') {
          const search = window.location.search
          if (search.includes('code=')) {
            const { error: exchangeErr } = await exchangePkceCodeOnce(supabase, search)
            if (exchangeErr) {
              const msg = (exchangeErr.message || '').toLowerCase()
              console.error('[Joinme] OAuth code exchange:', exchangeErr.message)
              // Second StrictMode attempt often hits "invalid" / already-used code — session may still exist; getSession() below recovers.
              if (!msg.includes('invalid') && !msg.includes('already') && !msg.includes('expired')) {
                setOauthGateError(
                  'Sign-in could not finish. Check Supabase → Authentication → URL Configuration: Site URL and Redirect URLs must include this origin (e.g. http://localhost:5173).'
                )
              }
            }
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`)
          }
        }

        const { data } = await supabase.auth.getSession()
        if (cancelled) return
        await applyCloudSession(data.session ?? null)
      } finally {
        if (!cancelled) setCloudAuthHydrated(true)
      }
    }

    void bootstrap()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      applyCloudSession(session ?? null).catch(console.error)
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [applyCloudSession])

  useEffect(() => {
    if (!isCloudEnabled || !oauthUser) {
      if (isCloudEnabled) setCloudUsers([])
      return
    }
    refreshCloudUsers()
  }, [isCloudEnabled, oauthUser?.id, refreshCloudUsers])

  const cloudAuthBusy = isCloudEnabled && !cloudAuthHydrated

  const currentUser = useMemo(() => {
    if (isCloudEnabled) {
      if (!oauthUser) return null
      const email = getAuthEmail(oauthUser)
      if (!isDartmouthEmail(email)) return null
      return cloudUsers.find((u) => u.id === oauthUser.id) ?? oauthAppUserFallback(oauthUser)
    }

    const user = localUsers.find(u => u.id === currentUserId)
    return user ?? null
  }, [oauthUser, cloudUsers, localUsers, currentUserId])

  const signInWithGoogle = useCallback(async () => {
    if (!isCloudEnabled) {
      return { error: 'Google sign-in is only available when Supabase is configured' }
    }
    setOauthGateError(null)
    return startDartmouthGoogleSignIn()
  }, [])

  const signup = useCallback(async (email, displayName, password) => {
    if (isCloudEnabled) {
      return { error: 'Use Sign in with Google with your Dartmouth account' }
    }
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
    const existing = localUsers.find(u => u.email === trimmedEmail)
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
  }, [localUsers, setUsers, setCurrentUserId])

  const verifyEmail = useCallback(async (code) => {
    if (isCloudEnabled) return { success: true }
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

  const resendVerification = useCallback(async () => {
    if (!currentUser || isCloudEnabled) return {}
    const code = generateVerificationCode()

    setUsers(prev => prev.map(u =>
      u.id === currentUser.id ? { ...u, verificationCode: code } : u
    ))
    return { verificationCode: code }
  }, [currentUser, setUsers])

  const login = useCallback(async (email, password) => {
    if (isCloudEnabled) {
      return { error: 'Use Sign in with Google with your Dartmouth account' }
    }
    const trimmedEmail = email.trim().toLowerCase()
    if (!isDartmouthEmail(trimmedEmail)) {
      return { error: 'Only @dartmouth.edu emails are allowed' }
    }
    const user = localUsers.find(u => u.email === trimmedEmail)
    if (!user) {
      return { error: 'No account found with this email' }
    }
    if (user.password && user.password !== password) {
      return { error: 'Incorrect password' }
    }
    setCurrentUserId(user.id)
    return { user }
  }, [localUsers, setCurrentUserId])

  const logout = useCallback(async () => {
    if (isCloudEnabled && supabase) {
      await supabase.auth.signOut()
    }
    setCurrentUserId(null)
    setOauthUser(null)
    setOauthGateError(null)
  }, [setCurrentUserId])

  const requestPasswordReset = useCallback(async (email) => {
    if (isCloudEnabled) {
      return { error: 'Password reset isn’t available. Use Sign in with Google.' }
    }
    const trimmedEmail = email.trim().toLowerCase()
    if (!isDartmouthEmail(trimmedEmail)) {
      return { error: 'Only @dartmouth.edu emails are allowed' }
    }
    const user = localUsers.find(u => u.email === trimmedEmail)
    if (!user) {
      return { error: 'No account found with this email' }
    }
    const code = generateVerificationCode()

    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, resetCode: code } : u
    ))
    return { resetCode: code, userId: user.id }
  }, [localUsers, setUsers])

  const resetPassword = useCallback(async (email, code, newPassword) => {
    if (isCloudEnabled) {
      return { error: 'Password reset isn’t available. Use Sign in with Google.' }
    }
    const trimmedEmail = email.trim().toLowerCase()
    const user = localUsers.find(u => u.email === trimmedEmail)
    if (!user) return { error: 'Account not found' }
    if (user.resetCode !== code) return { error: 'Invalid reset code' }
    if (!newPassword || newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }

    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, password: newPassword, resetCode: null } : u
    ))
    return { success: true }
  }, [localUsers, setUsers])

  const toggleFavorite = useCallback(async (groupId) => {
    if (!currentUserId) return

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
      if (!me || !supabase) return
      const { error } = await supabase
        .from('users')
        .update({ favorite_group_ids: me.favoriteGroupIds || [] })
        .eq('id', currentUserId)
      if (!error) setUsers(nextUsers)
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
      oauthGateError,
      cloudAuthBusy,
      signup,
      login,
      logout,
      signInWithGoogle,
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
