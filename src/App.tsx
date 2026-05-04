import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import FootballManagerApp from './FootballManagerApp';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const { isAuthenticated, checkAuth } = useAppStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <Login onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return <FootballManagerApp />;
}

export default App;
