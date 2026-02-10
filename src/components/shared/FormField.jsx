export default function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-warm-gray-600 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}
