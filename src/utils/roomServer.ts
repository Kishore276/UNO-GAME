// Simple mock room server for demo purposes
// In a real app, this would be a proper backend server

interface RoomServer {
  rooms: Map<string, any>;
  subscribers: Map<string, Set<(room: any) => void>>;
}

// Global room server instance (simulates a shared backend)
const roomServer: RoomServer = {
  rooms: new Map(),
  subscribers: new Map()
};

// Simulate network delay
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

export const roomServerAPI = {
  // Create or get room
  async getRoom(roomId: string): Promise<any | null> {
    await simulateNetworkDelay();
    return roomServer.rooms.get(roomId) || null;
  },

  // Create room
  async createRoom(roomData: any): Promise<any> {
    await simulateNetworkDelay();
    const room = { ...roomData, id: roomData.id, createdAt: Date.now() };
    roomServer.rooms.set(room.id, room);
    
    // Notify subscribers
    const subscribers = roomServer.subscribers.get(room.id);
    if (subscribers) {
      subscribers.forEach(callback => callback(room));
    }
    
    return room;
  },

  // Update room
  async updateRoom(roomId: string, updates: any): Promise<any> {
    await simulateNetworkDelay();
    const existingRoom = roomServer.rooms.get(roomId);
    if (!existingRoom) {
      throw new Error('Room not found');
    }
    
    const updatedRoom = { ...existingRoom, ...updates };
    roomServer.rooms.set(roomId, updatedRoom);
    
    // Notify subscribers
    const subscribers = roomServer.subscribers.get(roomId);
    if (subscribers) {
      subscribers.forEach(callback => callback(updatedRoom));
    }
    
    return updatedRoom;
  },

  // Delete room
  async deleteRoom(roomId: string): Promise<void> {
    await simulateNetworkDelay();
    roomServer.rooms.delete(roomId);
    roomServer.subscribers.delete(roomId);
  },

  // Subscribe to room updates
  subscribeToRoom(roomId: string, callback: (room: any) => void): () => void {
    if (!roomServer.subscribers.has(roomId)) {
      roomServer.subscribers.set(roomId, new Set());
    }
    
    const subscribers = roomServer.subscribers.get(roomId)!;
    subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        roomServer.subscribers.delete(roomId);
      }
    };
  },

  // Get all rooms (for lobby)
  async getAllRooms(): Promise<any[]> {
    await simulateNetworkDelay();
    return Array.from(roomServer.rooms.values());
  },

  // Add player to room
  async addPlayerToRoom(roomId: string, player: any): Promise<any> {
    const room = await this.getRoom(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    
    // Check if player already exists
    const existingPlayerIndex = room.players.findIndex((p: any) => p.id === player.id);
    if (existingPlayerIndex >= 0) {
      // Update existing player
      room.players[existingPlayerIndex] = player;
    } else {
      // Add new player
      room.players.push(player);
      room.currentPlayers = room.players.length;
    }
    
    return this.updateRoom(roomId, room);
  },

  // Remove player from room
  async removePlayerFromRoom(roomId: string, playerId: string): Promise<any> {
    const room = await this.getRoom(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    
    room.players = room.players.filter((p: any) => p.id !== playerId);
    room.currentPlayers = room.players.length;
    
    return this.updateRoom(roomId, room);
  }
};

// Initialize with some demo rooms
const initializeDemoRooms = () => {
  const demoRooms = [
    {
      id: 'QUICK01',
      name: 'Quick Match',
      isPrivate: false,
      maxPlayers: 8,
      currentPlayers: 5,
      players: [],
      gameInProgress: false,
      host: 'player-0',
      gameMode: {
        name: 'Classic',
        description: 'Standard UNO rules',
        rules: ['Standard UNO rules apply'],
        isTeamMode: false,
        maxPlayers: 8
      },
      houseRules: {
        stackDrawCards: true,
        jumpIn: false,
        sevenSwap: false,
        zeroRotate: false,
        noBluffing: false,
        challengeWild4: true
      }
    },
    {
      id: 'TOURN2',
      name: 'Tournament Practice',
      isPrivate: false,
      maxPlayers: 12,
      currentPlayers: 8,
      players: [],
      gameInProgress: true,
      host: 'player-0',
      gameMode: {
        name: 'Tournament',
        description: 'Competitive rules with no house rules',
        rules: ['No house rules', 'Strict timing', 'Challenge system enabled'],
        isTeamMode: false,
        maxPlayers: 12
      },
      houseRules: {
        stackDrawCards: false,
        jumpIn: false,
        sevenSwap: false,
        zeroRotate: false,
        noBluffing: true,
        challengeWild4: true
      }
    }
  ];

  demoRooms.forEach(room => {
    roomServer.rooms.set(room.id, room);
  });
};

// Initialize demo rooms when the module loads
initializeDemoRooms(); 