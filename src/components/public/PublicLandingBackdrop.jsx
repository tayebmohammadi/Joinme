import PublicLandingInteractiveCanvas from './PublicLandingInteractiveCanvas'

/**
 * Full-bleed ambient backdrop — CSS layers + graph canvas.
 * @param {boolean} [stationaryGraph=false] — Signed-in app: same graph, frozen (no pointer / RAF); CSS blobs/aurora/motes also still.
 */
export default function PublicLandingBackdrop({ stationaryGraph = false }) {
  const still = stationaryGraph

  const aurora = still
    ? 'absolute -inset-[40%] opacity-[0.55] motion-reduce:opacity-40 !animate-none bg-[radial-gradient(ellipse_at_30%_20%,rgba(159,232,112,0.35)_0%,transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(255,209,26,0.12)_0%,transparent_45%),radial-gradient(ellipse_at_50%_50%,rgba(5,77,40,0.06)_0%,transparent_50%)]'
    : 'absolute -inset-[40%] opacity-[0.55] motion-reduce:opacity-40 motion-reduce:animate-none animate-landing-aurora bg-[radial-gradient(ellipse_at_30%_20%,rgba(159,232,112,0.35)_0%,transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(255,209,26,0.12)_0%,transparent_45%),radial-gradient(ellipse_at_50%_50%,rgba(5,77,40,0.06)_0%,transparent_50%)]'

  const b1 = still
    ? 'absolute top-[8%] left-[5%] h-72 w-72 rounded-full bg-gradient-to-br from-ember/20 to-ember-light/5 blur-3xl !animate-none'
    : 'absolute top-[8%] left-[5%] h-72 w-72 rounded-full bg-gradient-to-br from-ember/20 to-ember-light/5 blur-3xl motion-reduce:animate-none animate-landing-blob-1'
  const b2 = still
    ? 'absolute bottom-[12%] right-[8%] h-96 w-96 rounded-full bg-gradient-to-tl from-amber-200/25 to-ember/10 blur-3xl !animate-none'
    : 'absolute bottom-[12%] right-[8%] h-96 w-96 rounded-full bg-gradient-to-tl from-amber-200/25 to-ember/10 blur-3xl motion-reduce:animate-none animate-landing-blob-2'
  const b3 = still
    ? 'absolute top-[40%] right-[15%] h-48 w-48 rounded-full bg-forest/10 blur-2xl !animate-none'
    : 'absolute top-[40%] right-[15%] h-48 w-48 rounded-full bg-forest/10 blur-2xl motion-reduce:animate-none animate-landing-blob-3'
  const b4 = still
    ? 'absolute bottom-[35%] left-[20%] h-56 w-56 rounded-full bg-white/40 blur-2xl !animate-none'
    : 'absolute bottom-[35%] left-[20%] h-56 w-56 rounded-full bg-white/40 blur-2xl motion-reduce:animate-none animate-landing-blob-4'

  const drift = still
    ? 'absolute inset-0 opacity-[0.35] motion-reduce:opacity-20 !animate-none'
    : 'absolute inset-0 opacity-[0.35] motion-reduce:opacity-20 motion-reduce:animate-none animate-landing-drift'

  const mote = still
    ? 'absolute rounded-full bg-bark/15 motion-reduce:!animate-none motion-reduce:opacity-30 !animate-none'
    : 'absolute rounded-full bg-bark/15 motion-reduce:!animate-none motion-reduce:opacity-30 animate-landing-twinkle'

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f5] via-[#f3f1eb] to-[#ebe8e0]" />

      <div className={aurora} />

      <div className={b1} />
      <div className={b2} />
      <div className={b3} />
      <div className={b4} />

      <PublicLandingInteractiveCanvas stationary={stationaryGraph} />

      <div className={drift}>
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className={mote}
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

      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
