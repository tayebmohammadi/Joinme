export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-12 animate-fade-in">
      {icon && (
        <div className="w-14 h-14 rounded-full bg-parchment border border-warm-gray-200/60 flex items-center justify-center mx-auto mb-4 text-warm-gray-400">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl text-bark mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-warm-gray-500 max-w-xs mx-auto">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
