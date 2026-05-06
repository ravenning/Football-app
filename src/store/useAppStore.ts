import { create } from 'zustand';
import { io } from 'socket.io-client';

interface Player {
  _id: string;
  name: string;
  position?: string;
  status: 'Available' | 'Injured' | 'Absent';
  age?: number;
  userId: string;
  photoUrl?: string;
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

interface NewPlayerInput {
  name: string;
  position?: string;
  status?: 'Available' | 'Injured' | 'Absent';
  age?: number;
  photoFile?: File | null;
}

interface ScoreUpdate {
  matchId: string;
  homeScore: number;
  awayScore: number;
  description: string;
  timestamp: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetchingPlayers: boolean;
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
  addPlayer: (player: NewPlayerInput) => Promise<Player>;
  updatePlayer: (id: string, data: Partial<Pick<Player, 'name' | 'position' | 'status' | 'age'>>) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  uploadPlayerPhoto: (id: string, file: File) => Promise<Player>;
  sendLiveScoreUpdate: (payload: Omit<ScoreUpdate, 'timestamp'>) => Promise<void>;
  liveScore: ScoreUpdate | null;
  socketConnected: boolean;

  // Message actions (keeping local for now)
  setActiveChat: (id: string) => void;
  sendMessage: (text: string) => void;
}

const BACKEND_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';
const API_BASE = `${BACKEND_BASE}/api`;
const socket = typeof window !== 'undefined' ? io(BACKEND_BASE, { transports: ['websocket'] }) : null;

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
        isFetchingPlayers: false,
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
    isFetchingPlayers: false,
    error: null,
  };
};

export const useAppStore = create<AppStore>((set, get) => {
  if (socket) {
    socket.on('connect', () => set({ socketConnected: true }));
    socket.on('disconnect', () => set({ socketConnected: false }));
    socket.on('playerAdded', (player: Player) => set((state) => {
      if (state.players.some((p) => p._id === player._id)) {
        return state;
      }
      return { players: [...state.players, player] };
    }));
    socket.on('playerUpdated', (player: Player) => set((state) => ({ players: state.players.map((p) => p._id === player._id ? player : p) })));
    socket.on('playerDeleted', (playerId: string) => set((state) => ({ players: state.players.filter((p) => p._id !== playerId) })));
    socket.on('scoreUpdate', (payload: ScoreUpdate) => set({ liveScore: payload }));
  }

  return {
    ...loadAuthState(),
    players: [],
    messages: JSON.parse(localStorage.getItem('messages') || '[]'),
    activePlayerChat: null,
    liveScore: null,
    socketConnected: Boolean(socket?.connected),

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
      isLoading: false,
      isFetchingPlayers: false,
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

    set({ isFetchingPlayers: true, error: null });

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
      set({ players, isFetchingPlayers: false });
    } catch (error) {
      console.error('Error fetching players:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch players',
        isFetchingPlayers: false,
      });
    }
  },

  addPlayer: async (playerData) => {
    const { token } = get();
    if (!token) throw new Error('Not authenticated');

    const { photoFile, ...payload } = playerData as NewPlayerInput;

    try {
      const response = await fetch(`${API_BASE}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(token),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to add player');
      }

      let newPlayer = await response.json();

      if (photoFile) {
        newPlayer = await get().uploadPlayerPhoto(newPlayer._id, photoFile);
      }

      set((state) => ({
        players: [...state.players, newPlayer],
      }));
      return newPlayer;
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

  uploadPlayerPhoto: async (id, file) => {
    const { token } = get();
    if (!token) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${API_BASE}/players/${id}/photo`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload player photo');
    }

    const updatedPlayer = await response.json();
    set((state) => ({
      players: state.players.map((p) => p._id === updatedPlayer._id ? updatedPlayer : p),
    }));
    return updatedPlayer;
  },

  sendLiveScoreUpdate: async (payload) => {
    const { token } = get();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/live-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(token),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to send score update');
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
      sender: 'coach',
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Persist messages to localStorage
    const { messages } = get();
    localStorage.setItem('messages', JSON.stringify(messages));
  },
}));