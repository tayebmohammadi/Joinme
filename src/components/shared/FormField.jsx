export default function FormField({ label, hint, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {hint && (
        <p className="text-[11px] text-warm-gray-500 mb-2 leading-snug -mt-1">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}
