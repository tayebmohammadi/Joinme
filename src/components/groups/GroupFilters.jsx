export default function GroupFilters({
  searchInput, setSearchInput,
  meetingType, setMeetingType,
  spaceType, setSpaceType,
  visibility, setVisibility,
  hasOpenSpots, setHasOpenSpots,
  activeFilterCount, clearAll,
}) {
  const selectClass = 'px-3 py-2 rounded-lg bg-parchment/70 border border-warm-gray-200 text-xs font-medium text-bark focus:outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember/40 transition-all'

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search groups…"
          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-parchment/70 border border-warm-gray-200 text-sm text-bark placeholder:text-warm-gray-400 focus:outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember/40 transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select value={meetingType} onChange={(e) => setMeetingType(e.target.value)} className={selectClass}>
          <option value="">All Types</option>
          <option value="online">Online</option>
          <option value="in-person">In-Person</option>
        </select>

        <select value={spaceType} onChange={(e) => setSpaceType(e.target.value)} className={selectClass}>
          <option value="">All Spaces</option>
          <option value="quiet">Quiet</option>
          <option value="loud">Loud</option>
        </select>

        <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className={selectClass}>
          <option value="">All Visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <label className="flex items-center gap-1.5 text-xs font-medium text-warm-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={hasOpenSpots}
            onChange={(e) => setHasOpenSpots(e.target.checked)}
            className="rounded border-warm-gray-300 text-ember focus:ring-ember/20"
          />
          Open spots
        </label>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-ember hover:text-ember-light transition-colors ml-auto"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  )
}
