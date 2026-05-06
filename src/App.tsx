import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import FootballManagerApp from './FootballManagerApp';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const { isAuthenticated, checkAuth, isFetchingPlayers } = useAppStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await Promise.resolve();
      checkAuth();
      setAuthChecked(true);
    };

    initializeAuth();
  }, [checkAuth]);

  if (!authChecked) {
    return (
      <div className="loader-page">
        <div className="loader-card">
          <div className="loader-copy">Checking session…</div>
          <div className="loader-spinner" />
        </div>
        <style>{`
          .loader-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background: #0f172a;
            color: #fff;
          }

          .loader-card {
            text-align: center;
          }

          .loader-copy {
            font-size: 1.5rem;
            margin-bottom: 12px;
          }

          .loader-spinner {
            width: 64px;
            height: 64px;
            border: 4px solid rgba(255,255,255,0.2);
            border-top-color: #22c55e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <Login onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  if (isFetchingPlayers) {
    return (
      <div className="loader-page">
        <div className="loader-card">
          <div className="loader-copy">Loading your team…</div>
          <div className="loader-spinner" />
        </div>
      </div>
    );
  }

  return <FootballManagerApp />;
}

export default App;

export default App;
