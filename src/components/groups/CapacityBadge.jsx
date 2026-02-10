export default function CapacityBadge({ current, max }) {
  const pct = Math.min((current / max) * 100, 100)
  const isFull = current >= max

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-warm-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isFull ? 'bg-red-400' : pct > 75 ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${
        isFull ? 'text-red-500' : 'text-warm-gray-500'
      }`}>
        {current}/{max}
      </span>
    </div>
  )
}
