import { create } from 'zustand';
import { Player, GameRoom, GameState, ChatMessage, Tournament, Club, Achievement } from '../types/game';
import { generateRoomId, canJoinRoom } from '../utils/gameLogic';
import { roomServerAPI } from '../utils/roomServer';

// Room persistence utilities (keep for fallback)
const ROOM_STORAGE_KEY = 'uno-arena-rooms';

const saveRoomsToStorage = (rooms: GameRoom[]) => {
  try {
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms));
  } catch (error) {
    console.warn('Failed to save rooms to localStorage:', error);
  }
};

const loadRoomsFromStorage = (): GameRoom[] => {
  try {
    const stored = localStorage.getItem(ROOM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load rooms from localStorage:', error);
    return [];
  }
};

const getRoomIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('room');
};

interface GameStore {
  // User state
  currentUser: Player | null;
  showUsernameModal: boolean;
  setCurrentUser: (user: Player) => void;
  setShowUsernameModal: (show: boolean) => void;
  
  // Room state
  currentRoom: GameRoom | null;
  availableRooms: GameRoom[];
  showJoinRoomModal: boolean;
  showChat: boolean;
  setCurrentRoom: (room: GameRoom | null) => void;
  setAvailableRooms: (rooms: GameRoom[]) => void;
  setShowJoinRoomModal: (show: boolean) => void;
  setShowChat: (show: boolean) => void;
  
  // Room management functions
  joinRoom: (roomId: string, password?: string) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  createRoom: (roomData: Partial<GameRoom>) => Promise<GameRoom>;
  updateRoom: (roomId: string, updates: Partial<GameRoom>) => Promise<void>;
  findRoom: (roomId: string) => GameRoom | undefined;
  initializeRooms: () => Promise<void>;
  refreshRooms: () => Promise<void>;
  
  // Game state
  gameState: GameState | null;
  setGameState: (state: GameState) => void;
  
  // Chat state
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  
  // UI state
  selectedCards: string[];
  showRules: boolean;
  showLeaderboard: boolean;
  showProfile: boolean;
  showFriends: boolean;
  showTournaments: boolean;
  showClubs: boolean;
  showShop: boolean;
  showDemo: boolean;
  toggleSelectedCard: (cardId: string) => void;
  setShowRules: (show: boolean) => void;
  setShowLeaderboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  setShowFriends: (show: boolean) => void;
  setShowTournaments: (show: boolean) => void;
  setShowClubs: (show: boolean) => void;
  setShowShop: (show: boolean) => void;
  setShowDemo: (show: boolean) => void;
  
  // Social features
  friends: Player[];
  tournaments: Tournament[];
  clubs: Club[];
  achievements: Achievement[];
  leaderboard: Player[];
  setFriends: (friends: Player[]) => void;
  setTournaments: (tournaments: Tournament[]) => void;
  setClubs: (clubs: Club[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setLeaderboard: (leaderboard: Player[]) => void;
  
  // Game actions
  playCard: (cardId: string) => void;
  drawCard: () => void;
  sayUno: () => void;
  challengePlayer: (playerId: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // User state
  currentUser: null,
  showUsernameModal: true,
  setCurrentUser: (user) => set({ currentUser: user }),
  setShowUsernameModal: (show) => set({ showUsernameModal: show }),
  
  // Room state
  currentRoom: null,
  availableRooms: [],
  showJoinRoomModal: false,
  showChat: true,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setAvailableRooms: (rooms) => set({ availableRooms: rooms }),
  setShowJoinRoomModal: (show) => set({ showJoinRoomModal: show }),
  setShowChat: (show) => set({ showChat: show }),
  
  // Room management functions
  initializeRooms: async () => {
    const { setAvailableRooms } = get();
    // Subscribe to all rooms for real-time updates
    roomServerAPI.subscribeToAllRooms((rooms) => {
      setAvailableRooms(rooms);
    });
    // Optionally, join room from URL if present
    const urlRoomId = getRoomIdFromUrl();
    if (urlRoomId) {
      await get().joinRoom(urlRoomId);
    }
  },
  
  refreshRooms: async () => {
    const { setAvailableRooms } = get();
    const rooms = await roomServerAPI.getAllRooms();
    setAvailableRooms(rooms);
  },
  
  joinRoom: async (roomId: string, password?: string) => {
    const { currentUser, setCurrentRoom } = get();
    if (!currentUser) throw new Error('Please create a username first');
    let targetRoom = await roomServerAPI.getRoom(roomId);
    if (!targetRoom) {
      // Create new room if not exists
      targetRoom = {
        id: roomId,
        name: `Room ${roomId}`,
        isPrivate: password ? true : false,
        password: password || undefined,
        maxPlayers: 10,
        currentPlayers: 1,
        players: [currentUser],
        gameInProgress: false,
        host: currentUser.id,
        gameMode: {
          name: 'Classic',
          description: 'Standard UNO rules',
          rules: ['Standard UNO rules apply'],
          isTeamMode: false,
          maxPlayers: 10
        },
        houseRules: {
          stackDrawCards: true,
          jumpIn: false,
          sevenSwap: false,
          zeroRotate: false,
          noBluffing: false,
          challengeWild4: true
        }
      };
      await roomServerAPI.createRoom(targetRoom);
    } else {
      // Validate join
      const validation = canJoinRoom(targetRoom, currentUser, password);
      if (!validation.canJoin) throw new Error(validation.error || 'Cannot join room');
      // Add player to room
      await roomServerAPI.addPlayerToRoom(roomId, currentUser);
    }
    // Subscribe to room updates
    if (get().currentRoom?._unsubscribe) get().currentRoom._unsubscribe();
    const unsubscribe = roomServerAPI.subscribeToRoom(roomId, (updatedRoom) => {
      set({ currentRoom: { ...updatedRoom, _unsubscribe: unsubscribe } });
    });
    // Set current room
    setCurrentRoom({ ...(await roomServerAPI.getRoom(roomId)), _unsubscribe: unsubscribe });
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    window.history.replaceState({}, '', url.toString());
    return true;
  },
  
  leaveRoom: async () => {
    const { currentRoom, currentUser, setCurrentRoom } = get();
    if (!currentRoom || !currentUser) return;
    await roomServerAPI.removePlayerFromRoom(currentRoom.id, currentUser.id);
    if (currentRoom._unsubscribe) currentRoom._unsubscribe();
    setCurrentRoom(null);
    // Remove room ID from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.replaceState({}, '', url.toString());
  },
  
  createRoom: async (roomData) => {
    const { currentUser } = get();
    if (!currentUser) throw new Error('Please create a username first');
    const newRoom: GameRoom = {
      id: roomData.id || generateRoomId(),
      name: roomData.name || 'New Room',
      isPrivate: roomData.isPrivate || false,
      password: roomData.password,
      maxPlayers: roomData.maxPlayers || 10,
      currentPlayers: 1,
      players: [currentUser],
      gameInProgress: false,
      host: currentUser.id,
      gameMode: roomData.gameMode || {
        name: 'Classic',
        description: 'Standard UNO rules',
        rules: ['Standard UNO rules apply'],
        isTeamMode: false,
        maxPlayers: roomData.maxPlayers || 10
      },
      houseRules: roomData.houseRules || {
        stackDrawCards: true,
        jumpIn: false,
        sevenSwap: false,
        zeroRotate: false,
        noBluffing: false,
        challengeWild4: true
      }
    };
    await roomServerAPI.createRoom(newRoom);
    return newRoom;
  },
  
  updateRoom: async (roomId: string, updates: Partial<GameRoom>) => {
    await roomServerAPI.updateRoom(roomId, updates);
  },
  
  findRoom: (roomId: string) => {
    const { availableRooms } = get();
    return availableRooms.find(room => room.id === roomId);
  },
  
  // Game state
  gameState: null,
  setGameState: (state) => set({ gameState: state }),
  
  // Chat state
  chatMessages: [],
  addChatMessage: (message) => 
    set((state) => ({ 
      chatMessages: [...state.chatMessages, message].slice(-100) // Keep last 100 messages
    })),
  clearChat: () => set({ chatMessages: [] }),
  
  // UI state
  selectedCards: [],
  showRules: false,
  showLeaderboard: false,
  showProfile: false,
  showFriends: false,
  showTournaments: false,
  showClubs: false,
  showShop: false,
  showDemo: false,
  toggleSelectedCard: (cardId) => 
    set((state) => ({
      selectedCards: state.selectedCards.includes(cardId)
        ? state.selectedCards.filter(id => id !== cardId)
        : [...state.selectedCards, cardId]
    })),
  setShowRules: (show) => set({ showRules: show }),
  setShowLeaderboard: (show) => set({ showLeaderboard: show }),
  setShowProfile: (show) => set({ showProfile: show }),
  setShowFriends: (show) => set({ showFriends: show }),
  setShowTournaments: (show) => set({ showTournaments: show }),
  setShowClubs: (show) => set({ showClubs: show }),
  setShowShop: (show) => set({ showShop: show }),
  setShowDemo: (show) => set({ showDemo: show }),
  
  // Social features
  friends: [],
  tournaments: [],
  clubs: [],
  achievements: [],
  leaderboard: [],
  setFriends: (friends) => set({ friends }),
  setTournaments: (tournaments) => set({ tournaments }),
  setClubs: (clubs) => set({ clubs }),
  setAchievements: (achievements) => set({ achievements }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  
  // Game actions
  playCard: (cardId) => {
    // This would normally send to server
    console.log('Playing card:', cardId);
  },
  drawCard: () => {
    // This would normally send to server
    console.log('Drawing card');
  },
  sayUno: () => {
    // This would normally send to server
    console.log('Saying UNO!');
  },
  challengePlayer: (playerId) => {
    // This would normally send to server
    console.log('Challenging player:', playerId);
  },
}));