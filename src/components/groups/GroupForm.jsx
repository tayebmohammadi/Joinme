import { useState } from 'react'
import { useGroups } from '../../context/GroupsContext'
import { useNavigation } from '../../context/NavigationContext'
import { validateGroupForm } from '../../utils/validators'
import { PAGES, CAMPUS_LOCATIONS } from '../../utils/constants'
import FormField from '../shared/FormField'

export default function GroupForm() {
  const { createGroup } = useGroups()
  const { navigate } = useNavigation()
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    capacity: '10',
    visibility: 'public',
    meetingType: 'in-person',
    meetingDetail: '',
    space: 'quiet',
    dateTime: '',
    endDateTime: '',
  })

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
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

        <FormField label="Start Time" error={errors.dateTime}>
          <input type="datetime-local" step="300" value={form.dateTime} onChange={set('dateTime')} className={inputClass} />
        </FormField>

        <FormField label="End Time" error={errors.endDateTime}>
          <input type="datetime-local" step="300" value={form.endDateTime} onChange={set('endDateTime')} className={inputClass} />
        </FormField>

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
