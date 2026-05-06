import React, { useState, useRef, useEffect } from 'react';
import { DMThread, DirectMessage, QuickPromptTemplate, QuickPromptKey } from './schema';
import { MOCK_QUICK_PROMPTS } from './mockdata';
import { generateMessageTimestamp } from './mockdater';

interface PlayerChatProps {
  thread: DMThread;
  onSendMessage: (message: string, quickPromptKey?: QuickPromptKey) => void;
  currentUserRole: 'manager' | 'player';
}

interface MessageBubbleProps {
  message: DirectMessage;
  isCurrentUser: boolean;
  playerName?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isCurrentUser, 
  playerName 
}) => {
  const lines = message.body.split('\n');
  const hasHeader = lines[0] && /^[A-Za-z]/.test(lines[0]);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: isCurrentUser ? 'row-reverse' : 'row',
      gap: 7,
      maxWidth: '80%',
      alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
      marginBottom: 10
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: isCurrentUser 
          ? 'linear-gradient(135deg,#1a5c2a,#22753a)' 
          : 'linear-gradient(135deg,#1e3a4f,#2d5a7b)',
        border: isCurrentUser 
          ? '2px solid #b5f033' 
          : '2px solid rgba(255,255,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontWeight: 700,
        color: isCurrentUser ? '#b5f033' : '#7eb8e0',
        fontFamily: 'Space Mono, monospace',
        flexShrink: 0
      }}>
        {isCurrentUser ? 'JM' : playerName?.split(' ').map(n => n[0]).join('')}
      </div>
      
      <div>
        <div style={{
          background: isCurrentUser 
            ? 'rgba(181,240,51,0.1)' 
            : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isCurrentUser 
            ? 'rgba(181,240,51,0.25)' 
            : 'rgba(255,255,255,0.08)'}`,
          borderRadius: isCurrentUser 
            ? '12px 3px 12px 12px' 
            : '3px 12px 12px 12px',
          padding: '9px 12px',
          maxWidth: 280
        }}>
          {hasHeader && (
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#b5f033',
              fontFamily: 'Space Mono, monospace',
              letterSpacing: 1,
              marginBottom: 5,
              textTransform: 'uppercase'
            }}>
              {lines[0]}
            </div>
          )}
          <div style={{
            fontSize: 12.5,
            color: '#dde8df',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap'
          }}>
            {hasHeader ? lines.slice(2).join('\n') : message.body}
          </div>
        </div>
        
        <div style={{
          fontSize: 10,
          color: '#4a6a4c',
          marginTop: 2,
          textAlign: isCurrentUser ? 'right' : 'left',
          fontFamily: 'Space Mono, monospace'
        }}>
          {generateMessageTimestamp()}
        </div>
      </div>
    </div>
  );
};

const QuickPromptButton: React.FC<{
  prompt: QuickPromptTemplate;
  onClick: (message: string, key: QuickPromptKey) => void;
}> = ({ prompt, onClick }) => {
  return (
    <button
      onClick={() => onClick(prompt.message_template, prompt.key)}
      style={{
        padding: '4px 10px',
        background: 'rgba(181,240,51,0.07)',
        border: '1px solid rgba(181,240,51,0.2)',
        borderRadius: 20,
        color: '#b5f033',
        fontSize: 11,
        cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 500,
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(181,240,51,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(181,240,51,0.07)';
      }}
    >
      {prompt.label}
    </button>
  );
};

export const PlayerChat: React.FC<PlayerChatProps> = ({ 
  thread, 
  onSendMessage,
  currentUserRole 
}) => {
  const [input, setInput] = useState('');
  const [showAllPrompts, setShowAllPrompts] = useState(false);
  const [messages, setMessages] = useState<DirectMessage[]>(thread.messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const visiblePrompts = showAllPrompts 
    ? MOCK_QUICK_PROMPTS 
    : MOCK_QUICK_PROMPTS.slice(0, 3);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (body: string, quickPromptKey?: QuickPromptKey) => {
    if (!body.trim()) return;
    
    const newMessage: DirectMessage = {
      id: `dm-${Date.now()}`,
      team_id: thread.team_id,
      manager_id: thread.manager_id,
      player_id: thread.player_id,
      sender_id: currentUserRole === 'manager' ? thread.manager_id : thread.player_id,
      body: body.trim(),
      quick_prompt_key: quickPromptKey,
      status: 'sent',
      sent_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    onSendMessage(body.trim(), quickPromptKey);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const getPlayerName = (): string => {
    // This would typically come from user data
    const playerNames: Record<string, string> = {
      'user-004': 'Kwame Asante',
      'user-010': 'Ben Fletcher',
      'user-012': 'Carlos Mena'
    };
    return playerNames[thread.player_id] || 'Player';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#0c1810'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(181,240,51,0.1)',
        background: '#112016',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#1e3a4f,#2d5a7b)',
          border: '2px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: '#7eb8e0',
          fontFamily: 'Space Mono, monospace'
        }}>
          {getPlayerName().split(' ').map(n => n[0]).join('')}
        </div>
        
        <div>
          <div style={{
            fontWeight: 600,
            fontSize: 13,
            color: '#f5f5f0'
          }}>
            {getPlayerName()}
          </div>
          <div style={{
            fontSize: 10,
            color: '#8a9e8d',
            fontFamily: 'Space Mono, monospace'
          }}>
            Player · Direct Message
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isCurrentUser={
              (currentUserRole === 'manager' && message.sender_id === thread.manager_id) ||
              (currentUserRole === 'player' && message.sender_id === thread.player_id)
            }
            currentUserRole={currentUserRole}
            playerName={getPlayerName()}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{
        padding: '8px 12px 4px',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{
          fontSize: 9,
          color: '#4a6a4c',
          fontFamily: 'Space Mono, monospace',
          letterSpacing: 1,
          marginBottom: 6,
          textTransform: 'uppercase'
        }}>
          Quick Prompts
        </div>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 5,
          marginBottom: 4
        }}>
          {visiblePrompts.map(prompt => (
            <QuickPromptButton
              key={prompt.key}
              prompt={prompt}
              onClick={handleSendMessage}
            />
          ))}
          
          <button
            onClick={() => setShowAllPrompts(!showAllPrompts)}
            style={{
              padding: '4px 10px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              color: '#8a9e8d',
              fontSize: 11,
              cursor: 'pointer'
            }}
          >
            {showAllPrompts ? 'Less' : `+${MOCK_QUICK_PROMPTS.length - 3} more`}
          </button>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        padding: '8px 12px 12px',
        display: 'flex',
        gap: 7
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Reply as ${currentUserRole === 'manager' ? 'manager' : 'player'}...`}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '9px 12px',
            color: '#f5f5f0',
            fontSize: 13,
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(181,240,51,0.3)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        />
        
        <button
          type="submit"
          disabled={!input.trim()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: input.trim() ? '#b5f033' : 'rgba(255,255,255,0.05)',
            border: 'none',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s ease'
          }}
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 16 16" 
            fill="none"
          >
            <path 
              d="M1 8L15 1L8 15V8H1Z" 
              fill={input.trim() ? '#0e1a12' : '#4a6a4c'}
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default PlayerChat;
