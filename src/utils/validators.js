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

  if (!data.dateTime) {
    errors.dateTime = 'Start date and time is required'
  } else if (new Date(data.dateTime) < new Date()) {
    errors.dateTime = 'Start must be in the future'
  }

  if (!data.endDateTime) {
    errors.endDateTime = 'End date and time is required'
  } else if (data.dateTime && new Date(data.endDateTime) <= new Date(data.dateTime)) {
    errors.endDateTime = 'End must be after start'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
