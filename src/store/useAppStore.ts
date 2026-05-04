import { create } from 'zustand';

interface Player {
  _id: string;
  name: string;
  position?: string;
  status: 'Available' | 'Injured' | 'Absent';
  age?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: number;
  playerId: string;
  text: string;
  time: string;
  sender: 'coach' | 'player';
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AppStore extends AuthState {
  players: Player[];
  messages: Message[];
  activePlayerChat: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;

  // Player actions
  fetchPlayers: () => Promise<void>;
  addPlayer: (player: Omit<Player, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePlayer: (id: string, data: Partial<Pick<Player, 'name' | 'position' | 'status' | 'age'>>) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;

  // Message actions (keeping local for now)
  setActiveChat: (id: string) => void;
  sendMessage: (text: string) => void;
}

// API base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem('token');
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

// Load auth state from localStorage
const loadAuthState = (): AuthState => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    try {
      return {
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...loadAuthState(),
  players: [],
  messages: JSON.parse(localStorage.getItem('messages') || '[]'),
  activePlayerChat: null,

  // Authentication actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Fetch players after login
      await get().fetchPlayers();
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Fetch players after registration
      await get().fetchPlayers();
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      players: [],
      messages: [],
      activePlayerChat: null,
      error: null,
    });
  },

  checkAuth: () => {
    const authState = loadAuthState();
    set(authState);

    if (authState.isAuthenticated) {
      get().fetchPlayers();
    }
  },

  // Player actions
  fetchPlayers: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/players`, {
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 401) {
          get().logout();
          throw new Error('Session expired');
        }
        throw new Error('Failed to fetch players');
      }

      const players = await response.json();
      set({ players });
    } catch (error) {
      console.error('Error fetching players:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch players' });
    }
  },

  addPlayer: async (playerData) => {
    const { token } = get();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(token),
        },
        body: JSON.stringify(playerData),
      });

      if (!response.ok) {
        throw new Error('Failed to add player');
      }

      const newPlayer = await response.json();

      set((state) => ({
        players: [...state.players, newPlayer],
      }));
    } catch (error) {
      console.error('Error adding player:', error);
      throw error;
    }
  },

  updatePlayer: async (id, data) => {
    const { token } = get();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE}/players/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(token),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update player');
      }

      const updatedPlayer = await response.json();

      set((state) => ({
        players: state.players.map((p) =>
          p._id === id ? updatedPlayer : p
        ),
      }));
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  },

  deletePlayer: async (id) => {
    const { token } = get();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE}/players/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      set((state) => ({
        players: state.players.filter((p) => p._id !== id),
      }));
    } catch (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  },

  // Message actions (keeping local storage for now)
  setActiveChat: (id) => set({ activePlayerChat: id }),

  sendMessage: (text) => {
    const { activePlayerChat } = get();
    if (!activePlayerChat || !text.trim()) return;

    const newMessage = {
      id: Date.now(),
      playerId: activePlayerChat,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'coach' as const,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Persist messages to localStorage
    const { messages } = get();
    localStorage.setItem('messages', JSON.stringify(messages));
  },
}));