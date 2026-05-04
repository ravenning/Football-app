import { useState } from "react";
import { useAppStore } from '../store/useAppStore';
import Messages from '../pages/Messages';

export default function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    status: 'Available' as 'Available' | 'Injured' | 'Absent',
    age: 0
  });

  const { players, user, logout, addPlayer, isLoading } = useAppStore();

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

  const recentPlayers = players.slice(0, 5).map(player => ({
    id: player._id,
    name: player.name,
    position: player.position || "Position TBD",
    status: player.status
  }));

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPlayer(newPlayer);
      setNewPlayer({ name: '', position: '', status: 'Available', age: 0 });
      setShowAddPlayer(false);
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  if (activeTab === 'messages') {
    return <Messages />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#eff6ff", color: "#0f172a" }}>
      {/* HEADER */}
      <div style={{ background: "#dbeafe", borderBottom: "4px solid #93c5fd", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", margin: 0 }}>Dashboard</h1>
            <p style={{ color: "#475569", margin: "4px 0 0 0" }}>Overview of your football team</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 600 }}>{user?.name || 'Manager'}</div>
              <div style={{ fontSize: "0.875rem", color: "#d1d5db" }}>Manager · Riverside FC</div>
            </div>
            <button
              onClick={logout}
              style={{
                padding: "8px 16px",
                background: "#eff6ff",
                border: "1px solid rgba(37,99,235,0.2)",
                borderRadius: "12px",
                color: "#0f172a",
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "background 0.2s"
              }}
            >
              Logout
            </button>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}>
              {user?.name?.split(' ').map(n => n[0]).join('') || 'M'}
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ background: "#ffffff", padding: "12px 24px", borderBottom: "1px solid #dbeafe" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 500,
              background: activeTab === 'dashboard' ? "#2563eb" : "#eff6ff",
              color: activeTab === 'dashboard' ? "#ffffff" : "#475569",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 500,
              background: activeTab === 'messages' ? "#2563eb" : "#eff6ff",
              color: activeTab === 'messages' ? "#ffffff" : "#475569",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Messages
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>

          {/* AVAILABILITY RATE */}
          <div style={{ 
            background: "#162018", 
            border: "1px solid #374151", 
            borderRadius: "16px", 
            padding: "24px",
            marginBottom: "32px"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "16px", color: "#2563eb" }}>Team Availability</h2>
            <div style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#2563eb" }}>{availabilityRate}%</div>
            <p style={{ color: "#64748b", marginTop: "8px" }}>Players available for next match</p>
          </div>

          {/* STATS CARDS */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "24px",
            marginBottom: "32px"
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ 
                background: "#ffffff", 
                border: "1px solid #dbeafe", 
                borderRadius: "16px", 
                padding: "24px",
                transition: "border-color 0.2s"
              }}>
                <p style={{ color: "#9ca3af", fontSize: "0.875rem", fontWeight: 500, marginBottom: "8px" }}>{stat.title}</p>
                <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#2563eb", margin: 0 }}>{stat.value}</h2>
              </div>
            ))}
          </div>

          {/* PLAYER LIST */}
          <div style={{ 
            background: "#ffffff", 
            border: "1px solid #dbeafe", 
            borderRadius: "16px", 
            padding: "24px",
            marginBottom: "32px"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "24px", color: "#2563eb" }}>Recent Players</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {recentPlayers.map((player, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "#eff6ff",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "50%", 
                      background: "#b5f033", 
                      color: "#000", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontWeight: "bold" 
                    }}>
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, margin: 0 }}>{player.name}</p>
                      <span style={{ fontSize: "0.875rem", color: "#9ca3af" }}>{player.position}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.875rem",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      fontWeight: 500,
                      background: player.status === "Available"
                        ? "rgba(34, 197, 94, 0.2)"
                        : player.status === "Injured"
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(245, 158, 11, 0.2)",
                      color: player.status === "Available"
                        ? "#22c55e"
                        : player.status === "Injured"
                        ? "#ef4444"
                        : "#f59e0b",
                      border: player.status === "Available"
                        ? "1px solid rgba(34, 197, 94, 0.3)"
                        : player.status === "Injured"
                        ? "1px solid rgba(239, 68, 68, 0.3)"
                        : "1px solid rgba(245, 158, 11, 0.3)"
                    }}
                  >
                    {player.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px"
          }}>
            <button
              onClick={() => setShowAddPlayer(true)}
              style={{
                background: "#b5f033",
                color: "#000",
                padding: "24px",
                borderRadius: "16px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                fontSize: "1.125rem",
                transition: "opacity 0.2s"
              }}
            >
              Add Player
            </button>

            <button style={{
              background: "#eff6ff",
              border: "1px solid #dbeafe",
              padding: "24px",
              borderRadius: "16px",
              cursor: "pointer",
              fontSize: "1.125rem",
              fontWeight: 500,
              color: "#0f172a",
              transition: "background 0.2s"
            }}>
              View Analytics
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              style={{
                background: "#1f2a22",
                border: "1px solid #4b5563",
                padding: "24px",
                borderRadius: "16px",
                cursor: "pointer",
                fontSize: "1.125rem",
                fontWeight: 500,
                color: "#fff",
                transition: "background 0.2s"
              }}
            >
              Open Messages
            </button>
          </div>

        </div>
      </div>

      {/* ADD PLAYER MODAL */}
      {showAddPlayer && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#ffffff",
            border: "1px solid rgba(37,99,235,0.2)",
            borderRadius: "16px",
            padding: "24px",
            width: "100%",
            maxWidth: "400px"
          }}>
            <h3 style={{ color: "#2563eb", marginBottom: "20px" }}>Add New Player</h3>

            <form onSubmit={handleAddPlayer}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "#f5f5f0", marginBottom: "8px" }}>Name</label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f5f5f0"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "#f5f5f0", marginBottom: "8px" }}>Position</label>
                <input
                  type="text"
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, position: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f5f5f0"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "#f5f5f0", marginBottom: "8px" }}>Age</label>
                <input
                  type="number"
                  value={newPlayer.age || ''}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f5f5f0"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#f5f5f0", marginBottom: "8px" }}>Status</label>
                <select
                  value={newPlayer.status}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, status: e.target.value as any }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f5f5f0"
                  }}
                >
                  <option value="Available">Available</option>
                  <option value="Injured">Injured</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#374151",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f5f5f0",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#b5f033",
                    border: "none",
                    borderRadius: "8px",
                    color: "#000",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1
                  }}
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