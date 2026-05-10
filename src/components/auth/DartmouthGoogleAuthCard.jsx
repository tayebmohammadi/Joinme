import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function OAuthStuckHints() {
  return (
    <div className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/90 px-4 py-3.5 text-left text-[13px] text-amber-950/90 leading-relaxed backdrop-blur-sm">
      <p className="font-semibold text-bark mb-1.5">Taking a while?</p>
      <ul className="list-disc list-inside space-y-1 text-amber-900/85 marker:text-amber-600 text-[12px]">
        <li>Supabase → Authentication → Providers → Google is on, with valid Client ID &amp; secret.</li>
        <li>Google Cloud redirect URI matches Supabase’s <code className="text-[11px] bg-white/70 px-1 rounded">*.supabase.co</code> callback.</li>
      </ul>
      <details className="mt-3">
        <summary className="cursor-pointer text-amber-800/90 text-xs font-semibold underline-offset-2 hover:underline">
          Developer notes
        </summary>
        <p className="mt-2 text-xs text-warm-gray-700 pl-1 border-l-2 border-amber-300/60">
          See{' '}
          <a href="https://supabase.com/docs/guides/auth/social-login/auth-google" className="text-forest font-medium underline" target="_blank" rel="noreferrer">
            Supabase + Google
          </a>
          .
        </p>
      </details>
    </div>
  )
}

export default function DartmouthGoogleAuthCard({ id = 'dartmouth-sign-in' }) {
  const { signInWithGoogle, oauthGateError } = useAuth()
  const [busy, setBusy] = useState(false)
  const [localErr, setLocalErr] = useState('')
  const [showSlowHint, setShowSlowHint] = useState(false)

  useEffect(() => {
    if (!busy) {
      setShowSlowHint(false)
      return undefined
    }
    const slow = window.setTimeout(() => setShowSlowHint(true), 3500)
    return () => window.clearTimeout(slow)
  }, [busy])

  const banner = oauthGateError || localErr

  const handleContinue = async () => {
    setLocalErr('')
    setBusy(true)
    try {
      const result = await signInWithGoogle()
      if (result?.error) {
        setLocalErr(result.error)
        setBusy(false)
      }
      window.setTimeout(() => setBusy(false), 4500)
    } catch (e) {
      setLocalErr(e?.message || 'Could not start Google sign-in')
      setBusy(false)
    }
  }

  return (
    <section
      id={id}
      className="relative scroll-mt-28 rounded-[1.85rem] border border-white/70 bg-white/75 p-8 sm:p-9 shadow-[0_24px_60px_-28px_rgba(14,15,12,0.22),0_0_0_1px_rgba(255,255,255,0.6)_inset] backdrop-blur-xl"
      aria-labelledby="dartmouth-google-heading"
    >
      <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent rounded-full" aria-hidden />

      <h2 id="dartmouth-google-heading" className="font-serif text-2xl sm:text-[1.65rem] text-bark tracking-tight">
        Continue with Dartmouth
      </h2>
      <p className="mt-2 text-sm text-warm-gray-600 leading-relaxed">
        One tap with your <span className="font-semibold text-bark">@dartmouth.edu</span> Google account. Personal Gmail isn’t accepted.
      </p>

      {banner && (
        <div className="mt-5 rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 backdrop-blur-sm" role="alert">
          {banner}
        </div>
      )}

      <button
        id="dartmouth-google-primary"
        type="button"
        disabled={busy}
        onClick={handleContinue}
        className="mt-6 w-full py-3.5 rounded-2xl bg-bark text-white font-semibold text-[15px] shadow-[0_4px_20px_-4px_rgba(14,15,12,0.35)] hover:bg-bark/90 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {busy ? (
          <>
            <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden />
            <span className="flex flex-col items-start gap-0.5 text-left">
              <span>Opening Google…</span>
              <span className="text-[11px] font-normal text-white/75 leading-tight">
                You’ll choose your Dartmouth account next.
              </span>
            </span>
          </>
        ) : (
          <>
            <svg className="w-[22px] h-[22px] shrink-0" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Dartmouth Google</span>
          </>
        )}
      </button>

      {busy && showSlowHint && <OAuthStuckHints />}

      {!busy && (
        <p className="text-center text-[11px] text-warm-gray-400 mt-5 leading-relaxed">
          Campus policy may apply to misuse. Questions? Reach out to your org contact.
        </p>
      )}
    </section>
  )
}
