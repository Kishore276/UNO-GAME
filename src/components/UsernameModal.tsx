import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Dice6, Sparkles } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { Player } from '../types/game';

const UsernameModal: React.FC = () => {
  const { setCurrentUser, setShowUsernameModal } = useGameStore();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎯');
  const [isLoading, setIsLoading] = useState(false);

  const avatars = [
    '🎯', '🎮', '🎪', '🎨', '🎭', '🎸', '🎺', '🎲', '🎳', '🎊', 
    '🎉', '🎈', '🎁', '🎀', '🎂', '🚀', '⭐', '🌟', '💎', '🔥',
    '⚡', '🌈', '🦄', '🐉', '🦋', '🌺', '🍀', '🎄', '❄️', '☀️'
  ];

  const generateRandomUsername = () => {
    const adjectives = [
      'Swift', 'Clever', 'Bold', 'Mighty', 'Cosmic', 'Electric', 'Golden', 'Shadow',
      'Crystal', 'Thunder', 'Blazing', 'Mystic', 'Stellar', 'Phantom', 'Radiant'
    ];
    const nouns = [
      'Player', 'Gamer', 'Master', 'Champion', 'Warrior', 'Legend', 'Hero', 'Ace',
      'Pro', 'Star', 'Knight', 'Wizard', 'Hunter', 'Guardian', 'Phoenix'
    ];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    
    setUsername(`${randomAdjective}${randomNoun}${randomNumber}`);
  };

  const handleCreateUser = async () => {
    if (!username.trim() || username.length < 3) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: Player = {
      id: `user-${Date.now()}`,
      name: username.trim(),
      avatar: selectedAvatar,
      cards: [],
      isReady: false,
      isHost: false,
      coins: 1000, // Starting coins
      level: 1,
      wins: 0,
      gamesPlayed: 0,
      isPremium: false,
      theme: 'default'
    };

    setCurrentUser(newUser);
    setShowUsernameModal(false);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && username.trim().length >= 3) {
      handleCreateUser();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to UNO Arena!</h2>
          <p className="text-gray-300">Create your player profile to get started</p>
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Choose Your Avatar</label>
          <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto bg-white/5 rounded-lg p-3">
            {avatars.map((avatar) => (
              <motion.button
                key={avatar}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAvatar(avatar)}
                className={`
                  text-2xl p-2 rounded-lg transition-all
                  ${selectedAvatar === avatar 
                    ? 'bg-blue-600 ring-2 ring-blue-400' 
                    : 'bg-white/10 hover:bg-white/20'
                  }
                `}
              >
                {avatar}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Username Input */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
              minLength={3}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">
              {username.length}/20 characters (min 3)
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRandomUsername}
              className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300"
            >
              <Dice6 className="w-3 h-3" />
              <span>Random</span>
            </motion.button>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400 mb-2">Preview:</div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{selectedAvatar}</div>
            <div>
              <div className="text-white font-semibold">{username || 'Your Username'}</div>
              <div className="text-xs text-gray-400">Level 1 • 1,000 coins</div>
            </div>
            <div className="ml-auto">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateUser}
          disabled={username.trim().length < 3 || isLoading}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-white transition-all
            ${username.trim().length >= 3 && !isLoading
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Profile...</span>
            </div>
          ) : (
            'Start Playing!'
          )}
        </motion.button>

        <div className="text-center mt-4 text-xs text-gray-400">
          Your username will be visible to other players
        </div>
      </motion.div>
    </div>
  );
};

export default UsernameModal;