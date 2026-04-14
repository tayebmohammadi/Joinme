export function mapUserRow(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    password: row.password,
    verified: row.verified,
    verificationCode: row.verification_code,
    createdAt: row.created_at,
    favoriteGroupIds: row.favorite_group_ids || [],
    resetCode: row.reset_code ?? null,
  }
}

export function mapUserToRow(user) {
  return {
    id: user.id,
    email: user.email,
    display_name: user.displayName,
    password: user.password,
    verified: user.verified,
    verification_code: user.verificationCode,
    created_at: user.createdAt,
    favorite_group_ids: user.favoriteGroupIds || [],
    reset_code: user.resetCode ?? null,
  }
}

export function mapGroupRow(row) {
  if (!row) return null
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    title: row.title,
    description: row.description,
    capacity: row.capacity,
    visibility: row.visibility,
    meetingType: row.meeting_type,
    meetingDetail: row.meeting_detail,
    space: row.space,
    visualId: row.visual_id ?? null,
    dateTime: row.date_time,
    endDateTime: row.end_date_time,
    memberIds: row.member_ids || [],
    waitlistIds: row.waitlist_ids || [],
    joinRequests: row.join_requests || [],
    status: row.status,
    createdAt: row.created_at,
  }
}

export function mapGroupToRow(group) {
  return {
    id: group.id,
    owner_id: group.ownerId,
    name: group.name,
    title: group.title,
    description: group.description,
    capacity: group.capacity,
    visibility: group.visibility,
    meeting_type: group.meetingType,
    meeting_detail: group.meetingDetail,
    space: group.space,
    visual_id: group.visualId ?? null,
    date_time: group.dateTime,
    end_date_time: group.endDateTime,
    member_ids: group.memberIds || [],
    waitlist_ids: group.waitlistIds || [],
    join_requests: group.joinRequests || [],
    status: group.status,
    created_at: group.createdAt,
  }
}

