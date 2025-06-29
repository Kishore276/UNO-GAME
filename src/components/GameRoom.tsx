import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Users, MessageCircle, Play, Crown, Shield, Copy, Hash } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import GameBoard from './GameBoard';
import ChatPanel from './ChatPanel';
import { generateMockPlayers } from '../utils/gameLogic';
import toast from 'react-hot-toast';

const GameRoom: React.FC = () => {
  const {
    currentRoom,
    setCurrentRoom,
    currentUser,
    gameState,
    setGameState,
    showChat,
    setShowChat
  } = useGameStore();

  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (currentRoom && !gameStarted) {
      // Add current user to room if not already present
      if (!currentRoom.players.find(p => p.id === currentUser?.id)) {
        const updatedRoom = {
          ...currentRoom,
          players: [...currentRoom.players, currentUser!],
          currentPlayers: currentRoom.currentPlayers + 1
        };
        setCurrentRoom(updatedRoom);
      }
    }
  }, [currentRoom, currentUser, setCurrentRoom, gameStarted]);

  const handleStartGame = () => {
    if (!currentRoom || !currentUser) return;
    
    // Create initial game state
    const mockGameState = {
      currentPlayer: currentRoom.players[0].id,
      direction: 1 as const,
      lastCard: {
        id: 'start-card',
        color: 'red' as const,
        type: 'number' as const,
        value: 5,
        symbol: '5'
      },
      drawPile: [],
      discardPile: [],
      players: currentRoom.players.map(player => ({
        ...player,
        cards: generateMockPlayers(1)[0].cards // Generate random cards for demo
      })),
      gameStarted: true,
      gameEnded: false,
      currentColor: undefined
    };

    setGameState(mockGameState);
    setGameStarted(true);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setGameState(null);
    setGameStarted(false);
  };

  const copyRoomId = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.id);
      toast.success('Room ID copied to clipboard!');
    }
  };

  const shareRoom = () => {
    if (currentRoom) {
      const shareText = `Join my UNO game! Room ID: ${currentRoom.id}${currentRoom.isPrivate && currentRoom.password ? ` | Password: ${currentRoom.password}` : ''}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Join UNO Arena Game',
          text: shareText,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(shareText);
        toast.success('Room details copied to clipboard!');
      }
    }
  };

  const copyRoomLink = () => {
    if (currentRoom) {
      const roomLink = `${window.location.origin}${window.location.pathname}?room=${currentRoom.id}`;
      navigator.clipboard.writeText(roomLink);
      toast.success('Room link copied to clipboard!');
    }
  };

  if (!currentRoom) {
    return null;
  }

  if (gameStarted && gameState) {
    return <GameBoard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLeaveRoom}
            className="flex items-center space-x-2 text-white hover:text-yellow-400"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Leave Room</span>
          </motion.button>
          
          <div className="text-2xl font-bold text-white">{currentRoom.name}</div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-blue-500/20 rounded-full px-3 py-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400">{currentRoom.currentPlayers}/{currentRoom.maxPlayers}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyRoomId}
              className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 text-white px-3 py-1 rounded-full text-sm"
              title="Copy Room ID"
            >
              <Hash className="w-3 h-3" />
              <span className="font-mono">{currentRoom.id}</span>
              <Copy className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyRoomLink}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Copy Link
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareRoom}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Share Room
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg ${showChat ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className={`flex-1 p-6 ${showChat ? 'mr-80' : ''}`}>
          {/* Room Info Banner */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 mb-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🎯</div>
                <div>
                  <h2 className="text-xl font-bold text-white">Room: {currentRoom.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span>ID: <span className="font-mono text-blue-400">{currentRoom.id}</span></span>
                    <span>•</span>
                    <span>{currentRoom.gameMode.name} Mode</span>
                    {currentRoom.isPrivate && (
                      <>
                        <span>•</span>
                        <span className="text-yellow-400">Private Room</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{currentRoom.currentPlayers}/{currentRoom.maxPlayers}</div>
                <div className="text-sm text-gray-400">Players</div>
              </div>
            </div>
          </div>

          {/* Game Mode Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-3">{currentRoom.gameMode.name}</h2>
            <p className="text-gray-300 mb-4">{currentRoom.gameMode.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-semibold mb-2">House Rules</h3>
                <div className="space-y-1">
                  {Object.entries(currentRoom.houseRules).map(([rule, enabled]) => (
                    <div key={rule} className={`text-sm ${enabled ? 'text-green-400' : 'text-gray-500'}`}>
                      {enabled ? '✓' : '✗'} {rule.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Game Rules</h3>
                <div className="space-y-1">
                  {currentRoom.gameMode.rules.map((rule, index) => (
                    <div key={index} className="text-sm text-gray-300">• {rule}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Players ({currentRoom.currentPlayers}/{currentRoom.maxPlayers})</h2>
              
              {currentUser?.id === currentRoom.host && currentRoom.currentPlayers >= 2 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartGame}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Game</span>
                </motion.button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentRoom.players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{player.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">{player.name}</span>
                        {player.id === currentRoom.host && <Crown className="w-4 h-4 text-yellow-400" />}
                        {player.isPremium && <Shield className="w-4 h-4 text-purple-400" />}
                        {player.id === currentUser?.id && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">You</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">Level {player.level}</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${player.isReady ? 'bg-green-400' : 'bg-red-400'}`} />
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-400">
                    {player.wins} wins • {player.gamesPlayed} games
                  </div>
                </motion.div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: currentRoom.maxPlayers - currentRoom.currentPlayers }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="bg-white/5 rounded-lg p-4 border border-dashed border-white/20 flex items-center justify-center"
                >
                  <span className="text-gray-500 text-sm">Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Waiting Message */}
          {currentUser?.id !== currentRoom.host && (
            <div className="mt-6 text-center">
              <div className="text-white text-lg">Waiting for host to start the game...</div>
              <div className="text-gray-400 text-sm mt-2">Need at least 2 players to start</div>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && <ChatPanel />}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full max-w-md border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Room Settings</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="text-blue-400 font-medium mb-2">Room Information</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Room ID:</span>
                    <span className="text-white font-mono">{currentRoom.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Host:</span>
                    <span className="text-white">{currentRoom.players.find(p => p.id === currentRoom.host)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Privacy:</span>
                    <span className="text-white">{currentRoom.isPrivate ? 'Private' : 'Public'}</span>
                  </div>
                </div>
              </div>
              
              {currentUser?.id === currentRoom.host ? (
                <div className="text-white">
                  <div className="text-sm text-gray-300 mb-3">
                    As the host, you can modify room settings and start the game.
                  </div>
                  <div className="space-y-2">
                    <button className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                      Change House Rules
                    </button>
                    <button className="w-full p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                      Kick Player
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  Only the host can modify room settings.
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(false)}
                className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GameRoom;