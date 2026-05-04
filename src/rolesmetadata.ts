import { RoleMetadata, RolesDictionary, Formation, PositionZone } from './schema';

// Complete roles dictionary with all football positions and their metadata
export const ROLES_METADATA: RolesDictionary = {
  goalkeeper: {
    key: 'goalkeeper',
    display_name: 'Goalkeeper',
    abbreviation: 'GK',
    primary_zone: 'GK' as PositionZone,
    description: 'Last line of defence. Organises the defensive line, distributes from the back, and commands their area. Modern GKs are expected to act as a sweeper-keeper, reading danger early.',
    key_attributes: ['Reflexes', 'Positioning', 'Distribution', 'Command of Area'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.05, intensity: 1 },
      { x: 0.4, y: 0.08, intensity: 0.5 },
      { x: 0.6, y: 0.08, intensity: 0.5 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '3-4-3', '4-1-4-1', '4-5-1'] as Formation[]
  },
  
  ball_playing_cb: {
    key: 'ball_playing_cb',
    display_name: 'Ball-Playing Centre-Back',
    abbreviation: 'BPD',
    primary_zone: 'CB_C' as PositionZone,
    description: 'A central defender who initiates attacks. Carries the ball out from the back, plays progressive passes under pressure, and anchors the defensive shape while contributing to build-up.',
    key_attributes: ['Passing', 'Composure', 'Tackling', 'Positioning'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.15, intensity: 1 },
      { x: 0.35, y: 0.18, intensity: 0.6 },
      { x: 0.65, y: 0.18, intensity: 0.6 },
      { x: 0.5, y: 0.25, intensity: 0.3 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3', '4-1-4-1'] as Formation[]
  },
  
  inverted_winger: {
    key: 'inverted_winger',
    display_name: 'Inverted Winger',
    abbreviation: 'IW',
    primary_zone: 'LW' as PositionZone,
    description: 'Cuts inside from the flank onto their stronger foot to shoot or play incisive through-balls. Creates overloads in the half-space and combines with the overlapping fullback.',
    key_attributes: ['Dribbling', 'Shooting', 'Agility', 'Off the Ball'],
    heatmap_coordinates: [
      { x: 0.8, y: 0.75, intensity: 1 },
      { x: 0.65, y: 0.8, intensity: 0.8 },
      { x: 0.55, y: 0.7, intensity: 0.5 }
    ],
    compatible_formations: ['4-3-3', '4-2-3-1', '3-4-3', '4-1-4-1'] as Formation[]
  },
  
  deep_lying_playmaker: {
    key: 'deep_lying_playmaker',
    display_name: 'Deep-Lying Playmaker',
    abbreviation: 'DLP',
    primary_zone: 'CDM' as PositionZone,
    description: 'The conductor of the orchestra. Drops between the centre-backs to receive, scans constantly, and distributes quickly to switch play or split the press. The pass IS the movement.',
    key_attributes: ['Vision', 'Passing', 'Composure', 'Anticipation'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.35, intensity: 1 },
      { x: 0.35, y: 0.3, intensity: 0.7 },
      { x: 0.65, y: 0.3, intensity: 0.7 },
      { x: 0.5, y: 0.2, intensity: 0.4 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '4-1-4-1'] as Formation[]
  },
  
  box_to_box: {
    key: 'box_to_box',
    display_name: 'Box-to-Box Midfielder',
    abbreviation: 'B2B',
    primary_zone: 'CM_C' as PositionZone,
    description: 'The engine of the team. Contributes in both boxes - arriving late to support attacks and tracking back to win possession. Elite stamina and tactical discipline required.',
    key_attributes: ['Stamina', 'Work Rate', 'Passing', 'Tackling'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.5, intensity: 1 },
      { x: 0.45, y: 0.35, intensity: 0.8 },
      { x: 0.55, y: 0.65, intensity: 0.8 },
      { x: 0.4, y: 0.6, intensity: 0.5 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3'] as Formation[]
  },
  
  advanced_playmaker: {
    key: 'advanced_playmaker',
    display_name: 'Advanced Playmaker',
    abbreviation: 'AP',
    primary_zone: 'CAM' as PositionZone,
    description: 'Roams the final third as the creative hub. Finds pockets of space between the lines, plays killer passes, and takes responsibility for unlocking compact defences.',
    key_attributes: ['Vision', 'Creativity', 'Flair', 'Technique', 'First Touch'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.65, intensity: 1 },
      { x: 0.38, y: 0.68, intensity: 0.7 },
      { x: 0.62, y: 0.68, intensity: 0.7 },
      { x: 0.5, y: 0.78, intensity: 0.5 }
    ],
    compatible_formations: ['4-3-3', '4-2-3-1', '3-4-3', '4-1-4-1'] as Formation[]
  },
  
  false_9: {
    key: 'false_9',
    display_name: 'False 9',
    abbreviation: 'F9',
    primary_zone: 'ST' as PositionZone,
    description: 'Drops deep to create numerical superiority in midfield, dragging centre-backs out of position. The vacated space is exploited by underlapping wingers and late-running midfielders.',
    key_attributes: ['Vision', 'Technique', 'Off the Ball', 'Dribbling', 'Passing'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.72, intensity: 1 },
      { x: 0.5, y: 0.6, intensity: 0.8 },
      { x: 0.38, y: 0.75, intensity: 0.6 },
      { x: 0.62, y: 0.75, intensity: 0.6 }
    ],
    compatible_formations: ['4-3-3', '4-2-3-1', '3-4-3'] as Formation[]
  },
  
  wing_back: {
    key: 'wing_back',
    display_name: 'Wing-Back',
    abbreviation: 'WB',
    primary_zone: 'LWB' as PositionZone,
    description: 'Covers the entire flank in a back-three system. Defends deep when out of possession and provides width in attack. Requires exceptional stamina and 1v1 ability in both directions.',
    key_attributes: ['Stamina', 'Crossing', 'Tackling', 'Acceleration'],
    heatmap_coordinates: [
      { x: 0.1, y: 0.5, intensity: 1 },
      { x: 0.1, y: 0.75, intensity: 0.9 },
      { x: 0.1, y: 0.25, intensity: 0.8 },
      { x: 0.2, y: 0.6, intensity: 0.5 }
    ],
    compatible_formations: ['3-5-2', '5-3-2', '3-4-3'] as Formation[]
  },
  
  traditional_cb: {
    key: 'traditional_cb',
    display_name: 'Traditional Centre-Back',
    abbreviation: 'CB',
    primary_zone: 'CB_C' as PositionZone,
    description: 'No-nonsense defender focused on defensive duties. Strong in the air, excellent tackler, and organizes the backline. Keeps things simple and effective.',
    key_attributes: ['Heading', 'Tackling', 'Strength', 'Positioning'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.18, intensity: 1 },
      { x: 0.4, y: 0.15, intensity: 0.7 },
      { x: 0.6, y: 0.15, intensity: 0.7 },
      { x: 0.5, y: 0.25, intensity: 0.4 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '3-4-3', '4-1-4-1', '4-5-1'] as Formation[]
  },
  
  full_back: {
    key: 'full_back',
    display_name: 'Full Back',
    abbreviation: 'FB',
    primary_zone: 'LB' as PositionZone,
    description: 'Balanced defender who supports both defensive and attacking phases. Provides width in attack while maintaining defensive responsibilities. Good crossing and 1v1 defending.',
    key_attributes: ['Crossing', 'Tackling', 'Stamina', 'Positioning'],
    heatmap_coordinates: [
      { x: 0.15, y: 0.4, intensity: 1 },
      { x: 0.15, y: 0.7, intensity: 0.8 },
      { x: 0.25, y: 0.5, intensity: 0.6 },
      { x: 0.15, y: 0.2, intensity: 0.4 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-4-3', '4-1-4-1', '4-5-1'] as Formation[]
  },
  
  defensive_midfielder: {
    key: 'defensive_midfielder',
    display_name: 'Defensive Midfielder',
    abbreviation: 'DM',
    primary_zone: 'CDM' as PositionZone,
    description: 'Shield for the backline. Breaks up opposition attacks, covers space, and provides simple distribution to more creative teammates. Discipline and positioning are key.',
    key_attributes: ['Tackling', 'Positioning', 'Strength', 'Work Rate'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.4, intensity: 1 },
      { x: 0.4, y: 0.35, intensity: 0.7 },
      { x: 0.6, y: 0.35, intensity: 0.7 },
      { x: 0.5, y: 0.25, intensity: 0.5 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '4-1-4-1'] as Formation[]
  },
  
  central_midfielder: {
    key: 'central_midfielder',
    display_name: 'Central Midfielder',
    abbreviation: 'CM',
    primary_zone: 'CM_C' as PositionZone,
    description: 'All-round midfielder who contributes to both attack and defense. Good passing range, work rate, and tactical intelligence. Links defense to attack effectively.',
    key_attributes: ['Passing', 'Work Rate', 'Technique', 'Vision'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.5, intensity: 1 },
      { x: 0.4, y: 0.4, intensity: 0.7 },
      { x: 0.6, y: 0.4, intensity: 0.7 },
      { x: 0.5, y: 0.6, intensity: 0.6 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3', '4-1-4-1'] as Formation[]
  },
  
  wide_midfielder: {
    key: 'wide_midfielder',
    display_name: 'Wide Midfielder',
    abbreviation: 'WM',
    primary_zone: 'LM' as PositionZone,
    description: 'Traditional wide player who hugs the touchline. Provides width, delivers crosses, and tracks back defensively. Good pace and crossing ability.',
    key_attributes: ['Pace', 'Crossing', 'Dribbling', 'Work Rate'],
    heatmap_coordinates: [
      { x: 0.2, y: 0.6, intensity: 1 },
      { x: 0.15, y: 0.8, intensity: 0.8 },
      { x: 0.3, y: 0.4, intensity: 0.6 },
      { x: 0.25, y: 0.2, intensity: 0.4 }
    ],
    compatible_formations: ['4-4-2', '4-5-1', '3-5-2'] as Formation[]
  },
  
  traditional_winger: {
    key: 'traditional_winger',
    display_name: 'Traditional Winger',
    abbreviation: 'W',
    primary_zone: 'RW' as PositionZone,
    description: 'Speedy wide player who attacks the byline. Focuses on crossing and beating defenders 1v1. Provides width and creates chances from wide areas.',
    key_attributes: ['Pace', 'Crossing', 'Dribbling', 'Agility'],
    heatmap_coordinates: [
      { x: 0.85, y: 0.7, intensity: 1 },
      { x: 0.9, y: 0.85, intensity: 0.8 },
      { x: 0.75, y: 0.5, intensity: 0.6 },
      { x: 0.8, y: 0.3, intensity: 0.4 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-4-3', '4-5-1'] as Formation[]
  },
  
  target_man: {
    key: 'target_man',
    display_name: 'Target Man',
    abbreviation: 'TM',
    primary_zone: 'ST' as PositionZone,
    description: 'Physical striker who holds up play, wins aerial duels, and brings teammates into play. Strong in the air and with back to goal. Ideal for direct football.',
    key_attributes: ['Heading', 'Strength', 'Hold Up Play', 'Finishing'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.85, intensity: 1 },
      { x: 0.4, y: 0.8, intensity: 0.7 },
      { x: 0.6, y: 0.8, intensity: 0.7 },
      { x: 0.5, y: 0.7, intensity: 0.5 }
    ],
    compatible_formations: ['4-4-2', '4-2-3-1', '3-5-2', '4-5-1'] as Formation[]
  },
  
  poacher: {
    key: 'poacher',
    display_name: 'Poacher',
    abbreviation: 'P',
    primary_zone: 'ST' as PositionZone,
    description: 'Goal-focused striker who operates in the penalty area. Excellent movement off the ball, clinical finishing, and predatory instincts. Lives to score goals.',
    key_attributes: ['Finishing', 'Off the Ball', 'Composure', 'Acceleration'],
    heatmap_coordinates: [
      { x: 0.5, y: 0.9, intensity: 1 },
      { x: 0.4, y: 0.85, intensity: 0.6 },
      { x: 0.6, y: 0.85, intensity: 0.6 },
      { x: 0.5, y: 0.75, intensity: 0.4 }
    ],
    compatible_formations: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '4-5-1'] as Formation[]
  }
};

// Helper functions for role metadata
export const getRoleByKey = (key: string): RoleMetadata | undefined => {
  return ROLES_METADATA[key];
};

export const getRolesByFormation = (formation: Formation): RoleMetadata[] => {
  return Object.values(ROLES_METADATA).filter(role => 
    role.compatible_formations.includes(formation)
  );
};

export const getRolesByPosition = (position: PositionZone): RoleMetadata[] => {
  return Object.values(ROLES_METADATA).filter(role => 
    role.primary_zone === position
  );
};

export const getAllRoleAbbreviations = (): string[] => {
  return Object.values(ROLES_METADATA).map(role => role.abbreviation);
};
