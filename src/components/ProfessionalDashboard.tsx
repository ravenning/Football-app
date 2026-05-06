import { useEffect, useState } from "react";
import { useAppStore } from '../store/useAppStore';
import Messages from '../pages/Messages';
import './ProfessionalDashboard.css';

export default function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    status: 'Available' as 'Available' | 'Injured' | 'Absent',
    age: 0,
    photoFile: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const { players, user, logout, addPlayer, isLoading, isFetchingPlayers, isAuthenticated, liveScore, socketConnected, sendLiveScoreUpdate } = useAppStore();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  const available = players.filter((p) => p.status === "Available").length;
  const injured = players.filter((p) => p.status === "Injured").length;
  const absent = players.filter((p) => p.status === "Absent").length;

  const availabilityRate = players.length
    ? Math.round((available / players.length) * 100)
    : 0;

  const stats = [
    { title: "Total Players", value: players.length },
    { title: "Available", value: available },
    { title: "Injured", value: injured },
    { title: "Absent", value: absent },
  ];

  const skeletonStats = Array.from({ length: 4 }, (_, i) => (
    <div key={i} className="stat-card skeleton-card">
      <span className="skeleton-line short" />
      <span className="skeleton-line long" />
    </div>
  ));

  const recentPlayers = players.slice(0, 5).map(player => ({
    id: player._id,
    name: player.name,
    position: player.position || "Position TBD",
    status: player.status,
    photoUrl: player.photoUrl || ''
  }));

  const skeletonPlayers = Array.from({ length: 5 }, (_, i) => (
    <div key={i} className="player-item skeleton-player">
      <div className="player-info">
        <div className="player-avatar skeleton-avatar" />
        <div className="player-details">
          <span className="skeleton-line short" />
          <span className="skeleton-line long" />
        </div>
      </div>
      <span className="player-status skeleton-pill" />
    </div>
  ));

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPlayer(newPlayer);
      setNewPlayer({ name: '', position: '', status: 'Available', age: 0, photoFile: null });
      setPhotoPreview(null);
      setShowAddPlayer(false);
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const handlePhotoChange = (file: File | null) => {
    setNewPlayer((prev) => ({ ...prev, photoFile: file }));
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handlePublishScore = async () => {
    const home = Number(prompt('Home score', '1'));
    const away = Number(prompt('Away score', '0'));
    if (Number.isNaN(home) || Number.isNaN(away)) return;

    try {
      await sendLiveScoreUpdate({ matchId: 'live-match', homeScore: home, awayScore: away, description: `Live update: ${home}-${away}` });
    } catch (error) {
      console.error('Error publishing score update', error);
    }
  };

  if (activeTab === 'messages') {
    return <Messages />;
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p>Overview of your football team</p>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-name">{user?.name || 'Manager'}</div>
              <div className="user-role">Manager · Riverside FC</div>
            </div>
            <button
              onClick={logout}
              className="logout-btn"
            >
              Logout
            </button>
            <div className="avatar">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'M'}
            </div>
          </div>
        </div>
      </div>

      {!isOnline && (
        <div className="offline-banner">
          Offline mode enabled — you can still view cached data but new updates require a connection.
        </div>
      )}

      {/* NAVIGATION */}
      <div className="navigation">
        <div className="nav-tabs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
          >
            Messages
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="content-wrapper">

          {/* LIVE SCORE */}
          <div className="score-card">
            <div className="score-card-heading">
              <h2>Live Score</h2>
              <span className={`status-pill ${socketConnected ? 'online' : 'offline'}`}>
                {socketConnected ? 'Live updates active' : 'Socket disconnected'}
              </span>
            </div>
            {liveScore ? (
              <div className="score-body">
                <div className="score-numbers">
                  <span>{liveScore.homeScore}</span>
                  <span>–</span>
                  <span>{liveScore.awayScore}</span>
                </div>
                <p>{liveScore.description}</p>
                <small>{new Date(liveScore.timestamp).toLocaleTimeString()}</small>
              </div>
            ) : (
              <div className="score-body empty">
                No live score updates yet. Use Publish Score Update to emit a new event.
              </div>
            )}
            <button className="action-btn secondary" onClick={handlePublishScore}>
              Publish Score Update
            </button>
          </div>

          {/* AVAILABILITY RATE */}
          <div className="availability-card">
            <h2 className="availability-title">Team Availability</h2>
            <div className="availability-rate">{availabilityRate}%</div>
            <p className="availability-desc">Players available for next match</p>
          </div>

          {/* STATS CARDS */}
          <div className="stats-grid">
            {isFetchingPlayers ? skeletonStats : stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
            ))}
          </div>

          {/* PLAYER LIST */}
          <div className="players-card">
            <h2 className="players-title">Recent Players</h2>

            <div className="players-list">
              {isFetchingPlayers ? skeletonPlayers : (
                recentPlayers.length > 0 ? (
                  recentPlayers.map((player, i) => (
                    <div key={i} className="player-item">
                      <div className="player-info">
                        <div className="player-avatar">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.name} />
                      ) : (
                        player.name.split(' ').map(n => n[0]).join('')
                      )}
                          <p>{player.name}</p>
                          <span className="player-position">{player.position}</span>
                        </div>
                      </div>

                      <span
                        className={`player-status ${player.status.toLowerCase()}`}
                      >
                        {player.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-data">No player data is available right now.</div>
                )
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="quick-actions">
            <button
              onClick={() => setShowAddPlayer(true)}
              className="action-btn"
            >
              Add Player
            </button>

            <button className="action-btn secondary">
              View Analytics
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className="action-btn secondary"
            >
              Open Messages
            </button>
          </div>

        </div>
      </div>

      {/* ADD PLAYER MODAL */}
      {showAddPlayer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Add New Player</h3>

            <form onSubmit={handleAddPlayer}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Enter player name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Enter player position"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  value={newPlayer.age || ''}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter player age"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={newPlayer.status}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, status: e.target.value as 'Available' | 'Injured' | 'Absent' }))}
                  title="Select player status"
                  className="form-select"
                >
                  <option value="Available">Available</option>
                  <option value="Injured">Injured</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  title="Choose a player photo"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
                  className="form-input"
                />
                {photoPreview && <img src={photoPreview} alt="Preview" className="photo-preview" />}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-submit"
                >
                  {isLoading ? 'Adding...' : 'Add Player'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}