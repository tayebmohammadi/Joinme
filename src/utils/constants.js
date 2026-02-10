export const PAGES = {
  BROWSE: 'browse',
  CREATE_GROUP: 'create_group',
  GROUP_DETAIL: 'group_detail',
  PROFILE: 'profile',
}

export const CAMPUS_LOCATIONS = [
  'Baker-Berry Library',
  'Collis Center',
  'Dartmouth Green',
  'Fairchild Science Center',
  'Foco (Class of 1953 Commons)',
  'Hop (Hopkins Center)',
  'Life Sciences Center',
  'McLaughlin Cluster',
  'Murdough Center',
  'BEMA',
  'Occom Pond',
  'Robinson Hall',
  'Silsby Hall',
  'Thayer School of Engineering',
  'Tuck School of Business',
]

export const MEETING_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'In-Person' },
]

export const SPACE_TYPES = [
  { value: 'quiet', label: 'Quiet' },
  { value: 'loud', label: 'Loud' },
]

export const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
]

export function getWaitlistCapacity(groupCapacity) {
  return Math.max(Math.ceil(groupCapacity * 0.1), 3)
}

export function isGroupArchived(group) {
  const endField = group.endDateTime || group.dateTime
  return endField && new Date(endField) < new Date()
}

export function formatDateTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatDateTimeRange(startIso, endIso) {
  if (!startIso) return ''
  const start = new Date(startIso)
  const datePart = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(start)
  const timeFmt = { hour: 'numeric', minute: '2-digit' }
  const startTime = new Intl.DateTimeFormat('en-US', timeFmt).format(start)
  if (!endIso) return `${datePart}, ${startTime}`
  const end = new Date(endIso)
  const endTime = new Intl.DateTimeFormat('en-US', timeFmt).format(end)
  return `${datePart}, ${startTime} – ${endTime}`
}

export function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = [
  'bg-amber-200 text-amber-800',
  'bg-sky-200 text-sky-800',
  'bg-rose-200 text-rose-800',
  'bg-emerald-200 text-emerald-800',
  'bg-violet-200 text-violet-800',
  'bg-teal-200 text-teal-800',
  'bg-orange-200 text-orange-800',
  'bg-indigo-200 text-indigo-800',
]

export function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
