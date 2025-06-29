import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Lock, Users, X } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import toast from 'react-hot-toast';

const JoinRoomModal: React.FC = () => {
  const { setShowJoinRoomModal, joinRoom, findRoom } = useGameStore();
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }

    setIsLoading(true);

    try {
      // Check if room exists first
      const existingRoom = findRoom(roomId);
      
      if (existingRoom) {
        // Room exists, show preview
        if (existingRoom.isPrivate && !password) {
          toast.error('This room requires a password');
          setIsLoading(false);
          return;
        }
      }

      // Join the room using the store function
      await joinRoom(roomId, password);
      
      setShowJoinRoomModal(false);
      setRoomId('');
      setPassword('');
      toast.success(`Joined room ${roomId}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && roomId.trim()) {
      handleJoinRoom();
    }
  };

  // Get room preview
  const roomPreview = findRoom(roomId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full max-w-md border border-white/20"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Join Room</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowJoinRoomModal(false)}
            className="p-2 hover:bg-white/10 rounded-lg text-white"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-4">
          {/* Room ID Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Room ID</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter room ID (e.g., ABC123)"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                maxLength={10}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Ask the host for the room ID to join
            </div>
          </div>

          {/* Password Input (conditional) */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password (if private room)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter password (optional)"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Room Info Preview */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Room Info</span>
            </div>
            <div className="text-sm text-gray-300">
              {roomId ? (
                roomPreview ? (
                  <>
                    <div className="space-y-2">
                      <div>Room: <span className="text-white font-semibold">{roomPreview.name}</span></div>
                      <div>Players: <span className="text-white">{roomPreview.currentPlayers}/{roomPreview.maxPlayers}</span></div>
                      <div>Mode: <span className="text-white">{roomPreview.gameMode.name}</span></div>
                      {roomPreview.isPrivate && (
                        <div className="text-yellow-400">🔒 Private Room</div>
                      )}
                      {roomPreview.gameInProgress && (
                        <div className="text-green-400">🎮 Game in Progress</div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>Room ID: <span className="font-mono text-white">{roomId}</span></div>
                    <div className="text-xs text-gray-400 mt-1">
                      Room not found. A new room will be created.
                    </div>
                  </>
                )
              ) : (
                <div className="text-gray-400">Enter a room ID to see details</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJoinRoomModal(false)}
            className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinRoom}
            disabled={!roomId.trim() || isLoading}
            className={`
              flex-1 py-3 rounded-lg font-semibold text-white
              ${roomId.trim() && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Joining...</span>
              </div>
            ) : (
              roomPreview ? 'Join Room' : 'Create & Join'
            )}
          </motion.button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-4 text-xs text-gray-400">
          Don't have a room ID? Create your own room or browse public rooms
        </div>
      </motion.div>
    </div>
  );
};

export default JoinRoomModal;