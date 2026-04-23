export const PAGES = {
  BROWSE: 'browse',
  CREATE_GROUP: 'create_group',
  GROUP_DETAIL: 'group_detail',
  PROFILE: 'profile',
  EVENTS: 'events',
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

export const GROUP_CATEGORIES = [
  { id: 'academics', label: 'Academics', emoji: '📚' },
  { id: 'career', label: 'Career', emoji: '💼' },
  { id: 'sports', label: 'Sports', emoji: '🏀' },
  { id: 'outdoors', label: 'Outdoors', emoji: '🌲' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'social', label: 'Social', emoji: '🎉' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎭' },
  { id: 'tech', label: 'Tech & Gaming', emoji: '💻' },
  { id: 'civic', label: 'Civic & Service', emoji: '🤝' },
]

export const GROUP_VISUALS = [
  { id: 'study-groups-exam-prep', category: 'academics', name: 'Study Groups & Exam Prep', badge: 'STUDY', description: 'P-set grinds, midterm/finals study groups, or silent co-working in Baker-Berry.', colors: ['#1D4ED8', '#22D3EE'] },
  { id: 'academic-talks-research', category: 'academics', name: 'Academic Talks & Research', badge: 'RESEARCH', description: 'Guest lecturers, department symposiums, and professors looking for undergrad research assistants.', colors: ['#92400E', '#F59E0B'] },
  { id: 'tutoring-academic-support', category: 'academics', name: 'Tutoring & Academic Support', badge: 'TUTOR', description: 'TA-led review sessions, peer-to-peer tutoring, and writing workshops.', colors: ['#7C3AED', '#A78BFA'] },

  { id: 'career-recruiting', category: 'career', name: 'Career & Recruiting', badge: 'CAREER', description: 'FAANG mock interviews, consulting case prep, networking info sessions, and resume reviews.', colors: ['#0F766E', '#14B8A6'] },
  { id: 'startups-entrepreneurship', category: 'career', name: 'Startups & Entrepreneurship', badge: 'STARTUP', description: 'Finding technical co-founders, YC application prep, and pitch competitions.', colors: ['#15803D', '#4ADE80'] },

  { id: 'intramural-pickup-sports', category: 'sports', name: 'Intramural & Pick-up Sports', badge: 'SPORTS', description: 'Casual soccer on the Green, spikeball tournaments, and intramural basketball.', colors: ['#9A3412', '#FB923C'] },
  { id: 'fitness-workout-buddies', category: 'sports', name: 'Fitness & Workout Buddies', badge: 'FITNESS', description: 'Finding a spotter at the gym, campus running clubs, or group yoga sessions.', colors: ['#6D28D9', '#C084FC'] },

  { id: 'outdoor-adventures', category: 'outdoors', name: 'Outdoor Adventures', badge: 'OUTDOOR', description: 'Outing Club trips, weekend skiing, hiking, cabin overnights, and mountain biking.', colors: ['#BE123C', '#FB7185'] },

  { id: 'wellness-mental-health', category: 'wellness', name: 'Wellness & Mental Health', badge: 'WELLNESS', description: 'Therapy dog visits, meditation groups, and stress-relief events during finals week.', colors: ['#1E3A8A', '#60A5FA'] },
  { id: 'faith-spiritual-life', category: 'wellness', name: 'Faith & Spiritual Life', badge: 'FAITH', description: 'Friday prayers, fellowship gatherings, and holiday observances.', colors: ['#0F766E', '#2DD4BF'] },

  { id: 'campus-traditions-big-events', category: 'social', name: 'Campus Traditions & Big Events', badge: 'EVENTS', description: 'Winter Carnival, Green Key, Homecoming, tailgates, and major campus-wide concerts.', colors: ['#334155', '#94A3B8'] },
  { id: 'greek-life-social-houses', category: 'social', name: 'Greek Life & Social Houses', badge: 'GREEK', description: 'Open house parties, rush events, and inter-house charity fundraisers.', colors: ['#111827', '#6B7280'] },
  { id: 'food-dining-meetups', category: 'social', name: 'Food & Dining Meetups', badge: 'FOOD', description: 'Late-night Collis runs, grabbing a table at Foco, or off-campus restaurant trips.', colors: ['#166534', '#22C55E'] },

  { id: 'cultural-international', category: 'arts', name: 'Cultural & International', badge: 'CULTURE', description: 'Heritage month celebrations, international student mixers, and cultural cooking nights.', colors: ['#0F172A', '#38BDF8'] },
  { id: 'arts-theater-music', category: 'arts', name: 'Arts, Theater & Music', badge: 'ARTS', description: 'A cappella concerts, open mic nights, Hopkins Center performances, and jam sessions.', colors: ['#991B1B', '#F87171'] },

  { id: 'tech-coding-makers', category: 'tech', name: 'Tech, Coding & Makers', badge: 'TECH', description: 'Hackathons, hardware building, coding bootcamps, and 3D printing sessions.', colors: ['#7E22CE', '#E879F9'] },
  { id: 'gaming-esports', category: 'tech', name: 'Gaming & Esports', badge: 'GAMING', description: 'Super Smash Bros tournaments, board game nights, and D&D campaigns.', colors: ['#1D4ED8', '#818CF8'] },

  { id: 'student-gov-club-meetings', category: 'civic', name: 'Student Gov & Club Meetings', badge: 'CLUBS', description: 'Student assembly, debate club, and general organizational planning meetings.', colors: ['#0F766E', '#34D399'] },
  { id: 'volunteering-social-impact', category: 'civic', name: 'Volunteering & Social Impact', badge: 'IMPACT', description: 'Community service trips, local charity drives, and campus activism.', colors: ['#374151', '#9CA3AF'] },
  { id: 'campus-gigs-logistics', category: 'civic', name: 'Campus Gigs & Logistics', badge: 'GIGS', description: 'Swapping shifts at campus jobs, buying/selling textbooks, and organizing post-grad or senior year roommate searches.', colors: ['#BE185D', '#F472B6'] },
]

export function getCategoryById(id) {
  return GROUP_CATEGORIES.find((c) => c.id === id) || null
}

export function getVisualsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return GROUP_VISUALS
  return GROUP_VISUALS.filter((v) => v.category === categoryId)
}

export function getGroupVisualById(visualId) {
  return GROUP_VISUALS.find((visual) => visual.id === visualId) || null
}

export function getDefaultGroupVisual(seed = '') {
  if (!seed) return GROUP_VISUALS[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return GROUP_VISUALS[Math.abs(hash) % GROUP_VISUALS.length]
}

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
