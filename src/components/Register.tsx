import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // You could add this to the store's error state, but for now we'll handle it locally
      alert('Passwords do not match');
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#eff6ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(37,99,235,0.2)',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1d4ed8',
            marginBottom: '8px'
          }}>
            Football Manager
          </h1>
          <p style={{ color: '#475569' }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#0f172a',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f8fbff',
                border: '1px solid #d4e2f0',
                borderRadius: '10px',
                color: '#0f172a',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s'
              }}
              placeholder="Enter your full name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#0f172a',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f8fbff',
                border: '1px solid #d4e2f0',
                borderRadius: '10px',
                color: '#0f172a',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#0f172a',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f8fbff',
                border: '1px solid #d4e2f0',
                borderRadius: '10px',
                color: '#0f172a',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s'
              }}
              placeholder="Enter your password"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#0f172a',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f8fbff',
                border: '1px solid #d4e2f0',
                borderRadius: '10px',
                color: '#0f172a',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s'
              }}
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(232, 53, 53, 0.1)',
              border: '1px solid #e83535',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#e83535',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#2563eb',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'underline'
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}