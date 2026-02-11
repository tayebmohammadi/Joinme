export default function Loading({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`${sizes[size]} rounded-full border-3 border-warm-gray-200 border-t-ember animate-spin`}></div>
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-r from-ember to-violet rounded-full animate-pulse"></div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-sm text-warm-gray-500 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export function LoadingSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="card-base p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-warm-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-warm-gray-100 rounded w-1/2"></div>
          </div>
          <div className="w-8 h-8 bg-warm-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 bg-warm-gray-100 rounded w-full"></div>
        <div className="h-4 bg-warm-gray-100 rounded w-2/3"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-warm-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-warm-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-warm-gray-200 rounded-full w-18"></div>
        </div>
      </div>
    </div>
  )
}
