import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function Messages() {
  const { messages, activePlayerChat, players, sendMessage, setActiveChat } = useAppStore();
  const [text, setText] = useState("");

  const player = players.find((p) => p._id === activePlayerChat);
  const chat = messages.filter((m) => m.playerId === activePlayerChat);

  if (!player) {
    return (
      <div style={{ display: "flex", height: "100%" }}>
        {/* SIDEBAR */}
        <div style={{ 
          width: "288px", 
          background: "#162018", 
          padding: "12px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px", 
          overflowY: "auto" 
        }}>
          <div style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "12px" }}>Select a player to chat</div>
          {players.map((p) => {
            const lastMsg = messages
              .filter((m) => m.playerId === p._id)
              .slice(-1)[0];

            return (
              <div
                key={p._id}
                onClick={() => setActiveChat(p._id)}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  background: activePlayerChat === p._id ? "#1f2a22" : "transparent"
                }}
              >
                <p style={{ fontWeight: 500, margin: "0 0 4px 0" }}>{p.name}</p>
                <p style={{ 
                  fontSize: "0.75rem", 
                  color: "#9ca3af", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  whiteSpace: "nowrap",
                  margin: 0
                }}>
                  {lastMsg?.text || "No messages yet"}
                </p>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        <div style={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "#9ca3af" 
        }}>
          Select a player to start chatting
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* SIDEBAR */}
      <div style={{ 
        width: "288px", 
        background: "#162018", 
        padding: "12px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "8px", 
        overflowY: "auto" 
      }}>
        <div style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "12px" }}>Conversations</div>
        {players.map((p) => {
          const lastMsg = messages
            .filter((m) => m.playerId === p.id)
            .slice(-1)[0];

          return (
            <div
              key={p.id}
              onClick={() => setActiveChat(p.id)}
              style={{
                padding: "12px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "background 0.2s",
                background: activePlayerChat === p.id ? "#1f2a22" : "transparent"
              }}
            >
              <p style={{ fontWeight: 500, margin: "0 0 4px 0" }}>{p.name}</p>
              <p style={{ 
                fontSize: "0.75rem", 
                color: "#9ca3af", 
                overflow: "hidden", 
                textOverflow: "ellipsis", 
                whiteSpace: "nowrap",
                margin: 0
              }}>
                {lastMsg?.text || "No messages yet"}
              </p>
            </div>
          );
        })}
      </div>

      {/* CHAT WINDOW */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* HEADER */}
        <div style={{ 
          padding: "16px", 
          borderBottom: "1px solid #1f2a22", 
          display: "flex", 
          alignItems: "center", 
          gap: "12px" 
        }}>
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
            <p style={{ fontWeight: 500, margin: "0 0 4px 0" }}>{player.name}</p>
            <span style={{
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "9999px",
              background: player.status === "Available"
                ? "rgba(34, 197, 94, 0.2)"
                : player.status === "Injured"
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(245, 158, 11, 0.2)",
              color: player.status === "Available"
                ? "#22c55e"
                : player.status === "Injured"
                ? "#ef4444"
                : "#f59e0b"
            }}>
              {player.status}
            </span>
          </div>
        </div>

        {/* MESSAGES */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "16px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px" 
        }}>
          {chat.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.sender === "coach" ? "flex-end" : "flex-start"
              }}
            >
              <div
                style={{
                  maxWidth: "320px",
                  padding: "8px 12px",
                  borderRadius: "16px",
                  fontSize: "0.875rem",
                  background: msg.sender === "coach" ? "#b5f033" : "#1f2a22",
                  color: msg.sender === "coach" ? "#000" : "#fff"
                }}
              >
                {msg.text}
                <div style={{ 
                  fontSize: "10px", 
                  color: "#6b7280", 
                  marginTop: "4px", 
                  textAlign: "right" 
                }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div style={{ 
          padding: "12px", 
          borderTop: "1px solid #1f2a22", 
          display: "flex", 
          gap: "8px" 
        }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "8px 16px",
              background: "#162018",
              borderRadius: "9999px",
              border: "none",
              outline: "none",
              color: "#fff"
            }}
          />

          <button
            onClick={() => {
              if (!text.trim()) return;
              sendMessage(text);
              setText("");
            }}
            style={{
              background: "#b5f033",
              padding: "8px 16px",
              borderRadius: "9999px",
              color: "#000",
              border: "none",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}