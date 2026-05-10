import PublicLandingInteractiveCanvas from './PublicLandingInteractiveCanvas'

/**
 * Full-bleed ambient motion for the public landing — CSS layers + interactive canvas graph.
 * Canvas uses window pointer listeners (no pointer-events) so the page stays clickable.
 */
export default function PublicLandingBackdrop() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden
    >
      {/* Soft base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f5] via-[#f3f1eb] to-[#ebe8e0]" />

      {/* Slow-shifting color field */}
      <div
        className="absolute -inset-[40%] opacity-[0.55] motion-reduce:opacity-40 motion-reduce:animate-none animate-landing-aurora bg-[radial-gradient(ellipse_at_30%_20%,rgba(159,232,112,0.35)_0%,transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(255,209,26,0.12)_0%,transparent_45%),radial-gradient(ellipse_at_50%_50%,rgba(5,77,40,0.06)_0%,transparent_50%)]"
      />

      {/* Drifting “soap bubble” orbs — gentle, amusing */}
      <div className="absolute top-[8%] left-[5%] h-72 w-72 rounded-full bg-gradient-to-br from-ember/20 to-ember-light/5 blur-3xl motion-reduce:animate-none animate-landing-blob-1" />
      <div className="absolute bottom-[12%] right-[8%] h-96 w-96 rounded-full bg-gradient-to-tl from-amber-200/25 to-ember/10 blur-3xl motion-reduce:animate-none animate-landing-blob-2" />
      <div className="absolute top-[40%] right-[15%] h-48 w-48 rounded-full bg-forest/10 blur-2xl motion-reduce:animate-none animate-landing-blob-3" />
      <div className="absolute bottom-[35%] left-[20%] h-56 w-56 rounded-full bg-white/40 blur-2xl motion-reduce:animate-none animate-landing-blob-4" />

      {/* Colorful graph shapes + edges — scatter / gather with pointer (above soft blobs) */}
      <PublicLandingInteractiveCanvas />

      {/* Tiny drifting motes — constellation feel */}
      <div className="absolute inset-0 opacity-[0.35] motion-reduce:opacity-20 motion-reduce:animate-none animate-landing-drift">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-bark/15 motion-reduce:!animate-none motion-reduce:opacity-30 animate-landing-twinkle"
            style={{
              width: 3 + (i % 4),
              height: 3 + (i % 4),
              left: `${8 + (i * 7.3) % 84}%`,
              top: `${12 + (i * 11.7) % 76}%`,
              animationDelay: `${i * 0.37}s`,
              animationDuration: `${3.2 + (i % 5) * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Fine grain — stops flat “digital” feel */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
