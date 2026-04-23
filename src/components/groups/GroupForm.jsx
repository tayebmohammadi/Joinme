import { useEffect, useMemo, useState } from 'react'
import { useGroups } from '../../context/GroupsContext'
import { useNavigation } from '../../context/NavigationContext'
import { validateGroupForm } from '../../utils/validators'
import {
  PAGES,
  CAMPUS_LOCATIONS,
  GROUP_VISUALS,
  GROUP_CATEGORIES,
  getVisualsByCategory,
  getGroupVisualById,
  formatDateTimeRange,
} from '../../utils/constants'
import FormField from '../shared/FormField'

const STEP_MINUTES = 15
const TOTAL_SLOTS = (24 * 60) / STEP_MINUTES // 96

function pad2(n) {
  return String(n).padStart(2, '0')
}

function toDateInputValue(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function toTimeInputValue(date) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

function nextQuarterHour(date) {
  const d = new Date(date)
  d.setSeconds(0, 0)
  const remainder = d.getMinutes() % STEP_MINUTES
  if (remainder !== 0) {
    d.setMinutes(d.getMinutes() + (STEP_MINUTES - remainder))
  }
  return d
}

function buildTimeOptions(minMinutesIntoDay = 0) {
  const options = []
  for (let i = 0; i < TOTAL_SLOTS; i += 1) {
    const hour = Math.floor(i / 4)
    const minute = (i % 4) * 15
    const minutesIntoDay = hour * 60 + minute
    if (minutesIntoDay < minMinutesIntoDay) continue
    const value = `${pad2(hour)}:${pad2(minute)}`
    const display = new Date()
    display.setHours(hour, minute, 0, 0)
    const label = display.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    options.push({ value, label })
  }
  return options
}

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

const CATEGORY_TABS = [{ id: 'all', label: 'All', emoji: '✨' }, ...GROUP_CATEGORIES]

export default function GroupForm() {
  const { createGroup } = useGroups()
  const { navigate } = useNavigation()
  const [errors, setErrors] = useState({})

  const initialRoundedNow = nextQuarterHour(new Date())
  const todayStr = toDateInputValue(new Date())
  const [activeCategory, setActiveCategory] = useState(getGroupVisualById(GROUP_VISUALS[0].id)?.category || 'all')

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
    meetingDate: toDateInputValue(initialRoundedNow),
    meetingTime: toTimeInputValue(initialRoundedNow),
    durationMinutes: '60',
    recurrence: 'none',
    recurrenceCount: '1',
    recurrenceWeekdays: [String(initialRoundedNow.getDay())],
  })

  // Today snapshot for date/time guarding (refreshes once per minute)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const todayValue = toDateInputValue(now)

  const isToday = form.meetingDate === todayValue
  const minMinutesIntoDay = useMemo(() => {
    if (!isToday) return 0
    const next = nextQuarterHour(now)
    return next.getHours() * 60 + next.getMinutes()
  }, [isToday, now])

  const timeOptions = useMemo(
    () => buildTimeOptions(minMinutesIntoDay),
    [minMinutesIntoDay]
  )

  // If selected date is today and the chosen time is now in the past,
  // snap up to the next valid 15-minute slot.
  useEffect(() => {
    if (!isToday || timeOptions.length === 0) return
    const stillValid = timeOptions.some((opt) => opt.value === form.meetingTime)
    if (!stillValid) {
      setForm((prev) => ({ ...prev, meetingTime: timeOptions[0].value }))
    }
  }, [isToday, timeOptions, form.meetingTime])

  // If selected date became "before today" (e.g. day rollover), snap to today.
  useEffect(() => {
    if (form.meetingDate && form.meetingDate < todayValue) {
      setForm((prev) => ({ ...prev, meetingDate: todayValue }))
    }
  }, [form.meetingDate, todayValue])

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleDateChange = (e) => {
    const value = e.target.value
    const next = value && value < todayValue ? todayValue : value
    setForm((prev) => ({ ...prev, meetingDate: next }))
    if (errors.meetingDate) setErrors((prev) => ({ ...prev, meetingDate: undefined }))
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

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg bg-white border border-warm-gray-200 text-sm text-bark placeholder:text-warm-gray-400 focus:outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember/40 transition-all'
  const toggleClass = (active) =>
    `flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
      active
        ? 'bg-bark text-white border-bark shadow-sm'
        : 'bg-white text-warm-gray-500 border-warm-gray-200 hover:border-warm-gray-300 hover:text-warm-gray-700'
    }`

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: formErrors } = validateGroupForm(form)
    if (!valid) {
      setErrors(formErrors)
      // Scroll to first error nicely
      const firstError = document.querySelector('[data-form-error]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const group = createGroup(form)
    navigate(PAGES.GROUP_DETAIL, { groupId: group.id })
  }

  const selectedVisual = getGroupVisualById(form.visualId) || GROUP_VISUALS[0]
  const visibleVisuals = getVisualsByCategory(activeCategory)
  const previewDateTime = form.meetingDate && form.meetingTime
    ? new Date(`${form.meetingDate}T${form.meetingTime}`)
    : null
  const previewEndDateTime = previewDateTime
    ? new Date(previewDateTime.getTime() + parseInt(form.durationMinutes, 10) * 60_000)
    : null

  const sectionClass = 'rounded-2xl border border-warm-gray-200/70 bg-white p-6 space-y-5'
  const sectionTitleClass = 'text-xs font-bold tracking-[0.18em] uppercase text-warm-gray-400'

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-ember-dark mb-2">
            Create Group
          </p>
          <h1 className="font-serif text-3xl text-bark leading-tight">
            Spin up a new student group
          </h1>
          <p className="text-warm-gray-500 text-sm mt-1.5">
            Pick a vibe, set the time and place, and invite your campus crew.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(PAGES.BROWSE)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-warm-gray-500 hover:text-bark hover:bg-warm-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <div className="space-y-5">
          {/* Vibe / category picker */}
          <section className={sectionClass}>
            <div className="flex items-baseline justify-between">
              <h2 className={sectionTitleClass}>Group Vibe</h2>
              <span className="text-[11px] text-warm-gray-400">
                {visibleVisuals.length} options
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_TABS.map((cat) => {
                const active = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? 'bg-bark text-white shadow-sm'
                        : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
              data-form-error={errors.visualId ? true : undefined}
            >
              {visibleVisuals.map((visual) => {
                const selected = form.visualId === visual.id
                return (
                  <button
                    key={visual.id}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, visualId: visual.id }))
                      setErrors((prev) => ({ ...prev, visualId: undefined }))
                    }}
                    className={`group rounded-xl border p-2 text-left transition-all ${
                      selected
                        ? 'border-bark ring-2 ring-bark/15 bg-white shadow-sm'
                        : 'border-warm-gray-200 bg-white hover:border-warm-gray-300 hover:-translate-y-0.5'
                    }`}
                  >
                    <div
                      className="relative h-16 rounded-lg overflow-hidden mb-2"
                      style={{ background: `linear-gradient(135deg, ${visual.colors[0]}, ${visual.colors[1]})` }}
                    >
                      <div className="absolute inset-0 bg-black/5" />
                      <span className="absolute left-2 bottom-1.5 text-[9px] font-bold tracking-wide text-white bg-black/25 rounded px-1.5 py-0.5">
                        {visual.badge}
                      </span>
                      {selected && (
                        <span className="absolute right-1.5 top-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-bark shadow">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-bark leading-tight">{visual.name}</p>
                  </button>
                )
              })}
            </div>
            {errors.visualId && (
              <p className="text-xs text-red-600">{errors.visualId}</p>
            )}
          </section>

          {/* Basics */}
          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>Basics</h2>

            <div data-form-error={errors.name ? true : undefined}>
              <FormField label="Group Name" error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g., Morning Study Crew"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div data-form-error={errors.title ? true : undefined}>
              <FormField label="Short Title" error={errors.title}>
                <input
                  type="text"
                  value={form.title}
                  onChange={set('title')}
                  placeholder="e.g., Daily library study sessions"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div data-form-error={errors.description ? true : undefined}>
              <FormField label="Description" error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={3}
                  placeholder="What's this group about?"
                  className={`${inputClass} resize-none`}
                />
              </FormField>
            </div>
          </section>

          {/* Logistics */}
          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>Logistics</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div data-form-error={errors.visibility ? true : undefined}>
                <FormField label="Visibility" error={errors.visibility}>
                  <div className="flex gap-2">
                    {['public', 'private'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, visibility: v }))
                          setErrors((prev) => ({ ...prev, visibility: undefined }))
                        }}
                        className={toggleClass(form.visibility === v)}
                      >
                        {v === 'public' ? 'Public' : 'Private'}
                      </button>
                    ))}
                  </div>
                </FormField>
              </div>

              <div data-form-error={errors.capacity ? true : undefined}>
                <FormField label="Capacity" error={errors.capacity}>
                  <input
                    type="number"
                    min="2"
                    max="500"
                    value={form.capacity}
                    onChange={set('capacity')}
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div data-form-error={errors.meetingType ? true : undefined}>
                <FormField label="Meeting Type" error={errors.meetingType}>
                  <div className="flex gap-2">
                    {['in-person', 'online'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, meetingType: v, meetingDetail: '' }))
                          setErrors((prev) => ({ ...prev, meetingType: undefined }))
                        }}
                        className={toggleClass(form.meetingType === v)}
                      >
                        {v === 'in-person' ? 'In-Person' : 'Online'}
                      </button>
                    ))}
                  </div>
                </FormField>
              </div>

              <div data-form-error={errors.space ? true : undefined}>
                <FormField label="Space Vibe" error={errors.space}>
                  <div className="flex gap-2">
                    {['quiet', 'loud'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, space: v }))
                          setErrors((prev) => ({ ...prev, space: undefined }))
                        }}
                        className={toggleClass(form.space === v)}
                      >
                        {v === 'quiet' ? 'Quiet' : 'Loud'}
                      </button>
                    ))}
                  </div>
                </FormField>
              </div>
            </div>

            <div data-form-error={errors.meetingDetail ? true : undefined}>
              <FormField
                label={form.meetingType === 'online' ? 'Meeting URL' : 'Campus Location'}
                error={errors.meetingDetail}
              >
                {form.meetingType === 'online' ? (
                  <input
                    type="text"
                    value={form.meetingDetail}
                    onChange={set('meetingDetail')}
                    placeholder="https://zoom.us/…"
                    className={inputClass}
                  />
                ) : (
                  <select value={form.meetingDetail} onChange={set('meetingDetail')} className={inputClass}>
                    <option value="">Select a location…</option>
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                )}
              </FormField>
            </div>
          </section>

          {/* Schedule */}
          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>Schedule</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div data-form-error={errors.meetingDate ? true : undefined}>
                <FormField label="Date" error={errors.meetingDate}>
                  <input
                    type="date"
                    value={form.meetingDate}
                    min={todayStr}
                    onChange={handleDateChange}
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div data-form-error={errors.meetingTime ? true : undefined}>
                <FormField label="Start Time" error={errors.meetingTime}>
                  <select value={form.meetingTime} onChange={set('meetingTime')} className={inputClass}>
                    {timeOptions.length === 0 ? (
                      <option value="">No times available today</option>
                    ) : (
                      timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    )}
                  </select>
                  {isToday && (
                    <p className="mt-1 text-[11px] text-warm-gray-400">
                      Times are shown in 15-minute blocks from now.
                    </p>
                  )}
                </FormField>
              </div>

              <div data-form-error={errors.durationMinutes ? true : undefined}>
                <FormField label="Duration" error={errors.durationMinutes}>
                  <select value={form.durationMinutes} onChange={set('durationMinutes')} className={inputClass}>
                    {DURATION_OPTIONS.map((minutes) => {
                      const h = Math.floor(minutes / 60)
                      const m = minutes % 60
                      const label = minutes < 60
                        ? `${minutes} min`
                        : m === 0
                          ? `${h} hr`
                          : `${h} hr ${m} min`
                      return (
                        <option key={minutes} value={String(minutes)}>
                          {label}
                        </option>
                      )
                    })}
                  </select>
                </FormField>
              </div>
            </div>

            <div data-form-error={errors.recurrence ? true : undefined}>
              <FormField label="Repeats" error={errors.recurrence}>
                <select value={form.recurrence} onChange={set('recurrence')} className={inputClass}>
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="custom-weekdays">Custom weekdays</option>
                </select>
              </FormField>
            </div>

            {form.recurrence === 'custom-weekdays' && (
              <div data-form-error={errors.recurrenceWeekdays ? true : undefined}>
                <FormField label="Repeat on days" error={errors.recurrenceWeekdays}>
                  <div className="grid grid-cols-7 gap-1.5">
                    {WEEKDAY_OPTIONS.map((weekday) => {
                      const active = form.recurrenceWeekdays.includes(weekday.value)
                      return (
                        <button
                          key={weekday.value}
                          type="button"
                          onClick={() => toggleWeekday(weekday.value)}
                          className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                            active
                              ? 'bg-bark text-white border-bark'
                              : 'bg-white text-warm-gray-500 border-warm-gray-200 hover:border-warm-gray-300 hover:text-warm-gray-700'
                          }`}
                        >
                          {weekday.label}
                        </button>
                      )
                    })}
                  </div>
                </FormField>
              </div>
            )}

            {form.recurrence !== 'none' && (
              <div data-form-error={errors.recurrenceCount ? true : undefined}>
                <FormField label="How many times?" error={errors.recurrenceCount}>
                  <select value={form.recurrenceCount} onChange={set('recurrenceCount')} className={inputClass}>
                    {REPEAT_COUNT_OPTIONS.map((count) => (
                      <option key={count} value={String(count)}>
                        {count} {count === 1 ? 'time' : 'times'}
                      </option>
                    ))}
                  </select>
                </FormField>
                <p className="mt-2 text-xs text-warm-gray-500">
                  Creates {form.recurrenceCount} scheduled meetings in this series.
                </p>
              </div>
            )}
          </section>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(PAGES.BROWSE)}
              className="flex-1 sm:flex-none sm:px-6 py-3 rounded-xl bg-white border border-warm-gray-200 text-sm font-semibold text-warm-gray-600 hover:text-bark hover:border-warm-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-ember text-ember-dark font-semibold text-sm tracking-wide hover:bg-ember-light hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 shadow-ring"
            >
              Create Group
            </button>
          </div>
        </div>

        {/* Preview rail */}
        <aside className="lg:sticky lg:top-6 self-start">
          <div className="rounded-2xl border border-warm-gray-200/70 bg-white overflow-hidden shadow-sm">
            <div
              className="relative h-32"
              style={{ background: `linear-gradient(135deg, ${selectedVisual.colors[0]}, ${selectedVisual.colors[1]})` }}
            >
              <div className="absolute inset-0 bg-black/5" />
              <div className="absolute right-3 bottom-3 rounded-lg border border-white/40 px-2.5 py-1 bg-black/15">
                <p className="text-[10px] font-bold tracking-[0.08em] text-white">
                  {selectedVisual.badge}
                </p>
              </div>
              {previewDateTime && (
                <div className="absolute left-3 top-3 rounded-xl bg-white px-2.5 py-1.5 text-center shadow-md">
                  <p className="text-[9px] font-bold tracking-wide text-ember-dark">
                    {previewDateTime.toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                  </p>
                  <p className="text-sm font-bold text-bark leading-none mt-0.5">
                    {previewDateTime.getDate()}
                  </p>
                </div>
              )}
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-warm-gray-400">
                  Live preview
                </p>
                <h3 className="font-serif text-lg text-bark leading-snug mt-1 truncate">
                  {form.name || 'Your group name'}
                </h3>
                <p className="text-[11px] text-warm-gray-500 mt-0.5 line-clamp-2">
                  {form.title || 'Add a short title to describe the vibe'}
                </p>
              </div>

              <p className="text-xs text-warm-gray-600 line-clamp-3">
                {form.description || 'Your description will show up here.'}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-warm-gray-100">
                <div className="flex items-center gap-2 text-xs text-warm-gray-600">
                  <svg className="w-3.5 h-3.5 text-warm-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <span className="truncate">
                    {previewDateTime
                      ? formatDateTimeRange(previewDateTime.toISOString(), previewEndDateTime?.toISOString())
                      : 'Date & time pending'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-warm-gray-600">
                  <svg className="w-3.5 h-3.5 text-warm-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="truncate">
                    {form.meetingType === 'online'
                      ? form.meetingDetail || 'Online'
                      : form.meetingDetail || 'Pick a campus location'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-warm-gray-600">
                  <svg className="w-3.5 h-3.5 text-warm-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72M3 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72M12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>
                  <span>Up to {form.capacity || 0} members</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="tag bg-warm-gray-100 text-warm-gray-600">
                  {form.meetingType === 'online' ? 'Online' : 'In-Person'}
                </span>
                <span className="tag bg-warm-gray-100 text-warm-gray-600">
                  {form.visibility === 'public' ? 'Public' : 'Private'}
                </span>
                <span className="tag bg-warm-gray-100 text-warm-gray-600 capitalize">
                  {form.space}
                </span>
                {form.recurrence !== 'none' && (
                  <span className="tag bg-wise-mint text-ember-dark capitalize">
                    {form.recurrence === 'custom-weekdays' ? 'Custom days' : form.recurrence}
                  </span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}
