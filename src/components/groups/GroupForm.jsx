import { useState } from 'react'
import { useGroups } from '../../context/GroupsContext'
import { useNavigation } from '../../context/NavigationContext'
import { validateGroupForm } from '../../utils/validators'
import { PAGES, CAMPUS_LOCATIONS, GROUP_VISUALS } from '../../utils/constants'
import FormField from '../shared/FormField'

export default function GroupForm() {
  const { createGroup } = useGroups()
  const { navigate } = useNavigation()
  const [errors, setErrors] = useState({})

  const now = new Date()
  const roundedNow = new Date(now)
  roundedNow.setSeconds(0, 0)
  const remainder = roundedNow.getMinutes() % 15
  if (remainder !== 0) {
    roundedNow.setMinutes(roundedNow.getMinutes() + (15 - remainder))
  }

  const defaultDate = `${roundedNow.getFullYear()}-${String(roundedNow.getMonth() + 1).padStart(2, '0')}-${String(roundedNow.getDate()).padStart(2, '0')}`
  const defaultTime = `${String(roundedNow.getHours()).padStart(2, '0')}:${String(roundedNow.getMinutes()).padStart(2, '0')}`

  const TIME_OPTIONS = Array.from({ length: 96 }, (_, index) => {
    const hour = Math.floor(index / 4)
    const minute = (index % 4) * 15
    const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    const displayDate = new Date()
    displayDate.setHours(hour, minute, 0, 0)
    const label = displayDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return { value, label }
  })

  const DURATION_OPTIONS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15)
  const REPEAT_COUNT_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1)
  const WEEKDAY_OPTIONS = [
    { value: '0', label: 'Sun' },
    { value: '1', label: 'Mon' },
    { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' },
    { value: '4', label: 'Thu' },
    { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' },
  ]

  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    capacity: '10',
    visibility: 'public',
    meetingType: 'in-person',
    meetingDetail: '',
    space: 'quiet',
    visualId: GROUP_VISUALS[0].id,
    meetingDate: defaultDate,
    meetingTime: defaultTime,
    durationMinutes: '60',
    recurrence: 'none',
    recurrenceCount: '1',
    recurrenceWeekdays: [String(roundedNow.getDay())],
  })

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const toggleWeekday = (weekday) => {
    setForm((prev) => {
      const exists = prev.recurrenceWeekdays.includes(weekday)
      const recurrenceWeekdays = exists
        ? prev.recurrenceWeekdays.filter((day) => day !== weekday)
        : [...prev.recurrenceWeekdays, weekday].sort((a, b) => Number(a) - Number(b))
      return { ...prev, recurrenceWeekdays }
    })
    if (errors.recurrenceWeekdays) {
      setErrors((prev) => ({ ...prev, recurrenceWeekdays: undefined }))
    }
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg bg-parchment/70 border border-warm-gray-200 text-sm text-bark placeholder:text-warm-gray-400 focus:outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember/40 transition-all'
  const toggleClass = (active) => `flex-1 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
    active
      ? 'bg-bark text-cream border-bark shadow-sm'
      : 'bg-parchment/50 text-warm-gray-500 border-warm-gray-200 hover:border-warm-gray-300 hover:text-warm-gray-700'
  }`

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: formErrors } = validateGroupForm(form)
    if (!valid) {
      setErrors(formErrors)
      return
    }
    const group = createGroup(form)
    navigate(PAGES.GROUP_DETAIL, { groupId: group.id })
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6 animate-fade-in">
        <h2 className="font-serif text-3xl text-bark mb-1">Create Group</h2>
        <p className="text-warm-gray-500 text-sm">Set up a new student group</p>
      </div>

      <form onSubmit={handleSubmit} className="card-base p-6 space-y-4 animate-fade-in-up">
        <FormField label="Group Name" error={errors.name}>
          <input type="text" value={form.name} onChange={set('name')} placeholder="e.g., Morning Study Crew" className={inputClass} />
        </FormField>

        <FormField label="Short Title" error={errors.title}>
          <input type="text" value={form.title} onChange={set('title')} placeholder="e.g., Daily library study sessions" className={inputClass} />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="What's this group about?" className={`${inputClass} resize-none`} />
        </FormField>

        <FormField label="Group Logo Style" error={errors.visualId}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {GROUP_VISUALS.map((visual) => {
              const selected = form.visualId === visual.id
              return (
                <button
                  key={visual.id}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, visualId: visual.id }))
                    setErrors((prev) => ({ ...prev, visualId: undefined }))
                  }}
                  className={`rounded-xl border p-2 text-left transition-all ${
                    selected
                      ? 'border-bark ring-2 ring-bark/15 bg-white'
                      : 'border-warm-gray-200 bg-parchment/40 hover:border-warm-gray-300'
                  }`}
                >
                  <div
                    className="h-12 rounded-lg mb-2 flex items-end p-2"
                    style={{ background: `linear-gradient(135deg, ${visual.colors[0]}, ${visual.colors[1]})` }}
                  >
                    <span className="text-[10px] font-bold tracking-wide text-white bg-black/20 rounded px-1.5 py-0.5">
                      {visual.badge}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-bark leading-tight">{visual.name}</p>
                  {visual.description && (
                    <p className="mt-1 text-[10px] leading-snug text-warm-gray-500 line-clamp-3">
                      {visual.description}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </FormField>

        <FormField label="Capacity" error={errors.capacity}>
          <input type="number" min="2" max="500" value={form.capacity} onChange={set('capacity')} className={inputClass} />
        </FormField>

        <FormField label="Visibility" error={errors.visibility}>
          <div className="flex gap-2">
            {['public', 'private'].map(v => (
              <button key={v} type="button" onClick={() => { setForm(prev => ({ ...prev, visibility: v })); setErrors(prev => ({ ...prev, visibility: undefined })) }} className={toggleClass(form.visibility === v)}>
                {v === 'public' ? 'Public' : 'Private'}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Meeting Type" error={errors.meetingType}>
          <div className="flex gap-2">
            {['in-person', 'online'].map(v => (
              <button key={v} type="button" onClick={() => { setForm(prev => ({ ...prev, meetingType: v, meetingDetail: '' })); setErrors(prev => ({ ...prev, meetingType: undefined })) }} className={toggleClass(form.meetingType === v)}>
                {v === 'in-person' ? 'In-Person' : 'Online'}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label={form.meetingType === 'online' ? 'Meeting URL' : 'Campus Location'} error={errors.meetingDetail}>
          {form.meetingType === 'online' ? (
            <input type="text" value={form.meetingDetail} onChange={set('meetingDetail')} placeholder="https://zoom.us/…" className={inputClass} />
          ) : (
            <select value={form.meetingDetail} onChange={set('meetingDetail')} className={inputClass}>
              <option value="">Select a location…</option>
              {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          )}
        </FormField>

        <FormField label="Space Vibe" error={errors.space}>
          <div className="flex gap-2">
            {['quiet', 'loud'].map(v => (
              <button key={v} type="button" onClick={() => { setForm(prev => ({ ...prev, space: v })); setErrors(prev => ({ ...prev, space: undefined })) }} className={toggleClass(form.space === v)}>
                {v === 'quiet' ? 'Quiet' : 'Loud'}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Meeting Date" error={errors.meetingDate}>
          <input type="date" value={form.meetingDate} onChange={set('meetingDate')} className={inputClass} />
        </FormField>

        <FormField label="Start Time" error={errors.meetingTime}>
          <select value={form.meetingTime} onChange={set('meetingTime')} className={inputClass}>
            {TIME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Duration" error={errors.durationMinutes}>
          <select value={form.durationMinutes} onChange={set('durationMinutes')} className={inputClass}>
            {DURATION_OPTIONS.map((minutes) => (
              <option key={minutes} value={String(minutes)}>
                {minutes} min
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Repeats" error={errors.recurrence}>
          <select value={form.recurrence} onChange={set('recurrence')} className={inputClass}>
            <option value="none">Does not repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every 2 weeks</option>
            <option value="custom-weekdays">Custom weekdays</option>
          </select>
        </FormField>

        {form.recurrence === 'custom-weekdays' && (
          <FormField label="Repeat on days" error={errors.recurrenceWeekdays}>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {WEEKDAY_OPTIONS.map((weekday) => {
                const active = form.recurrenceWeekdays.includes(weekday.value)
                return (
                  <button
                    key={weekday.value}
                    type="button"
                    onClick={() => toggleWeekday(weekday.value)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      active
                        ? 'bg-bark text-cream border-bark'
                        : 'bg-parchment/50 text-warm-gray-500 border-warm-gray-200 hover:border-warm-gray-300 hover:text-warm-gray-700'
                    }`}
                  >
                    {weekday.label}
                  </button>
                )
              })}
            </div>
          </FormField>
        )}

        {form.recurrence !== 'none' && (
          <FormField label="How many times?" error={errors.recurrenceCount}>
            <select value={form.recurrenceCount} onChange={set('recurrenceCount')} className={inputClass}>
              {REPEAT_COUNT_OPTIONS.map((count) => (
                <option key={count} value={String(count)}>
                  {count} times
                </option>
              ))}
            </select>
          </FormField>
        )}

        {form.recurrence !== 'none' && (
          <p className="text-xs text-warm-gray-500">
            This will create {form.recurrenceCount} scheduled meetings in this series.
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(PAGES.BROWSE)}
            className="flex-1 py-3 rounded-xl bg-parchment border border-warm-gray-200 text-sm font-semibold text-warm-gray-600 hover:text-bark hover:border-warm-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-ember text-white font-semibold text-sm tracking-wide hover:bg-ember-light active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-md"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  )
}
