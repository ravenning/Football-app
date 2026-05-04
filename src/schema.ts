// ============================================================
// FOOTBALL MANAGEMENT APP - CORE SCHEMA
// Lead Systems Architect: Entity definitions & relationships
// ============================================================

// Enums

export type UserRole = 'Manager' | 'Player';

export type Formation =
  | '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2'
  | '5-3-2' | '3-4-3' | '4-1-4-1' | '4-5-1';

export type PositionZone =
  | 'GK'
  | 'CB_L' | 'CB_C' | 'CB_R'
  | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CDM_L' | 'CDM_R'
  | 'CM_L' | 'CM_C' | 'CM_R'
  | 'CAM' | 'CAM_L' | 'CAM_R'
  | 'LM' | 'RM'
  | 'LW' | 'RW'
  | 'ST' | 'ST_L' | 'ST_R' | 'CF' | 'SS';

export type MessageStatus = 'sent' | 'delivered' | 'read';

// 1. User

/**
 * Universal user entity. Polymorphic via `current_role`.
 * When role is 'Manager', links to exactly one Team as manager.
 * When role is 'Player', may belong to one Team.
 */
export interface User {
  id: string;                          // UUID v4
  name: string;
  credentials_summary: string;         // e.g. "UEFA B · 7 seasons · 4-3-3 specialist"
  current_role: UserRole;
  avatar_url?: string;
  created_at: string;                  // ISO 8601
  updated_at: string;
}

// 2. Team

/**
 * A team has exactly ONE Manager and 1..N Players.
 * `player_ids` is an ordered squad list (not starting XI).
 */
export interface Team {
  id: string;
  name: string;
  short_code: string;                  // e.g. "RIV" - 3-4 chars
  primary_color: string;               // hex
  secondary_color: string;             // hex
  manager_id: string;                  // FK -> User (role = 'Manager')
  player_ids: string[];                // FK[] -> User (role = 'Player')
  division: string;
  season: string;
  home_ground?: string;
  created_at: string;
  updated_at: string;
}

// 3. Tactics

/**
 * Stores the active tactical setup for a team.
 * `player_assignments` maps PositionZone -> User.id.
 * A team can have multiple saved Tactics (e.g. "vs High Press", "Away Leg").
 */
export interface PlayerAssignment {
  position_zone: PositionZone;
  player_id: string;                   // FK -> User
  role_key: string;                    // FK -> RoleMetadata.key
}

export interface Tactics {
  id: string;
  team_id: string;                     // FK -> Team
  label: string;                       // e.g. "Match Week 4 - Home vs City FC"
  formation: Formation;
  player_assignments: PlayerAssignment[];
  is_active: boolean;                  // only one active per team
  match_week?: number;
  notes?: string;                      // manager's tactical notes
  created_by: string;                  // FK -> User (Manager only)
  created_at: string;
  updated_at: string;
}

// 4. Roles Metadata

/**
 * Dictionary of football roles. Each entry is keyed by a canonical
 * role identifier. `heatmap_coordinates` is a normalised array of
 * {x, y, intensity} points (0-1 range) used to render SVG/CSS heatmaps.
 */
export interface HeatmapPoint {
  x: number;      // 0 (left touchline) -> 1 (right touchline)
  y: number;      // 0 (own goal) -> 1 (opposition goal)
  intensity: number; // 0.0 -> 1.0
}

export interface RoleMetadata {
  key: string;                          // e.g. 'deep_lying_playmaker'
  display_name: string;                 // e.g. 'Deep-Lying Playmaker'
  abbreviation: string;                 // e.g. 'DLP'
  primary_zone: PositionZone;
  description: string;                  // tactical responsibilities
  key_attributes: string[];             // e.g. ['Vision', 'Passing', 'Composure']
  heatmap_coordinates: HeatmapPoint[];
  compatible_formations: Formation[];
}

/**
 * The full roles dictionary - keyed by RoleMetadata.key.
 * Populated in rolesMetadata.ts
 */
export type RolesDictionary = Record<string, RoleMetadata>;

// 5. Announcements

/**
 * One-way broadcast table. Only the team's current Manager can INSERT.
 * Players have READ-ONLY access - no reply FK exists by design.
 * `is_pinned` surfaces critical announcements at the top of the feed.
 */
export interface Announcement {
  id: string;
  team_id: string;                     // FK -> Team
  author_id: string;                   // FK -> User (Manager only - enforced at API layer)
  title: string;
  body: string;
  match_week?: number;
  is_pinned: boolean;
  recipient_ids: string[];             // [] = broadcast to all; or subset of player_ids
  read_by: string[];                   // FK[] -> User - tracks who has seen it
  created_at: string;
  // NOTE: No `replies` field - players CANNOT respond to announcements.
}

// 6. Direct Messages

/**
 * Two-way DM table. Participants are always exactly:
 *   [manager_id, player_id]
 * `quick_prompt_key` is populated when a message was sent via a Quick Prompt
 * button - allows analytics on which prompts are used most.
 */
export type QuickPromptKey =
  | 'suggest_position_dm'
  | 'suggest_position_cm'
  | 'suggest_position_cam'
  | 'suggest_position_st'
  | 'suggest_role_box_to_box'
  | 'suggest_role_false_9'
  | 'suggest_role_dlp'
  | 'suggest_role_winger'
  | 'request_feedback'
  | 'request_more_minutes'
  | 'availability_update';

export interface QuickPromptTemplate {
  key: QuickPromptKey;
  label: string;                       // Button label, e.g. "Suggest Position: DM"
  message_template: string;            // Pre-formatted text sent to Manager DM
}

export interface DirectMessage {
  id: string;
  team_id: string;                     // FK -> Team
  manager_id: string;                  // FK -> User (role = 'Manager')
  player_id: string;                   // FK -> User (role = 'Player')
  sender_id: string;                   // FK -> User - which party sent this message
  body: string;
  quick_prompt_key?: QuickPromptKey;   // set if sent via Quick Prompt
  status: MessageStatus;
  sent_at: string;                     // ISO 8601
}

/**
 * A conversation thread = all DMs sharing the same (team_id, manager_id, player_id).
 * This view type aggregates them for the UI layer.
 */
export interface DMThread {
  thread_id: string;                   // composite: `${team_id}_${manager_id}_${player_id}`
  team_id: string;
  manager_id: string;
  player_id: string;
  messages: DirectMessage[];
  unread_count: number;
  last_message_at: string;
}

// 7. Match Week Handover

/**
 * Snapshot created at the start of each match week.
 * Captures the frozen tactics, squad availability, and manager notes.
 * Immutable once `is_locked = true`.
 */
export type HandoverStatus = 'draft' | 'published' | 'locked';

export interface PlayerAvailability {
  player_id: string;
  status: 'available' | 'injured' | 'suspended' | 'doubt' | 'unavailable';
  note?: string;
}

export interface MatchWeekHandover {
  id: string;
  team_id: string;                     // FK -> Team
  match_week: number;
  opponent: string;
  match_date: string;                  // ISO 8601
  is_home: boolean;
  tactics_id: string;                  // FK -> Tactics (snapshot, frozen on lock)
  squad_availability: PlayerAvailability[];
  manager_notes: string;               // tactical brief for the week
  key_messages: string[];              // bullet-point instructions shown to players
  status: HandoverStatus;
  is_locked: boolean;                  // once true, no edits allowed
  published_at?: string;
  created_by: string;                  // FK -> User (Manager)
  created_at: string;
  updated_at: string;
}
