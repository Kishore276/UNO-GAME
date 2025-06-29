import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Lock, Users, Play, Settings, Trophy, Star, Crown, Hash, LogIn, BookOpen, Video } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { GameRoom, Player } from '../types/game';
import { generateMockPlayers } from '../utils/gameLogic';
import toast from 'react-hot-toast';

const GameLobby: React.FC = () => {
  const {
    availableRooms,
    setAvailableRooms,
    setCurrentRoom,
    currentUser,
    setShowTournaments,
    setShowLeaderboard,
    setShowProfile,
    setShowJoinRoomModal,
    setShowRules,
    setShowDemo,
    joinRoom,
    createRoom
  } = useGameStore();

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Generate mock rooms with room IDs
    const mockRooms: GameRoom[] = [
      {
        id: 'QUICK01',
        name: 'Quick Match',
        isPrivate: false,
        maxPlayers: 8,
        currentPlayers: 5,
        players: generateMockPlayers(5),
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
        players: generateMockPlayers(8),
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
      },
      {
        id: 'TEAM99',
        name: 'Team Chaos',
        isPrivate: false,
        maxPlayers: 16,
        currentPlayers: 12,
        players: generateMockPlayers(12),
        gameInProgress: false,
        host: 'player-0',
        gameMode: {
          name: 'Team Play',
          description: '2v2v2v2 team battles',
          rules: ['Team coordination allowed', 'All house rules enabled'],
          isTeamMode: true,
          maxPlayers: 16
        },
        houseRules: {
          stackDrawCards: true,
          jumpIn: true,
          sevenSwap: true,
          zeroRotate: true,
          noBluffing: false,
          challengeWild4: true
        }
      },
      {
        id: 'VIP777',
        name: 'VIP Lounge',
        isPrivate: true,
        password: 'premium',
        maxPlayers: 6,
        currentPlayers: 3,
        players: generateMockPlayers(3),
        gameInProgress: false,
        host: 'player-0',
        gameMode: {
          name: 'Premium',
          description: 'Exclusive game mode for premium players',
          rules: ['Premium players only', 'Special rewards'],
          isTeamMode: false,
          maxPlayers: 6
        },
        houseRules: {
          stackDrawCards: true,
          jumpIn: true,
          sevenSwap: false,
          zeroRotate: false,
          noBluffing: false,
          challengeWild4: true
        }
      }
    ];

    setAvailableRooms(mockRooms);
  }, [setAvailableRooms]);

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    try {
      const newRoom = createRoom({
        name: roomName,
        isPrivate,
        password: isPrivate ? password : undefined,
        maxPlayers
      });

      setCurrentRoom(newRoom);
      setShowCreateRoom(false);
      setRoomName('');
      setPassword('');
      toast.success(`Room created! ID: ${newRoom.id}`, {
        duration: 5000,
        icon: '🎉'
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create room');
    }
  };

  const handleJoinRoom = async (room: GameRoom) => {
    if (!currentUser) {
      toast.error('Please create a username first');
      return;
    }

    if (room.isPrivate) {
      toast.error('This is a private room. Use "Join with ID" to enter.');
      return;
    }
    
    try {
      await joinRoom(room.id);
      toast.success(`Joined ${room.name}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to join room');
    }
  };

  const copyRoomId = (roomId: string) => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            UNO ARENA
          </div>
          <div className="flex items-center space-x-2 bg-yellow-500/20 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{currentUser?.coins?.toLocaleString() || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDemo(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <Video className="w-5 h-5" />
            <span>Watch Demo</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRules(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <BookOpen className="w-5 h-5" />
            <span>Rules</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTournaments(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <Trophy className="w-5 h-5" />
            <span>Tournaments</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <Crown className="w-5 h-5" />
            <span>Leaderboard</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfile(true)}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            <span className="text-2xl">{currentUser?.avatar}</span>
            <div className="text-left">
              <div className="font-semibold">{currentUser?.name}</div>
              <div className="text-sm text-gray-300">Level {currentUser?.level}</div>
            </div>
          </motion.button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Game Rooms</h1>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowJoinRoomModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <Hash className="w-5 h-5" />
              <span>Join with ID</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateRoom(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Create Room</span>
            </motion.button>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>{room.name}</span>
                    {room.isPrivate && <Lock className="w-4 h-4 text-yellow-400" />}
                  </h3>
                  <p className="text-gray-300 text-sm">{room.gameMode.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => copyRoomId(room.id)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded font-mono"
                      title="Click to copy room ID"
                    >
                      ID: {room.id}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white">{room.currentPlayers}/{room.maxPlayers}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(room.houseRules).filter(([_, enabled]) => enabled).map(([rule]) => (
                    <span key={rule} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                      {rule.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  ))}
                </div>
                
                {room.gameInProgress && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Game in Progress</span>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleJoinRoom(room)}
                disabled={room.currentPlayers >= room.maxPlayers || room.isPrivate}
                className={`w-full py-2 px-4 rounded-lg font-semibold ${
                  room.currentPlayers >= room.maxPlayers
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : room.isPrivate
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : room.gameInProgress
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {room.currentPlayers >= room.maxPlayers 
                  ? 'Room Full' 
                  : room.isPrivate
                  ? 'Private Room'
                  : room.gameInProgress 
                  ? 'Spectate' 
                  : 'Join Game'
                }
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Create Room Modal */}
        {showCreateRoom && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full max-w-md border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Room</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Room Name</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Max Players</label>
                  <select
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={4}>4 Players</option>
                    <option value={6}>6 Players</option>
                    <option value={8}>8 Players</option>
                    <option value={10}>10 Players</option>
                    <option value={12}>12 Players</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPrivate" className="text-white text-sm">Private Room</label>
                </div>
                
                {isPrivate && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateRoom}
                  disabled={!roomName.trim()}
                  className={`flex-1 py-3 rounded-lg font-semibold text-white ${
                    roomName.trim()
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  Create Room
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLobby;