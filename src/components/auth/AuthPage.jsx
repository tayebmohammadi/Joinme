import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg bg-parchment/70 border border-warm-gray-200 text-sm text-bark placeholder:text-warm-gray-400 focus:outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember/40 transition-all'

export default function AuthPage() {
  const { signup, login, verifyEmail, resendVerification, requestPasswordReset, resetPassword, currentUser } = useAuth()

  // mode: 'login' | 'signup' | 'verify' | 'forgot' | 'reset'
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')

  // If logged in but not verified, show verification screen
  const needsVerification = currentUser && currentUser.verified === false
  const activeMode = needsVerification ? 'verify' : mode

  const handleSignup = (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    const result = signup(email, displayName, password)
    if (result.error) {
      setError(result.error)
    } else {
      setSentCode(result.verificationCode)
      setMode('verify')
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (result.error) {
      setError(result.error)
    }
  }

  const handleVerify = (e) => {
    e.preventDefault()
    setError('')
    const result = verifyEmail(verifyCode)
    if (result.error) setError(result.error)
  }

  const handleResend = () => {
    setError('')
    const result = resendVerification()
    if (result.verificationCode) {
      setSentCode(result.verificationCode)
    }
  }

  const handleForgot = (e) => {
    e.preventDefault()
    setError('')
    const result = requestPasswordReset(forgotEmail)
    if (result.error) {
      setError(result.error)
    } else {
      setSentCode(result.resetCode)
      setMode('reset')
    }
  }

  const handleReset = (e) => {
    e.preventDefault()
    setError('')
    const result = resetPassword(forgotEmail, resetCode, newPassword)
    if (result.error) {
      setError(result.error)
    } else {
      setMode('login')
      setEmail(forgotEmail)
      setPassword('')
      setError('')
      setSentCode('')
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setSentCode('')
    setVerifyCode('')
    setResetCode('')
    setNewPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-bark mb-2">Joinme</h1>
          <p className="text-warm-gray-500 text-sm">Dartmouth Student Groups</p>
        </div>

        <div className="card-base p-6">
          {/* ─── Verification Screen ─── */}
          {activeMode === 'verify' && (
            <div className="animate-fade-in">
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-bark mb-1">Verify Your Email</h3>
                <p className="text-sm text-warm-gray-500">
                  We sent a 6-digit code to <span className="font-medium text-bark">{currentUser?.email}</span>
                </p>
              </div>

              {sentCode && (
                <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200/60 text-xs text-amber-700 mb-4 text-center">
                  <span className="font-bold">Demo mode</span> — your code is: <span className="font-mono font-bold text-sm">{sentCode}</span>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    className={`${inputClass} text-center tracking-[0.3em] font-mono text-lg`}
                  />
                </div>

                {error && (
                  <div className="animate-fade-in px-3 py-2 rounded-lg bg-red-50 border border-red-200/60 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-ember text-white font-semibold text-sm tracking-wide hover:bg-ember-light active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-md"
                >
                  Verify Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  className="w-full text-center text-xs text-warm-gray-400 hover:text-ember transition-colors"
                >
                  Resend code
                </button>
              </form>
            </div>
          )}

          {/* ─── Forgot Password Screen ─── */}
          {activeMode === 'forgot' && (
            <div className="animate-fade-in">
              <h3 className="font-serif text-xl text-bark mb-1 text-center">Reset Password</h3>
              <p className="text-sm text-warm-gray-500 text-center mb-5">
                Enter your email and we&apos;ll send a reset code
              </p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your.name@dartmouth.edu"
                    required
                    className={inputClass}
                  />
                </div>

                {error && (
                  <div className="animate-fade-in px-3 py-2 rounded-lg bg-red-50 border border-red-200/60 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-ember text-white font-semibold text-sm tracking-wide hover:bg-ember-light active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-md"
                >
                  Send Reset Code
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full text-center text-xs text-warm-gray-400 hover:text-ember transition-colors"
                >
                  Back to Log In
                </button>
              </form>
            </div>
          )}

          {/* ─── Reset Password Screen ─── */}
          {activeMode === 'reset' && (
            <div className="animate-fade-in">
              <h3 className="font-serif text-xl text-bark mb-1 text-center">Set New Password</h3>
              <p className="text-sm text-warm-gray-500 text-center mb-5">
                Enter the code sent to <span className="font-medium text-bark">{forgotEmail}</span>
              </p>

              {sentCode && (
                <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200/60 text-xs text-amber-700 mb-4 text-center">
                  <span className="font-bold">Demo mode</span> — your code is: <span className="font-mono font-bold text-sm">{sentCode}</span>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    className={`${inputClass} text-center tracking-[0.3em] font-mono text-lg`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className={inputClass}
                  />
                </div>

                {error && (
                  <div className="animate-fade-in px-3 py-2 rounded-lg bg-red-50 border border-red-200/60 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-ember text-white font-semibold text-sm tracking-wide hover:bg-ember-light active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-md"
                >
                  Reset Password
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full text-center text-xs text-warm-gray-400 hover:text-ember transition-colors"
                >
                  Back to Log In
                </button>
              </form>
            </div>
          )}

          {/* ─── Login / Signup Screens ─── */}
          {(activeMode === 'login' || activeMode === 'signup') && (
            <>
              <div className="flex bg-parchment/80 border border-warm-gray-200/60 rounded-lg p-0.5 mb-6">
                {['login', 'signup'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-150 ${
                      activeMode === m
                        ? 'bg-white text-bark shadow-sm'
                        : 'text-warm-gray-400 hover:text-warm-gray-600'
                    }`}
                  >
                    {m === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              <form onSubmit={activeMode === 'signup' ? handleSignup : handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@dartmouth.edu"
                    required
                    className={inputClass}
                  />
                </div>

                {activeMode === 'signup' && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={activeMode === 'signup' ? 'At least 6 characters' : 'Your password'}
                    required
                    className={inputClass}
                  />
                </div>

                {activeMode === 'signup' && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className={inputClass}
                    />
                  </div>
                )}

                {error && (
                  <div className="animate-fade-in px-3 py-2 rounded-lg bg-red-50 border border-red-200/60 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-ember text-white font-semibold text-sm tracking-wide hover:bg-ember-light active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-md"
                >
                  {activeMode === 'login' ? 'Log In' : 'Create Account'}
                </button>

                {activeMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="w-full text-center text-xs text-warm-gray-400 hover:text-ember transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </form>

              <p className="text-center text-xs text-warm-gray-400 mt-4">
                Only @dartmouth.edu emails accepted
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
