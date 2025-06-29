// Simple mock room server for demo purposes
// In a real app, this would be a proper backend server

import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  addDoc,
  deleteDoc,
  query,
  where,
  runTransaction,
  Unsubscribe
} from 'firebase/firestore';

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

const ROOMS_COLLECTION = 'rooms';

export const roomServerAPI = {
  // Create a new room (only if it doesn't exist)
  async createRoom(roomData: any) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomData.id);
    await setDoc(roomRef, roomData, { merge: false });
    return { ...roomData };
  },

  // Get a room by ID
  async getRoom(roomId: string) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    const snap = await getDoc(roomRef);
    return snap.exists() ? snap.data() : null;
  },

  // Get all rooms
  async getAllRooms() {
    const roomsCol = collection(db, ROOMS_COLLECTION);
    const snap = await getDocs(roomsCol);
    return snap.docs.map(doc => doc.data());
  },

  // Update a room
  async updateRoom(roomId: string, updates: any) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    await updateDoc(roomRef, updates);
    const snap = await getDoc(roomRef);
    return snap.data();
  },

  // Delete a room
  async deleteRoom(roomId: string) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    await deleteDoc(roomRef);
  },

  // ATOMIC: Add player to room or create room if not exists
  async joinOrCreateRoom(roomId: string, player: any, roomDataIfCreate: any) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    return await runTransaction(db, async (transaction) => {
      const roomSnap = await transaction.get(roomRef);
      if (!roomSnap.exists()) {
        // Create the room with this player as the first player
        transaction.set(roomRef, {
          ...roomDataIfCreate,
          id: roomId,
          players: [player],
          currentPlayers: 1
        });
        return { ...roomDataIfCreate, id: roomId, players: [player], currentPlayers: 1 };
      } else {
        // Room exists, add player if not already present
        const room = roomSnap.data();
        const players = room.players || [];
        const alreadyInRoom = players.some((p: any) => p.id === player.id);
        if (!alreadyInRoom) {
          players.push(player);
        }
        transaction.update(roomRef, {
          players,
          currentPlayers: players.length
        });
        return { ...room, players, currentPlayers: players.length };
      }
    });
  },

  // Remove player from room
  async removePlayerFromRoom(roomId: string, playerId: string) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    return await runTransaction(db, async (transaction) => {
      const roomSnap = await transaction.get(roomRef);
      if (!roomSnap.exists()) return;
      const room = roomSnap.data();
      const players = (room.players || []).filter((p: any) => p.id !== playerId);
      transaction.update(roomRef, {
        players,
        currentPlayers: players.length
      });
      return { ...room, players, currentPlayers: players.length };
    });
  },

  // Subscribe to room updates (real-time)
  subscribeToRoom(roomId: string, callback: (room: any) => void): Unsubscribe {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    return onSnapshot(roomRef, (snap) => {
      if (snap.exists()) callback(snap.data());
    });
  },

  // Subscribe to all rooms (for lobby)
  subscribeToAllRooms(callback: (rooms: any[]) => void): Unsubscribe {
    const roomsCol = collection(db, ROOMS_COLLECTION);
    return onSnapshot(roomsCol, (snap) => {
      callback(snap.docs.map(doc => doc.data()));
    });
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