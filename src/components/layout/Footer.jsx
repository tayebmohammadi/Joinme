export default function Footer() {
  return (
    <footer className="bg-white/40 backdrop-blur-sm border-t border-warm-gray-200/60 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm text-bark">Joinme</span>
            <span className="text-warm-gray-300">&middot;</span>
            <span className="text-xs text-warm-gray-400">Made at Dartmouth</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-warm-gray-400 hover:text-ember transition-colors duration-200">Privacy</a>
            <a href="#" className="text-xs text-warm-gray-400 hover:text-ember transition-colors duration-200">Terms</a>
            <a href="#" className="text-xs text-warm-gray-400 hover:text-ember transition-colors duration-200">Help</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
