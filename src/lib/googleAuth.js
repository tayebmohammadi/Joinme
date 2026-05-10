import { supabase } from './cloud'

export const GOOGLE_HD_DARTMOUTH = 'dartmouth.edu'

const PROVIDER_DISABLED_HINT =
  'Google sign-in is not enabled on your Supabase project. In the Supabase dashboard: Authentication → Providers → Google → turn it ON, paste your OAuth Client ID and Client Secret from Google Cloud Console (APIs & Credentials → OAuth 2.0 Client IDs → Web application), then Save.'

/** Map Supabase/API errors into copy that humans can fix (raw JSON otherwise confuses builders). */
export function explainOAuthBootstrapError(authError) {
  if (!authError) return null
  let raw =
    typeof authError.message === 'string'
      ? authError.message
      : String(authError?.message ?? authError ?? '')

  try {
    const trimmed = raw.trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const j = JSON.parse(trimmed)
      raw = `${j.msg || ''} ${j.error_code || ''} ${j.code ?? ''}`
    }
  } catch {
    //
  }

  const lower = raw.toLowerCase()
  if (
    lower.includes('unsupported provider')
    || lower.includes('provider is not enabled')
    || lower.includes('validation_failed')
  ) {
    return PROVIDER_DISABLED_HINT
  }

  return typeof authError.message === 'string' ? authError.message : raw || 'Could not start Google sign-in.'
}

/** Start Google OAuth; restricts account picker toward Dartmouth Workspace (still enforced via email gate). */
export async function startDartmouthGoogleSignIn() {
  if (!supabase) {
    return { error: 'Cloud sign-in is not configured' }
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      scopes: 'email profile',
      queryParams: {
        hd: GOOGLE_HD_DARTMOUTH,
        prompt: 'select_account',
      },
    },
  })
  return { error: explainOAuthBootstrapError(error) }
}
