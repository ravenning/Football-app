import { User, Team, Tactics, Announcement, DirectMessage, DMThread, MatchWeekHandover, PlayerAvailability, QuickPromptTemplate, UserRole, Formation, PositionZone, MessageStatus, QuickPromptKey } from './schema';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Javier Morales',
    credentials_summary: 'UEFA B · 7 seasons · 4-3-3 specialist',
    current_role: 'Manager' as UserRole,
    avatar_url: undefined,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2025-04-22T10:30:00Z'
  },
  {
    id: 'user-002',
    name: 'Tom Okafor',
    credentials_summary: '5 seasons · Shot-stopper specialist',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-02-01T14:00:00Z',
    updated_at: '2025-04-20T16:45:00Z'
  },
  {
    id: 'user-003',
    name: 'Luca Ferretti',
    credentials_summary: '3 seasons · Ball-playing defender',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-02-10T11:30:00Z',
    updated_at: '2025-04-21T09:15:00Z'
  },
  {
    id: 'user-004',
    name: 'Kwame Asante',
    credentials_summary: '4 seasons · Traditional centre-back',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-02-15T13:00:00Z',
    updated_at: '2025-04-19T14:20:00Z'
  },
  {
    id: 'user-005',
    name: 'Riya Patel',
    credentials_summary: '2 seasons · Modern full-back',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2025-04-22T08:30:00Z'
  },
  {
    id: 'user-006',
    name: 'Marcus Webb',
    credentials_summary: '3 seasons · Wing-back specialist',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-03-05T15:30:00Z',
    updated_at: '2025-04-18T17:00:00Z'
  },
  {
    id: 'user-007',
    name: 'Diego Nunez',
    credentials_summary: '6 seasons · Deep-lying playmaker',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-01-20T12:00:00Z',
    updated_at: '2025-04-21T11:45:00Z'
  },
  {
    id: 'user-008',
    name: 'Sasha Ivanov',
    credentials_summary: '4 seasons · Box-to-box engine',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-02-20T14:15:00Z',
    updated_at: '2025-04-20T13:30:00Z'
  },
  {
    id: 'user-009',
    name: 'Aisha Traoré',
    credentials_summary: '5 seasons · Advanced playmaker',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-01-25T16:00:00Z',
    updated_at: '2025-04-22T12:15:00Z'
  },
  {
    id: 'user-010',
    name: 'Ben Fletcher',
    credentials_summary: '3 seasons · Inverted winger',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-03-10T09:30:00Z',
    updated_at: '2025-04-19T15:45:00Z'
  },
  {
    id: 'user-011',
    name: 'Zara Hassan',
    credentials_summary: '2 seasons · Traditional winger',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-03-15T11:00:00Z',
    updated_at: '2025-04-21T10:00:00Z'
  },
  {
    id: 'user-012',
    name: 'Carlos Mena',
    credentials_summary: '4 seasons · False 9 specialist',
    current_role: 'Player' as UserRole,
    avatar_url: undefined,
    created_at: '2024-02-25T13:30:00Z',
    updated_at: '2025-04-20T14:00:00Z'
  }
];

// Mock Team
export const MOCK_TEAM: Team = {
  id: 'team-001',
  name: 'Riverside FC',
  short_code: 'RIV',
  primary_color: '#1a5c2a',
  secondary_color: '#b5f033',
  manager_id: 'user-001',
  player_ids: ['user-002', 'user-003', 'user-004', 'user-005', 'user-006', 'user-007', 'user-008', 'user-009', 'user-010', 'user-011', 'user-012'],
  division: 'Recreational League',
  season: 'Spring 2025',
  home_ground: 'Greenway Park',
  created_at: '2024-01-15T09:00:00Z',
  updated_at: '2025-04-22T10:30:00Z'
};

// Mock Tactics
export const MOCK_TACTICS: Tactics = {
  id: 'tactics-001',
  team_id: 'team-001',
  label: 'Match Week 5 - Home vs United Park FC',
  formation: '4-3-3' as Formation,
  player_assignments: [
    { position_zone: 'GK' as PositionZone, player_id: 'user-002', role_key: 'goalkeeper' },
    { position_zone: 'CB_L' as PositionZone, player_id: 'user-003', role_key: 'ball_playing_cb' },
    { position_zone: 'CB_R' as PositionZone, player_id: 'user-004', role_key: 'traditional_cb' },
    { position_zone: 'LB' as PositionZone, player_id: 'user-005', role_key: 'full_back' },
    { position_zone: 'RB' as PositionZone, player_id: 'user-006', role_key: 'wing_back' },
    { position_zone: 'CDM' as PositionZone, player_id: 'user-007', role_key: 'deep_lying_playmaker' },
    { position_zone: 'CM_L' as PositionZone, player_id: 'user-008', role_key: 'box_to_box' },
    { position_zone: 'CM_R' as PositionZone, player_id: 'user-009', role_key: 'advanced_playmaker' },
    { position_zone: 'LW' as PositionZone, player_id: 'user-010', role_key: 'inverted_winger' },
    { position_zone: 'RW' as PositionZone, player_id: 'user-011', role_key: 'traditional_winger' },
    { position_zone: 'ST' as PositionZone, player_id: 'user-012', role_key: 'false_9' }
  ],
  is_active: true,
  match_week: 5,
  notes: 'High press trigger: opponent GK. Mid-block 4-4-2 shape out of possession. False 9 drops to create lanes for B2B runners.',
  created_by: 'user-001',
  created_at: '2025-04-19T09:00:00Z',
  updated_at: '2025-04-22T10:30:00Z'
};

// Mock Announcements
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    team_id: 'team-001',
    author_id: 'user-001',
    title: 'Match Week 5 - Tactical Brief',
    body: 'This week we face United Park who sit in a 4-4-2 mid-block. Our key weapon is quick vertical combinations through the DLP. Wide players must stay wide and pin their fullbacks. The False 9 drops to create lanes for B2B runners.',
    match_week: 5,
    is_pinned: true,
    recipient_ids: [],
    read_by: ['user-002', 'user-003', 'user-004'],
    created_at: '2025-04-19T09:00:00Z'
  },
  {
    id: 'ann-002',
    team_id: 'team-001',
    author_id: 'user-001',
    title: 'Training - Thursday 18:30',
    body: 'Mandatory training session this Thursday at Greenway Park. We\'ll be running set-piece drills and a tactical shape session. Please confirm attendance via the availability update prompt.',
    match_week: 5,
    is_pinned: false,
    recipient_ids: [],
    read_by: ['user-002', 'user-003', 'user-004', 'user-005'],
    created_at: '2025-04-18T14:00:00Z'
  },
  {
    id: 'ann-003',
    team_id: 'team-001',
    author_id: 'user-001',
    title: 'Match Week 4 - Well done squad!',
    body: 'Fantastic 3-1 win last Saturday. Pressing intensity was world-class in the first 20 minutes. Special mention to the DM for reading the second phase so well. Let\'s build on this.',
    match_week: 4,
    is_pinned: false,
    recipient_ids: [],
    read_by: ['user-002', 'user-003', 'user-004', 'user-005', 'user-006', 'user-007', 'user-008', 'user-009', 'user-010', 'user-011', 'user-012'],
    created_at: '2025-04-13T20:00:00Z'
  }
];

// Mock Direct Messages
export const MOCK_DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: 'dm-001',
    team_id: 'team-001',
    manager_id: 'user-001',
    player_id: 'user-004',
    sender_id: 'user-004',
    body: 'Feedback Request\n\nHi boss, I would really appreciate some feedback on my recent performances.',
    status: 'read' as MessageStatus,
    sent_at: '2025-04-22T08:00:00Z'
  },
  {
    id: 'dm-002',
    team_id: 'team-001',
    manager_id: 'user-001',
    player_id: 'user-004',
    sender_id: 'user-001',
    body: 'Kwame, you\'ve been excellent defensively. Keep playing out from the back under pressure - that\'s your biggest area to develop.',
    status: 'read' as MessageStatus,
    sent_at: '2025-04-22T09:00:00Z'
  },
  {
    id: 'dm-003',
    team_id: 'team-001',
    manager_id: 'user-001',
    player_id: 'user-010',
    sender_id: 'user-010',
    body: 'Position Request\n\nHi boss - I believe I could be effective as a Defensive Midfielder (DM) in our current shape.',
    status: 'read' as MessageStatus,
    sent_at: '2025-04-22T07:00:00Z'
  },
  {
    id: 'dm-004',
    team_id: 'team-001',
    manager_id: 'user-001',
    player_id: 'user-012',
    sender_id: 'user-012',
    body: 'Role Suggestion\n\nI\'d like to discuss playing as a False 9 this week. I\'m confident dropping deep and creating space.',
    status: 'read' as MessageStatus,
    sent_at: '2025-04-22T05:00:00Z'
  },
  {
    id: 'dm-005',
    team_id: 'team-001',
    manager_id: 'user-001',
    player_id: 'user-012',
    sender_id: 'user-001',
    body: 'Carlos, that\'s exactly the plan. Stay patient when you drop - the B2B runners will arrive late.',
    status: 'read' as MessageStatus,
    sent_at: '2025-04-22T06:00:00Z'
  }
];

// Mock DM Threads
export const MOCK_DM_THREADS: DMThread[] = [
  {
    thread_id: 'team-001_user-001_user-004',
    team_id: 'team-001',
    manager_id: 'user-001',
    player_id: 'user-004',
    messages: [
      MOCK_DIRECT_MESSAGES[0],
      MOCK_DIRECT_MESSAGES[1]
    ],
    unread_count: 0,
    last_message_at: '2025-04-22T09:00:00Z'
  },
  {
    thread_id: 'team-001_user-001_user-010',
    team_id: 'team-001',
    manager_id: 'user-001',
    player_id: 'user-010',
    messages: [MOCK_DIRECT_MESSAGES[2]],
    unread_count: 0,
    last_message_at: '2025-04-22T07:00:00Z'
  },
  {
    thread_id: 'team-001_user-001_user-012',
    team_id: 'team-001',
    manager_id: 'user-001',
    player_id: 'user-012',
    messages: [
      MOCK_DIRECT_MESSAGES[3],
      MOCK_DIRECT_MESSAGES[4]
    ],
    unread_count: 0,
    last_message_at: '2025-04-22T06:00:00Z'
  }
];

// Mock Match Week Handover
export const MOCK_HANDOVER: MatchWeekHandover = {
  id: 'handover-001',
  team_id: 'team-001',
  match_week: 5,
  opponent: 'United Park FC',
  match_date: '2025-04-26T15:00:00Z',
  is_home: true,
  tactics_id: 'tactics-001',
  squad_availability: [
    { player_id: 'user-002', status: 'available' },
    { player_id: 'user-003', status: 'available' },
    { player_id: 'user-004', status: 'doubt', note: 'Hamstring tightness' },
    { player_id: 'user-005', status: 'available' },
    { player_id: 'user-006', status: 'available' },
    { player_id: 'user-007', status: 'available' },
    { player_id: 'user-008', status: 'suspended', note: 'Yellow card accumulation' },
    { player_id: 'user-009', status: 'available' },
    { player_id: 'user-010', status: 'available' },
    { player_id: 'user-011', status: 'injured', note: 'Ankle sprain' },
    { player_id: 'user-012', status: 'available' }
  ] as PlayerAvailability[],
  manager_notes: 'United Park press high in the first 15. Weather the storm, retain possession, then exploit the wide channels once they tire.',
  key_messages: [
    'Press trigger: GK with ball - front 3 and B2B press together',
    'False 9 drops between lines - CM runners make late runs beyond',
    'Set pieces: zonal marking, #6 anchors far post',
    'If leading, drop to 4-4-2 shape from 70 mins'
  ],
  status: 'published',
  is_locked: false,
  published_at: '2025-04-22T10:00:00Z',
  created_by: 'user-001',
  created_at: '2025-04-22T08:00:00Z',
  updated_at: '2025-04-22T10:00:00Z'
};

// Mock Quick Prompts
export const MOCK_QUICK_PROMPTS: QuickPromptTemplate[] = [
  {
    key: 'suggest_position_dm' as QuickPromptKey,
    label: 'Suggest Position: DM',
    message_template: 'Position Request\n\nHi boss - I believe I could be effective as a Defensive Midfielder (DM) in our current shape. I have the defensive awareness and passing range to screen the backline.'
  },
  {
    key: 'suggest_position_cm' as QuickPromptKey,
    label: 'Suggest Position: CM',
    message_template: 'Position Request\n\nHi boss - I think I could contribute well in central midfield. I have the work rate and passing ability to link defense to attack effectively.'
  },
  {
    key: 'suggest_position_cam' as QuickPromptKey,
    label: 'Suggest Position: CAM',
    message_template: 'Position Request\n\nHi boss - I\'d like to play in the number 10 role. I have the vision and creativity to unlock defenses and create chances for the team.'
  },
  {
    key: 'suggest_position_st' as QuickPromptKey,
    label: 'Suggest Position: ST',
    message_template: 'Position Request\n\nHi boss - I believe I could be effective as a striker. I have the finishing ability and movement to score goals consistently.'
  },
  {
    key: 'suggest_role_box_to_box' as QuickPromptKey,
    label: 'Suggest Role: Box-to-Box',
    message_template: 'Role Suggestion\n\nBoss, I\'d like to put myself forward for a Box-to-Box role. My stamina and two-way contribution feels like a strong fit.'
  },
  {
    key: 'suggest_role_false_9' as QuickPromptKey,
    label: 'Suggest Role: False 9',
    message_template: 'Role Suggestion\n\nI\'d like to discuss playing as a False 9 this week. I\'m confident in my ability to drop deep, link play, and create space for midfield runners.'
  },
  {
    key: 'suggest_role_dlp' as QuickPromptKey,
    label: 'Suggest Role: DLP',
    message_template: 'Role Suggestion\n\nBoss - I think I could be effective as the Deep-Lying Playmaker. My reading of the game and passing range could help us control tempo from deep.'
  },
  {
    key: 'suggest_role_winger' as QuickPromptKey,
    label: 'Suggest Role: Winger',
    message_template: 'Role Suggestion\n\nI\'d like to play on the wing this week. My pace and crossing ability could stretch their defense and create opportunities.'
  },
  {
    key: 'request_feedback' as QuickPromptKey,
    label: 'Request Feedback',
    message_template: 'Feedback Request\n\nHi boss, I would really appreciate some feedback on my recent performances. Whether it\'s positioning, decision-making, or anything else - I want to keep improving.'
  },
  {
    key: 'request_more_minutes' as QuickPromptKey,
    label: 'Request More Minutes',
    message_template: 'Playing Time\n\nBoss, I wanted to respectfully raise the topic of playing time. I feel match-fit and ready to contribute more.'
  },
  {
    key: 'availability_update' as QuickPromptKey,
    label: 'Update Availability',
    message_template: 'Availability Update\n\nHi boss, just wanted to update you on my availability for this week\'s match.'
  }
];

// Helper functions for mock data
export const getUserById = (id: string): User | undefined => {
  return MOCK_USERS.find(user => user.id === id);
};

export const getTeamById = (id: string): Team | undefined => {
  return id === 'team-001' ? MOCK_TEAM : undefined;
};

export const getAnnouncementsByTeam = (teamId: string): Announcement[] => {
  return MOCK_ANNOUNCEMENTS.filter(ann => ann.team_id === teamId);
};

export const getDMThreadsByManager = (managerId: string): DMThread[] => {
  return MOCK_DM_THREADS.filter(thread => thread.manager_id === managerId);
};

export const getHandoverByTeam = (teamId: string, matchWeek: number): MatchWeekHandover | undefined => {
  return MOCK_HANDOVER.team_id === teamId && MOCK_HANDOVER.match_week === matchWeek ? MOCK_HANDOVER : undefined;
};

export const getQuickPromptByKey = (key: QuickPromptKey): QuickPromptTemplate | undefined => {
  return MOCK_QUICK_PROMPTS.find(prompt => prompt.key === key);
};
