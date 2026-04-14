import { GROUP_VISUALS } from './constants'

export function isDartmouthEmail(email) {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim().toLowerCase()
  return /^[^\s@]+@dartmouth\.edu$/.test(trimmed)
}

export function validateGroupForm(data) {
  const errors = {}

  if (!data.name?.trim()) errors.name = 'Group name is required'
  if (!data.title?.trim()) errors.title = 'Title is required'
  if (!data.description?.trim()) errors.description = 'Description is required'

  const cap = parseInt(data.capacity, 10)
  if (!cap || cap < 2) errors.capacity = 'Capacity must be at least 2'
  if (cap > 500) errors.capacity = 'Capacity cannot exceed 500'

  if (!['public', 'private'].includes(data.visibility)) {
    errors.visibility = 'Choose public or private'
  }

  if (!['online', 'in-person'].includes(data.meetingType)) {
    errors.meetingType = 'Choose online or in-person'
  }

  if (!data.meetingDetail?.trim()) {
    errors.meetingDetail = data.meetingType === 'online'
      ? 'Meeting URL is required'
      : 'Location is required'
  }

  if (!['quiet', 'loud'].includes(data.space)) {
    errors.space = 'Choose quiet or loud'
  }

  if (!GROUP_VISUALS.some((visual) => visual.id === data.visualId)) {
    errors.visualId = 'Choose a logo style'
  }

  if (!data.meetingDate) {
    errors.meetingDate = 'Meeting date is required'
  }

  if (!data.meetingTime) {
    errors.meetingTime = 'Start time is required'
  }

  if (data.meetingDate && data.meetingTime) {
    const start = new Date(`${data.meetingDate}T${data.meetingTime}`)
    if (Number.isNaN(start.getTime())) {
      errors.meetingTime = 'Choose a valid start date and time'
    } else if (start < new Date(Date.now() - 60 * 1000)) {
      errors.meetingTime = 'Start time cannot be in the past'
    }
  }

  const durationMinutes = parseInt(data.durationMinutes, 10)
  if (!durationMinutes || durationMinutes < 15 || durationMinutes % 15 !== 0) {
    errors.durationMinutes = 'Duration must be in 15-minute increments'
  }

  if (!['none', 'daily', 'weekly', 'biweekly', 'custom-weekdays'].includes(data.recurrence)) {
    errors.recurrence = 'Choose a valid repeat setting'
  }

  if (data.recurrence !== 'none') {
    const recurrenceCount = parseInt(data.recurrenceCount, 10)
    if (!recurrenceCount || recurrenceCount < 1 || recurrenceCount > 20) {
      errors.recurrenceCount = 'Choose between 1 and 20 repeats'
    }
  }

  if (data.recurrence === 'custom-weekdays') {
    if (!Array.isArray(data.recurrenceWeekdays) || data.recurrenceWeekdays.length === 0) {
      errors.recurrenceWeekdays = 'Pick at least one weekday'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
