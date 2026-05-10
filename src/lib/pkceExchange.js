/**
 * React 18 Strict Mode runs effects twice in dev. Two concurrent PKCE exchanges
 * with the same ?code= invalidate the session — user briefly loads then is signed out.
 * Serialize to a single in-flight exchange per page load.
 */
let pkceExchangePromise = null

export function exchangePkceCodeOnce(supabase, search) {
  if (!search || !String(search).includes('code=')) {
    return Promise.resolve({ data: null, error: null })
  }
  if (!pkceExchangePromise) {
    pkceExchangePromise = supabase.auth.exchangeCodeForSession(search).finally(() => {
      pkceExchangePromise = null
    })
  }
  return pkceExchangePromise
}
