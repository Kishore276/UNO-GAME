import { create } from 'zustand';
import { Player, GameRoom, GameState, ChatMessage, Tournament, Club, Achievement } from '../types/game';
import { generateRoomId, canJoinRoom, addPlayerToRoom, removePlayerFromRoom } from '../utils/gameLogic';

// Room persistence utilities
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
  leaveRoom: () => void;
  createRoom: (roomData: Partial<GameRoom>) => GameRoom;
  updateRoom: (roomId: string, updates: Partial<GameRoom>) => void;
  findRoom: (roomId: string) => GameRoom | undefined;
  initializeRooms: () => void;
  
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
  setAvailableRooms: (rooms) => {
    set({ availableRooms: rooms });
    saveRoomsToStorage(rooms);
  },
  setShowJoinRoomModal: (show) => set({ showJoinRoomModal: show }),
  setShowChat: (show) => set({ showChat: show }),
  
  // Room management functions
  initializeRooms: () => {
    const { setAvailableRooms } = get();
    
    // Load rooms from localStorage
    const storedRooms = loadRoomsFromStorage();
    
    // Check for room ID in URL
    const urlRoomId = getRoomIdFromUrl();
    
    if (urlRoomId && !storedRooms.find(room => room.id === urlRoomId)) {
      // If room ID is in URL but not in stored rooms, create a placeholder room
      const placeholderRoom: GameRoom = {
        id: urlRoomId,
        name: `Room ${urlRoomId}`,
        isPrivate: false,
        maxPlayers: 10,
        currentPlayers: 0,
        players: [],
        gameInProgress: false,
        host: '',
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
      
      setAvailableRooms([...storedRooms, placeholderRoom]);
    } else {
      setAvailableRooms(storedRooms);
    }
  },
  
  joinRoom: async (roomId: string, password?: string) => {
    const { currentUser, availableRooms, setCurrentRoom, setAvailableRooms } = get();
    
    if (!currentUser) {
      throw new Error('Please create a username first');
    }

    // Find existing room
    let targetRoom = availableRooms.find(room => room.id === roomId);
    
    if (!targetRoom) {
      // Room doesn't exist, create a new one for demo purposes
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
      
      // Add to available rooms
      setAvailableRooms([...availableRooms, targetRoom]);
    } else {
      // Room exists, validate if we can join
      const validation = canJoinRoom(targetRoom, currentUser, password);
      if (!validation.canJoin) {
        throw new Error(validation.error || 'Cannot join room');
      }
      
      // Add user to room using utility function
      targetRoom = addPlayerToRoom(targetRoom, currentUser);
      
      // Update the room in available rooms
      const updatedRooms = availableRooms.map(room => 
        room.id === roomId ? targetRoom : room
      );
      setAvailableRooms(updatedRooms);
    }
    
    setCurrentRoom(targetRoom);
    
    // Update URL to include room ID
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    window.history.replaceState({}, '', url.toString());
    
    return true;
  },
  
  leaveRoom: () => {
    const { currentRoom, currentUser, availableRooms, setCurrentRoom, setAvailableRooms } = get();
    
    if (!currentRoom || !currentUser) return;
    
    // Remove user from room using utility function
    const updatedRoom = removePlayerFromRoom(currentRoom, currentUser.id);
    
    // If room is empty, remove it from available rooms
    if (updatedRoom.currentPlayers === 0) {
      const updatedRooms = availableRooms.filter(room => room.id !== currentRoom.id);
      setAvailableRooms(updatedRooms);
    } else {
      // Update room in available rooms
      const updatedRooms = availableRooms.map(room => 
        room.id === currentRoom.id ? updatedRoom : room
      );
      setAvailableRooms(updatedRooms);
    }
    
    setCurrentRoom(null);
    
    // Remove room ID from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.replaceState({}, '', url.toString());
  },
  
  createRoom: (roomData) => {
    const { currentUser, availableRooms, setAvailableRooms } = get();
    
    if (!currentUser) {
      throw new Error('Please create a username first');
    }
    
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
    
    setAvailableRooms([...availableRooms, newRoom]);
    return newRoom;
  },
  
  updateRoom: (roomId: string, updates: Partial<GameRoom>) => {
    const { availableRooms, setAvailableRooms, currentRoom, setCurrentRoom } = get();
    
    const updatedRooms = availableRooms.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    );
    setAvailableRooms(updatedRooms);
    
    // Update current room if it's the one being updated
    if (currentRoom?.id === roomId) {
      setCurrentRoom({ ...currentRoom, ...updates });
    }
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