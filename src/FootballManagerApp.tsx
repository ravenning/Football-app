import { useState } from "react";
import ProfessionalDashboard from "./components/ProfessionalDashboard";
import "./FootballManagerApp.css";

const COLORS = {
  dark: "#0e1a12",
  card: "#162018",
  grass: "#1a5c2a",
  lime: "#b5f033",
  white: "#f5f5f0",
  muted: "#8a9e8d",
  red: "#e83535",
  border: "rgba(181,240,51,0.15)",
} as const;

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
  .football-app * { box-sizing: border-box; margin: 0; padding: 0; }
  .football-app input, .football-app select, .football-app textarea {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 11px 13px;
    color: #f5f5f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    width: 100%;
  }
  .football-app input:focus, .football-app select:focus, .football-app textarea:focus {
    border-color: #b5f033;
    background: rgba(181,240,51,0.05);
  }
  .football-app select option { background: #0e1a12; }
  .football-app input::placeholder { color: rgba(255,255,255,0.2); }
  .football-app textarea { resize: vertical; min-height: 72px; }
  .football-app input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
`;

// Type definitions
interface ManagerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  username: string;
  password: string;
  confirmPassword: string;
  emergencyName: string;
  emergencyPhone: string;
  experience: string;
  formation: string;
  certs: string;
}

interface TeamData {
  teamName: string;
  teamCode: string;
  primaryColor: string;
  secondaryColor: string;
  ground: string;
  trainingDay: string;
  division: string;
  season: string;
  matchDays: string[];
  notes: string;
}

interface Player {
  firstName: string;
  lastName: string;
  shirtNumber: string;
  position: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  skillLevel: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRel: string;
  medicalNotes: string;
  allergies: string;
  availability: string[];
  notes: string;
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

interface SectionCardProps {
  tag?: string;
  title?: string;
  children: React.ReactNode;
}

interface GridProps {
  cols?: 2 | 3;
  children: React.ReactNode;
}

interface Span2Props {
  children: React.ReactNode;
}

interface Span3Props {
  children: React.ReactNode;
}

interface CalloutProps {
  children: React.ReactNode;
}

interface MonoTagProps {
  children: React.ReactNode;
}

interface DayPillsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

interface ManagerStepProps {
  data: ManagerData;
  setData: React.Dispatch<React.SetStateAction<ManagerData>>;
}

interface TeamStepProps {
  data: TeamData;
  setData: React.Dispatch<React.SetStateAction<TeamData>>;
}

interface PlayerCardProps {
  player: Player;
  index: number;
}

interface PlayerFormProps {
  player: Player;
  onChange: (player: Player) => void;
  onSave: () => void;
  onCancel: () => void;
}

interface PlayersStepProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: 'manager' | 'player';
  teamId?: string;
}

interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface HeatmapData {
  id: string;
  userId: string;
  matchId: string;
  positions: { x: number; y: number; timestamp: number }[];
}

interface Team {
  id: string;
  name: string;
  managerId: string;
  playerIds: string[];
}

interface RetireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetire: () => void;
  isManager: boolean;
  hasSuccessor: boolean;
  onAppointSuccessor: () => void;
}

interface AppointSuccessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessorAppointed: (successorId: string) => void;
  currentManagerId: string;
  teamId: string;
}

interface LoginScreenProps {
  message?: string;
}

// Component definitions
function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div className="fma-field">
      <label className="fma-field-label">
        {label}
        {required && <span className="fma-field-required" />}
      </label>
      {children}
      {hint && <span className="fma-field-hint">{hint}</span>}
    </div>
  );
}

function SectionCard({ tag, title, children }: SectionCardProps) {
  return (
    <div className="fma-section-card">
      {tag && <div className="fma-section-tag">{tag}</div>}
      {title && <div className="fma-section-title">{title}</div>}
      {children}
    </div>
  );
}

function Grid({ cols = 2, children }: GridProps) {
  const gridClass = cols === 3 ? "fma-grid-3" : "fma-grid-2";
  return (
    <div className={gridClass}>
      {children}
    </div>
  );
}

function Span2({ children }: Span2Props) {
  return <div className="fma-span-2">{children}</div>;
}

function Span3({ children }: Span3Props) {
  return <div className="fma-span-3">{children}</div>;
}

function Divider() {
  return <div className="fma-divider" />;
}

function Callout({ children }: CalloutProps) {
  return (
    <div className="fma-callout">
      {children}
    </div>
  );
}

function MonoTag({ children }: MonoTagProps) {
  return <div className="fma-mono-tag">{children}</div>;
}

function DayPills({ selected, onChange }: DayPillsProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="fma-day-pills">
      {days.map(d => {
        const on = selected.includes(d);
        return (
          <button key={d} onClick={() => onChange(on ? selected.filter(x => x !== d) : [...selected, d])}
            className={`fma-day-pill ${on ? 'active' : ''}` }>
            {d}
          </button>
        );
      })}
    </div>
  );
}

function ManagerStep({ data, setData }: ManagerStepProps) {
  const u = (field: keyof ManagerData, val: string) => setData((p: ManagerData) => ({ ...p, [field]: val }));
  return (
    <>
      <SectionCard tag="Step 1 of 3" title="Personal Information">
        <Grid cols={2}>
          <Field label="First Name" required><input value={data.firstName} onChange={e => u("firstName", e.target.value)} placeholder="e.g. Jamie" /></Field>
          <Field label="Last Name" required><input value={data.lastName} onChange={e => u("lastName", e.target.value)} placeholder="e.g. Carragher" /></Field>
          <Field label="Email Address" required><input type="email" value={data.email} onChange={e => u("email", e.target.value)} placeholder="you@email.com" /></Field>
          <Field label="Phone Number" required><input type="tel" value={data.phone} onChange={e => u("phone", e.target.value)} placeholder="+1 (555) 000-0000" /></Field>
          <Field label="Date of Birth"><input type="date" value={data.dob} onChange={e => u("dob", e.target.value)} /></Field>
          <Field label="Gender">
            <select value={data.gender} onChange={e => u("gender", e.target.value)}>
              <option value="">Select...</option>
              <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
            </select>
          </Field>
        </Grid>
      </SectionCard>

      <SectionCard tag="Account Security" title="Login Credentials">
        <Grid cols={2}>
          <Field label="Username" required hint="Used to log in. Must be unique."><input value={data.username} onChange={e => u("username", e.target.value)} placeholder="e.g. jamie_coach23" /></Field>
          <Field label="Password" required><input type="password" value={data.password} onChange={e => u("password", e.target.value)} placeholder="Min. 8 characters" /></Field>
          <Field label="Confirm Password" required><input type="password" value={data.confirmPassword} onChange={e => u("confirmPassword", e.target.value)} placeholder="Repeat password" /></Field>
          <Field label="Emergency Contact Name"><input value={data.emergencyName} onChange={e => u("emergencyName", e.target.value)} placeholder="Full name" /></Field>
          <Span2><Field label="Emergency Contact Phone"><input type="tel" value={data.emergencyPhone} onChange={e => u("emergencyPhone", e.target.value)} placeholder="+1 (555) 000-0000" /></Field></Span2>
        </Grid>
      </SectionCard>

      <SectionCard tag="Background" title="Football Experience">
        <Grid cols={2}>
          <Field label="Coaching Experience">
            <select value={data.experience} onChange={e => u("experience", e.target.value)}>
              <option value="">Select level...</option>
              <option>First time manager</option><option>1-2 seasons</option><option>3-5 seasons</option><option>5+ seasons</option>
            </select>
          </Field>
          <Field label="Preferred Formation">
            <select value={data.formation} onChange={e => u("formation", e.target.value)}>
              <option value="">No preference</option>
              <option>4-4-2</option><option>4-3-3</option><option>3-5-2</option><option>5-3-2</option><option>4-2-3-1</option>
            </select>
          </Field>
          <Span2><Field label="Certifications / Coaching Badges (Optional)"><input value={data.certs} onChange={e => u("certs", e.target.value)} placeholder="e.g. UEFA C Licence, FA Level 1..." /></Field></Span2>
        </Grid>
      </SectionCard>
    </>
  );
}

function TeamStep({ data, setData }: TeamStepProps) {
  const u = (field: keyof TeamData, val: string | string[]) => setData((p: TeamData) => ({ ...p, [field]: val }));
  return (
    <>
      <SectionCard tag="Step 2 of 3" title="Team Details">
        <Callout>This information represents your club in the league. Choose a name and colours your squad will recognise on fixtures and standings boards.</Callout>
        <Grid cols={2}>
          <Field label="Team / Club Name" required><input value={data.teamName} onChange={e => u("teamName", e.target.value)} placeholder="e.g. Riverside FC" /></Field>
          <Field label="Short Team Code" hint="Shown on scoreboards & standings"><input value={data.teamCode} onChange={e => u("teamCode", e.target.value.toUpperCase())} placeholder="e.g. RIV" maxLength={4} /></Field>
          <Field label="Primary Shirt Colour" required>
            <select value={data.primaryColor} onChange={e => u("primaryColor", e.target.value)}>
              <option value="">Select...</option>
              {["Red","Blue","Green","Yellow","White","Black","Orange","Purple","Sky Blue","Maroon","Navy","Other"].map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Secondary / Away Colour">
            <select value={data.secondaryColor} onChange={e => u("secondaryColor", e.target.value)}>
              <option value="">Select...</option>
              {["Red","Blue","Green","Yellow","White","Black","Orange","Purple","Sky Blue","Maroon","Navy","Other"].map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Home Ground / Pitch"><input value={data.ground} onChange={e => u("ground", e.target.value)} placeholder="e.g. Greenway Park Pitch 2" /></Field>
          <Field label="Usual Training Day">
            <select value={data.trainingDay} onChange={e => u("trainingDay", e.target.value)}>
              <option value="">Select...</option>
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
        </Grid>
      </SectionCard>

      <SectionCard tag="League Registration" title="Competition Details">
        <Grid cols={2}>
          <Field label="Division / League" required>
            <select value={data.division} onChange={e => u("division", e.target.value)}>
              <option value="">Select division...</option>
              {["5-a-side Recreational","7-a-side Recreational","11-a-side Amateur","Veteran (35+)","Mixed Gender","Youth U-14","Youth U-18"].map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Season / Year" required>
            <select value={data.season} onChange={e => u("season", e.target.value)}>
              {["Spring 2026","Summer 2026","Autumn 2026"].map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Span2>
            <Field label="Preferred Match Days">
              <div style={{ marginTop: 6 }}>
                <DayPills selected={data.matchDays} onChange={v => u("matchDays", v)} />
              </div>
            </Field>
          </Span2>
          <Span2><Field label="Notes for League Admin"><textarea value={data.notes} onChange={e => u("notes", e.target.value)} placeholder="e.g. Can't play Bank Holidays, or notes about ground access..." /></Field></Span2>
        </Grid>
      </SectionCard>
    </>
  );
}

function PlayerCard({ player, index }: PlayerCardProps) {
  const complete = player.firstName && player.position && player.dob;
  return (
    <div className="fma-player-card">
      <div className="fma-player-shirt">{player.shirtNumber || index + 1}</div>
      <div className="fma-player-info">
        <div className="fma-player-name">{player.firstName} {player.lastName}</div>
        <div className="fma-player-details">{player.position || "Position TBC"} · #{player.shirtNumber || "?"}</div>
      </div>
      <span className={`fma-player-badge ${complete ? 'complete' : 'incomplete'}`}>
        {complete ? "Ready" : "Incomplete"}
      </span>
    </div>
  );
}

const emptyPlayer = (): Player => ({ firstName: "", lastName: "", shirtNumber: "", position: "", dob: "", gender: "", phone: "", email: "", skillLevel: "", emergencyName: "", emergencyPhone: "", emergencyRel: "", medicalNotes: "", allergies: "", availability: ["Sat", "Sun"], notes: "" });

function PlayerForm({ player, onChange, onSave, onCancel }: PlayerFormProps) {
  const u = (f: keyof Player, v: string | string[]) => onChange({ ...player, [f]: v });
  return (
    <div className="fma-player-form">
      <div className="fma-player-form-header">
        <div className="fma-player-form-title">+ New Player</div>
        <button onClick={onCancel} className="fma-player-form-close">×</button>
      </div>

      <Grid cols={3}>
        <Field label="First Name" required><input value={player.firstName} onChange={e => u("firstName", e.target.value)} placeholder="First" /></Field>
        <Field label="Last Name" required><input value={player.lastName} onChange={e => u("lastName", e.target.value)} placeholder="Last" /></Field>
        <Field label="Shirt Number" required><input type="number" value={player.shirtNumber} onChange={e => u("shirtNumber", e.target.value)} placeholder="e.g. 10" min={1} max={99} /></Field>

        <Field label="Position" required>
          <select value={player.position} onChange={e => u("position", e.target.value)}>
            <option value="">Select...</option>
            {["Goalkeeper","Defender","Midfielder","Forward","Utility / Any"].map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Date of Birth" required><input type="date" value={player.dob} onChange={e => u("dob", e.target.value)} /></Field>
        <Field label="Gender">
          <select value={player.gender} onChange={e => u("gender", e.target.value)}>
            <option value="">Select...</option>
            <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
          </select>
        </Field>

        <Span3><Divider /></Span3>

        <Field label="Phone"><input type="tel" value={player.phone} onChange={e => u("phone", e.target.value)} placeholder="+1 (555) 000-0000" /></Field>
        <Field label="Email"><input type="email" value={player.email} onChange={e => u("email", e.target.value)} placeholder="player@email.com" /></Field>
        <Field label="Skill Level">
          <select value={player.skillLevel} onChange={e => u("skillLevel", e.target.value)}>
            <option value="">Select...</option>
            {["Beginner","Intermediate","Advanced","Ex-competitive"].map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>

        <Span3><MonoTag>Health & Emergency (Private)</MonoTag></Span3>

        <Field label="Emergency Contact Name"><input value={player.emergencyName} onChange={e => u("emergencyName", e.target.value)} placeholder="Full name" /></Field>
        <Field label="Emergency Contact Phone"><input type="tel" value={player.emergencyPhone} onChange={e => u("emergencyPhone", e.target.value)} placeholder="+1 (555) 000-0000" /></Field>
        <Field label="Relationship">
          <select value={player.emergencyRel} onChange={e => u("emergencyRel", e.target.value)}>
            <option value="">Select...</option>
            {["Parent","Spouse / Partner","Sibling","Friend","Other"].map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>

        <Span3><Field label="Known Medical Conditions / Injuries"><textarea value={player.medicalNotes} onChange={e => u("medicalNotes", e.target.value)} placeholder="e.g. Asthmatic, recovering from knee surgery..." /></Field></Span3>
        <Span3><Field label="Allergies"><input value={player.allergies} onChange={e => u("allergies", e.target.value)} placeholder="e.g. Penicillin, latex..." /></Field></Span3>

        <Span3><MonoTag>Availability</MonoTag></Span3>
        <Span3>
          <Field label="Available Days">
            <div className="fma-day-pills-container">
              <DayPills selected={player.availability} onChange={v => u("availability", v)} />
            </div>
          </Field>
        </Span3>

        <Span3><Field label="Additional Notes"><textarea value={player.notes} onChange={e => u("notes", e.target.value)} placeholder="e.g. Can only play mornings..." /></Field></Span3>
      </Grid>

      <div className="fma-button-group">
        <button onClick={onSave} className="fma-button-primary">
          ADD PLAYER
        </button>
        <button onClick={onCancel} className="fma-button-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

// Mock database functions (in a real app, these would be API calls)
const mockDatabase = {
  users: [] as User[],
  directMessages: [] as DirectMessage[],
  heatmapData: [] as HeatmapData[],
  teams: [] as Team[],
};

function retireUser(userId: string): { success: boolean; error?: string } {
  const user = mockDatabase.users.find(u => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // Check if user is manager and has no successor
  if (user.role === 'manager') {
    const team = mockDatabase.teams.find(t => t.managerId === userId);
    if (team) {
      const hasSuccessor = mockDatabase.users.some(u => 
        u.teamId === team.id && u.role === 'manager' && u.id !== userId
      );
      if (!hasSuccessor) {
        return { success: false, error: 'You must appoint a successor before retiring.' };
      }
    }
  }

  // Delete user's direct messages
  mockDatabase.directMessages = mockDatabase.directMessages.filter(
    msg => msg.senderId !== userId && msg.receiverId !== userId
  );

  // Delete user's heatmap data
  mockDatabase.heatmapData = mockDatabase.heatmapData.filter(
    data => data.userId !== userId
  );

  // Remove user from team assignments
  mockDatabase.teams.forEach(team => {
    team.playerIds = team.playerIds.filter(id => id !== userId);
    if (team.managerId === userId) {
      team.managerId = '';
    }
  });

  // Delete the user
  mockDatabase.users = mockDatabase.users.filter(u => u.id !== userId);

  return { success: true };
}

function AppointSuccessorModal({ isOpen, onClose, onSuccessorAppointed, currentManagerId, teamId }: AppointSuccessorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedSuccessor, setSelectedSuccessor] = useState<User | null>(null);
  const [isAppointing, setIsAppointing] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');

  if (!isOpen) return null;

  const handleSearch = () => {
    // Mock search - in real app, this would be an API call
    const mockUsers: User[] = [
      { id: 'user1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@email.com', username: 'sarah_coach', role: 'player', teamId },
      { id: 'user2', firstName: 'Mike', lastName: 'Wilson', email: 'mike@email.com', username: 'mike_coach', role: 'player', teamId },
      { id: 'user3', firstName: 'Emma', lastName: 'Davis', email: 'emma@email.com', username: 'emma_coach', role: 'manager', teamId: 'other-team' },
    ];
    
    const filtered = mockUsers.filter(user => 
      user.id !== currentManagerId &&
      (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(filtered);
  };

  const handleAppoint = async () => {
    if (!selectedSuccessor) return;
    
    setIsAppointing(true);
    setAppointmentError('');
    
    try {
      // Mock appointment - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user's role to manager
      const user = mockDatabase.users.find(u => u.id === selectedSuccessor.id);
      if (user) {
        user.role = 'manager';
      }
      
      onSuccessorAppointed(selectedSuccessor.id);
      onClose();
    } catch {
      setAppointmentError('Failed to appoint successor');
    } finally {
      setIsAppointing(false);
    }
  };

  return (
    <div className="fma-modal-overlay lime">
      <div className="fma-modal-content">
        
        <div className="fma-modal-title">
          👥 APPOINT SUCCESSOR
        </div>

        <div className="fma-modal-info">
          <p>
            Before you retire, you must appoint a successor.
          </p>
          <p>
            Search for a team member to take over as manager.
          </p>
        </div>

        <div className="fma-modal-section">
          <label className="fma-modal-label">
            Search by name, username, or email
          </label>
          <div className="fma-modal-search-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search terms..."
              className="fma-modal-input fma-modal-search-input"
            />
            <button
              onClick={handleSearch}
              className="fma-modal-search-btn"
            >
              Search
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="fma-search-results">
            <div className="fma-search-results-title">Search Results</div>
            <div className="fma-search-results-list">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  onClick={() => setSelectedSuccessor(user)}
                  className={`fma-search-result-item ${selectedSuccessor?.id === user.id ? 'selected' : ''}`}
                >
                  <div className="fma-search-result-header">
                    <div>
                      <div className="fma-search-result-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="fma-search-result-meta">
                        @{user.username} · {user.role} · {user.email}
                      </div>
                    </div>
                    {selectedSuccessor?.id === user.id && (
                      <div className="fma-search-result-badge">
                        Selected
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {appointmentError && (
          <div className="fma-error-box">
            {appointmentError}
          </div>
        )}

        <div className="fma-modal-buttons">
          <button
            onClick={handleAppoint}
            disabled={!selectedSuccessor || isAppointing}
            className="fma-modal-button"
          >
            {isAppointing ? 'Appointing...' : 'Appoint as Manager'}
          </button>
          <button
            onClick={onClose}
            disabled={isAppointing}
            className="fma-modal-button secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ message }: LoginScreenProps) {
  return (
    <div className="fma-login-screen">
      <style>{globalStyle}</style>
      <div className="fma-login-container">
        <div className="fma-login-logo">
          Kick<span className="fma-login-logo-white">off</span>
        </div>
        
        {message && (
          <div className="fma-login-message">
            <p>
              {message}
            </p>
          </div>
        )}

        <div className="fma-login-form-group">
          <div className="fma-login-field">
            <label className="fma-login-label">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="fma-login-input"
            />
          </div>
          
          <div className="fma-login-field">
            <label className="fma-login-label">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="fma-login-input"
            />
          </div>
        </div>

        <button className="fma-login-button">
          Login
        </button>

        <button className="fma-login-button secondary">
          Create New Account
        </button>
      </div>
    </div>
  );
}

function RetireModal({ isOpen, onClose, onRetire, isManager, hasSuccessor, onAppointSuccessor }: RetireModalProps) {
  const [confirmation, setConfirmation] = useState('');
  const [isRetiring, setIsRetiring] = useState(false);

  if (!isOpen) return null;

  const handleRetire = async () => {
    if (confirmation !== 'RETIRE') return;
    
    setIsRetiring(true);
    try {
      await onRetire();
      onClose();
    } finally {
      setIsRetiring(false);
    }
  };

  const canRetire = !isManager || hasSuccessor;

  return (
    <div className="fma-modal-overlay red">
      <div className="fma-modal-content">
        <div className="fma-retire-modal-title">
          ⚠️ DANGER ZONE
        </div>

        <div className="fma-retire-modal-warning">
          <p>This action is PERMANENT and cannot be undone.</p>
          <p>
            All your data will be permanently deleted including:
            Direct Messages, Heatmap Data, and Team Assignments.
          </p>
        </div>

        {!canRetire && (
          <div className="fma-retire-modal-notice">
            You must appoint a successor before retiring.
          </div>
        )}

        {!canRetire && (
          <button
            onClick={onAppointSuccessor}
            className="fma-retire-modal-button appoint"
          >
            Appoint Successor First
          </button>
        )}

        <div className="fma-modal-section">
          <label className="fma-modal-label">
            Type RETIRE to confirm
          </label>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Type RETIRE"
            className={`fma-retire-modal-input ${confirmation === 'RETIRE' ? 'retire-confirm' : ''}`}
          />
        </div>

        <div className="fma-retire-modal-buttons">
          <button
            onClick={handleRetire}
            disabled={confirmation !== 'RETIRE' || !canRetire || isRetiring}
            className="fma-retire-modal-button retire"
          >
            {isRetiring ? 'Retiring...' : 'Permanently Delete Account'}
          </button>
          <button
            onClick={onClose}
            disabled={isRetiring}
            className="fma-retire-modal-button cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayersStep({ players, setPlayers }: PlayersStepProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Player>(emptyPlayer());

  const handleSave = () => {
    if (!draft.firstName || !draft.position || !draft.dob) return;
    setPlayers((p: Player[]) => [...p, draft]);
    setDraft(emptyPlayer());
    setFormOpen(false);
  };

  return (
    <SectionCard tag="Step 3 of 3" title="Squad Registration">
      <Callout>Add each player in your squad. Health and emergency details are private - only league admins can view them.</Callout>

      {players.map((p, i) => <PlayerCard key={i} player={p} index={i} />)}

      {formOpen
        ? <PlayerForm player={draft} onChange={setDraft} onSave={handleSave} onCancel={() => setFormOpen(false)} />
        : (
          <button onClick={() => setFormOpen(true)} className="fma-add-player-button">
            + Add Player
          </button>
        )
      }
    </SectionCard>
  );
}

const TABS = ["Manager", "Team", "Players"];

export default function FootballManagerApp() {
  const [tab, setTab] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [retireModalOpen, setRetireModalOpen] = useState(false);
  const [appointSuccessorModalOpen, setAppointSuccessorModalOpen] = useState(false);
  const [retirementError, setRetirementError] = useState('');
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [hasSuccessor, setHasSuccessor] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [managerData, setManagerData] = useState<ManagerData>({ firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "", username: "", password: "", confirmPassword: "", emergencyName: "", emergencyPhone: "", experience: "", formation: "", certs: "" });
  const [teamData, setTeamData] = useState<TeamData>({ teamName: "", teamCode: "", primaryColor: "", secondaryColor: "", ground: "", trainingDay: "", division: "", season: "Spring 2026", matchDays: ["Sat", "Sun"], notes: "" });
  const [players, setPlayers] = useState<Player[]>([]);

  // Mock current user (in a real app, this would come from authentication)
  const currentUser: User = {
    id: 'current-user-id',
    firstName: managerData.firstName || 'John',
    lastName: managerData.lastName || 'Doe',
    email: managerData.email,
    username: managerData.username,
    role: 'manager',
    teamId: 'team-1'
  };

  const isManager = currentUser.role === 'manager';

  const handleRetire = async () => {
    try {
      setRetirementError('');
      const result = retireUser(currentUser.id);
      
      if (!result.success) {
        setRetirementError(result.error || 'Failed to retire account');
        return;
      }
      
      // Redirect to login screen with success message
      setLoginMessage('Your career has ended. All data has been removed.');
      setShowLoginScreen(true);
      setRetireModalOpen(false);
    } catch {
      setRetirementError('An unexpected error occurred');
    }
  };

  const handleAppointSuccessor = () => {
    setRetireModalOpen(false);
    setAppointSuccessorModalOpen(true);
  };

  const handleSuccessorAppointed = () => {
    setHasSuccessor(true);
    setAppointSuccessorModalOpen(false);
    
    // Now open the retire modal again since successor is appointed
    setTimeout(() => {
      setRetireModalOpen(true);
    }, 500);
  };

  if (showDashboard) {
    return <ProfessionalDashboard />;
  }

  if (showLoginScreen) {
    return <LoginScreen message={loginMessage} />;
  }

  if (submitted) {
    return (
      <div className="fma-submitted-screen">
        <style>{globalStyle}</style>
        <div className="fma-submitted-content">
          <div className="fma-submitted-logo"> </div>
          <div className="fma-submitted-title">REGISTRATION <span>SUBMITTED!</span></div>
          <p className="fma-submitted-description">Your team <strong>{teamData.teamName || "your club"}</strong> has been registered. The league admin will be in touch shortly.</p>
          <div className="fma-submitted-badge">
            {players.length} player{players.length !== 1 ? "s" : ""} registered · {teamData.division || "Division TBC"}
          </div>
          <br /><br />
          <button onClick={() => setSubmitted(false)} className="fma-submitted-button">
            Edit Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="football-app" style={{ background: COLORS.dark, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: COLORS.white, position: "relative" }}>
      <style>{globalStyle}</style>

      <div style={{ position: "fixed", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.013) 79px, rgba(255,255,255,0.013) 80px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ background: COLORS.grass, padding: "13px 36px", display: "flex", alignItems: "center", gap: 14, borderBottom: `3px solid ${COLORS.lime}`, position: "relative", zIndex: 10 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: 3, color: COLORS.lime }}>
          Kick<span style={{ color: COLORS.white }}>off</span>
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 2, marginLeft: "auto" }}>
          Recreational Football League System
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "44px 22px 80px", position: "relative", zIndex: 1 }}>

        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 0.9, letterSpacing: 2, marginBottom: 8 }}>
          MANAGER <span style={{ color: COLORS.lime }}>REGISTRATION</span>
        </div>
        <p style={{ color: COLORS.muted, fontSize: "0.88rem", marginBottom: 40, fontWeight: 300 }}>
          Complete all three steps to register your team for the season. Fields marked with <span style={{ color: COLORS.lime }}> </span> are required.
        </p>

        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: COLORS.card, padding: 4, borderRadius: 10, border: `1px solid ${COLORS.border}`, width: "fit-content" }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ padding: "9px 26px", borderRadius: 7, fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1.5px", cursor: "pointer", border: "none", background: tab === i ? COLORS.lime : "transparent", color: tab === i ? COLORS.dark : COLORS.muted, fontWeight: tab === i ? 700 : 400, transition: "all 0.2s" }}>
              {["","",""][i]} {t}
            </button>
          ))}
        </div>

        {tab === 0 && <ManagerStep data={managerData} setData={setManagerData} />}
        {tab === 1 && <TeamStep data={teamData} setData={setTeamData} />}
        {tab === 2 && <PlayersStep players={players} setPlayers={setPlayers} />}

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 28, flexWrap: "wrap" }}>
          {tab > 0 && (
            <button onClick={() => setTab(t => t - 1)} style={{ padding: "13px 22px", background: "transparent", color: COLORS.muted, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: 1, cursor: "pointer", textTransform: "uppercase" }}>
              Back
            </button>
          )}
          {tab < 2 ? (
            <button onClick={() => setTab(t => t + 1)} style={{ padding: "13px 36px", background: COLORS.lime, color: COLORS.dark, border: "none", borderRadius: 8, fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", letterSpacing: 2, cursor: "pointer" }}>
              NEXT: {TABS[tab + 1].toUpperCase()} 
            </button>
          ) : (
            <button onClick={() => {
            setSubmitted(true);
            // Show dashboard after registration
            setTimeout(() => setShowDashboard(true), 2000);
          }} style={{ padding: "13px 36px", background: COLORS.lime, color: COLORS.dark, border: "none", borderRadius: 8, fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", letterSpacing: 2, cursor: "pointer" }}>
              SUBMIT REGISTRATION
            </button>
          )}
          <button style={{ padding: "13px 20px", background: "transparent", color: COLORS.muted, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: 1, cursor: "pointer", textTransform: "uppercase" }}>
            Save Draft
          </button>
          {submitted && (
            <button 
              onClick={() => setShowDashboard(true)}
              style={{ padding: "13px 20px", background: COLORS.lime, color: COLORS.dark, border: "none", borderRadius: 8, fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: 1, cursor: "pointer", textTransform: "uppercase", marginLeft: "auto" }}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>

      <RetireModal
        isOpen={retireModalOpen}
        onClose={() => {
          setRetireModalOpen(false);
          setRetirementError('');
        }}
        onRetire={handleRetire}
        isManager={isManager}
        hasSuccessor={hasSuccessor}
        onAppointSuccessor={handleAppointSuccessor}
      />

      <AppointSuccessorModal
        isOpen={appointSuccessorModalOpen}
        onClose={() => setAppointSuccessorModalOpen(false)}
        onSuccessorAppointed={handleSuccessorAppointed}
        currentManagerId={currentUser.id}
        teamId={currentUser.teamId || 'team-1'}
      />

      {retirementError && (
        <div className="fma-retirement-error">
          {retirementError}
        </div>
      )}
    </div>
  );
}
