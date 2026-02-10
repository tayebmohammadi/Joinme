const DEMO_OWNER = {
  id: 'user_demo_owner',
  email: 'demo.owner@dartmouth.edu',
  displayName: 'Alex Chen',
  password: 'demo123',
  verified: true,
  verificationCode: null,
  createdAt: '2026-01-15T10:00:00.000Z',
  favoriteGroupIds: [],
}

const DEMO_MEMBER1 = {
  id: 'user_demo_m1',
  email: 'sarah.kim@dartmouth.edu',
  displayName: 'Sarah Kim',
  password: 'demo123',
  verified: true,
  verificationCode: null,
  createdAt: '2026-01-16T09:00:00.000Z',
  favoriteGroupIds: [],
}

const DEMO_MEMBER2 = {
  id: 'user_demo_m2',
  email: 'james.liu@dartmouth.edu',
  displayName: 'James Liu',
  password: 'demo123',
  verified: true,
  verificationCode: null,
  createdAt: '2026-01-17T11:00:00.000Z',
  favoriteGroupIds: [],
}

const DEMO_MEMBER3 = {
  id: 'user_demo_m3',
  email: 'maya.patel@dartmouth.edu',
  displayName: 'Maya Patel',
  password: 'demo123',
  verified: true,
  verificationCode: null,
  createdAt: '2026-01-18T08:00:00.000Z',
  favoriteGroupIds: [],
}

export const SEED_USERS = [DEMO_OWNER, DEMO_MEMBER1, DEMO_MEMBER2, DEMO_MEMBER3]

// Helper: future date offset from now (minutes snapped to 5)
function futureDate(daysFromNow, hour = 14, minute = 0) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function pastDate(daysAgo, hour = 10, minute = 0) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const SEED_GROUPS = [
  {
    id: 'grp_seed_1',
    ownerId: DEMO_OWNER.id,
    name: 'Morning Study Crew',
    title: 'Early bird study sessions at Baker-Berry',
    description: 'We meet every weekday morning at 7am in the quiet section of Baker-Berry Library. Bring your own coffee! Great for keeping a consistent study schedule with friendly accountability.',
    capacity: 8,
    visibility: 'public',
    meetingType: 'in-person',
    meetingDetail: 'Baker-Berry Library',
    space: 'quiet',
    dateTime: futureDate(2, 7, 0),
    endDateTime: futureDate(2, 9, 30),
    memberIds: [DEMO_OWNER.id, DEMO_MEMBER1.id, DEMO_MEMBER2.id],
    waitlistIds: [],
    joinRequests: [],
    status: 'active',
    createdAt: '2026-01-20T10:00:00.000Z',
  },
  {
    id: 'grp_seed_2',
    ownerId: DEMO_MEMBER1.id,
    name: 'CS Study Group',
    title: 'Algorithm prep and problem solving',
    description: 'Weekly sessions to work through LeetCode problems and review CS concepts. All skill levels welcome — we focus on collaborative learning and explaining our thought processes.',
    capacity: 12,
    visibility: 'public',
    meetingType: 'in-person',
    meetingDetail: 'Thayer School of Engineering',
    space: 'loud',
    dateTime: futureDate(3, 16, 0),
    endDateTime: futureDate(3, 18, 0),
    memberIds: [DEMO_MEMBER1.id, DEMO_OWNER.id, DEMO_MEMBER3.id],
    waitlistIds: [],
    joinRequests: [],
    status: 'active',
    createdAt: '2026-01-22T14:00:00.000Z',
  },
  {
    id: 'grp_seed_3',
    ownerId: DEMO_MEMBER2.id,
    name: 'Hiking Club',
    title: 'Weekend trail adventures around Hanover',
    description: 'Exploring trails around the Upper Valley every Saturday morning. Routes vary from easy walks to moderate hikes. Carpooling available from the Green.',
    capacity: 15,
    visibility: 'public',
    meetingType: 'in-person',
    meetingDetail: 'Dartmouth Green',
    space: 'loud',
    dateTime: futureDate(5, 9, 0),
    endDateTime: futureDate(5, 12, 30),
    memberIds: [DEMO_MEMBER2.id, DEMO_MEMBER3.id],
    waitlistIds: [],
    joinRequests: [],
    status: 'active',
    createdAt: '2026-01-25T08:00:00.000Z',
  },
  {
    id: 'grp_seed_4',
    ownerId: DEMO_OWNER.id,
    name: 'Startup Founders Circle',
    title: 'Private founders-only weekly sync',
    description: 'A small group of student founders sharing progress, challenges, and advice. We keep things confidential so everyone can speak freely about their ventures.',
    capacity: 6,
    visibility: 'private',
    meetingType: 'online',
    meetingDetail: 'https://zoom.us/j/dartmouth-founders',
    space: 'loud',
    dateTime: futureDate(1, 18, 0),
    endDateTime: futureDate(1, 19, 30),
    memberIds: [DEMO_OWNER.id, DEMO_MEMBER1.id],
    waitlistIds: [],
    joinRequests: [{ userId: DEMO_MEMBER3.id, requestedAt: '2026-02-01T12:00:00.000Z' }],
    status: 'active',
    createdAt: '2026-01-28T16:00:00.000Z',
  },
  {
    id: 'grp_seed_5',
    ownerId: DEMO_MEMBER3.id,
    name: 'Meditation & Mindfulness',
    title: 'Guided meditation sessions at the BEMA',
    description: 'Find your calm before the chaos of the week. We practice guided meditation and breathing exercises in a peaceful outdoor setting. Beginners always welcome.',
    capacity: 20,
    visibility: 'public',
    meetingType: 'in-person',
    meetingDetail: 'BEMA',
    space: 'quiet',
    dateTime: futureDate(4, 8, 0),
    endDateTime: futureDate(4, 9, 0),
    memberIds: [DEMO_MEMBER3.id, DEMO_MEMBER2.id, DEMO_MEMBER1.id, DEMO_OWNER.id],
    waitlistIds: [],
    joinRequests: [],
    status: 'active',
    createdAt: '2026-02-01T07:00:00.000Z',
  },
  {
    id: 'grp_seed_6',
    ownerId: DEMO_MEMBER1.id,
    name: 'Film Screening Club',
    title: 'Bi-weekly movie nights at the Hop',
    description: 'We watch and discuss a curated selection of films from classic cinema to modern indie. Popcorn provided! Suggestions for the next screening are always welcome.',
    capacity: 4,
    visibility: 'public',
    meetingType: 'in-person',
    meetingDetail: 'Hop (Hopkins Center)',
    space: 'loud',
    dateTime: futureDate(7, 19, 0),
    endDateTime: futureDate(7, 21, 30),
    memberIds: [DEMO_MEMBER1.id, DEMO_MEMBER2.id, DEMO_MEMBER3.id, DEMO_OWNER.id],
    waitlistIds: [],
    joinRequests: [],
    status: 'active',
    createdAt: '2026-02-03T15:00:00.000Z',
  },
  // One archived group (past date)
  {
    id: 'grp_seed_7',
    ownerId: DEMO_OWNER.id,
    name: 'Finals Study Marathon',
    title: 'All-day study session for winter finals',
    description: 'A full-day collaborative study session at Collis Center. Bring snacks, share notes, keep each other motivated through finals week.',
    capacity: 25,
    visibility: 'public',
    meetingType: 'in-person',
    meetingDetail: 'Collis Center',
    space: 'quiet',
    dateTime: pastDate(10, 10, 0),
    endDateTime: pastDate(10, 18, 0),
    memberIds: [DEMO_OWNER.id, DEMO_MEMBER1.id, DEMO_MEMBER2.id, DEMO_MEMBER3.id],
    waitlistIds: [],
    joinRequests: [],
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
]

export function seedIfEmpty() {
  const existingGroups = localStorage.getItem('joinme_groups')
  if (!existingGroups || JSON.parse(existingGroups).length === 0) {
    localStorage.setItem('joinme_groups', JSON.stringify(SEED_GROUPS))
  }

  const existingUsers = localStorage.getItem('joinme_users')
  if (!existingUsers || JSON.parse(existingUsers).length === 0) {
    localStorage.setItem('joinme_users', JSON.stringify(SEED_USERS))
  }
}
