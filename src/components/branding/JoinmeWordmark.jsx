/**
 * Simple Joinme branding: emblem + wordmark — used on public landing & headers.
 */
export function JoinmeEmblem({ className = 'h-14 w-14' }) {
  return (
    <div
      className={`${className} rounded-[1.35rem] bg-gradient-to-br from-ember to-amber-500 flex items-center justify-center shadow-ring shrink-0`}
      aria-hidden
    >
      <svg className="w-[45%] h-[45%] text-ember-dark drop-shadow-sm" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m0 0a5.971 5.971 0 0 1-.943 3.198M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    </div>
  )
}

export function JoinmeWordmark({ showTagline = true, size = 'default' }) {
  const heading = size === 'large' ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl'
  const emblemCls = size === 'large' ? 'h-[4.25rem] w-[4.25rem]' : ''
  return (
    <div className="flex items-start gap-4">
      <JoinmeEmblem className={emblemCls || 'h-14 w-14'} />
      <div className="min-w-0 text-left pt-0.5">
        <p className="font-serif text-warm-gray-500 text-xs sm:text-sm tracking-[0.2em] uppercase font-bold mb-1">
          Campus groups
        </p>
        <h1 className={`font-serif text-bark ${heading} tracking-tight leading-none`}>Joinme</h1>
        {showTagline && (
          <p className="text-warm-gray-600 text-sm sm:text-base mt-2 leading-snug max-w-md">
            Find study circles, meetups, and student orgs across Dartmouth.
          </p>
        )}
      </div>
    </div>
  )
}
