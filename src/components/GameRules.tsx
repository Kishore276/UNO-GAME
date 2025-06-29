import React from 'react';
import { motion } from 'framer-motion';
import { X, Target, Users, Zap, Crown, Star, Trophy, Info, Infinity } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

const GameRules: React.FC = () => {
  const { setShowRules } = useGameStore();

  const specialCards = [
    {
      name: 'Skip',
      symbol: '⊘',
      color: 'bg-red-500',
      description: 'Next player loses their turn',
      points: 20
    },
    {
      name: 'Reverse',
      symbol: '⇄',
      color: 'bg-blue-500',
      description: 'Changes direction of play',
      points: 20
    },
    {
      name: 'Draw 2',
      symbol: '+2',
      color: 'bg-green-500',
      description: 'Next player draws 2 cards and loses their turn',
      points: 20
    },
    {
      name: 'Wild',
      symbol: '🌈',
      color: 'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400',
      description: 'Choose any color to continue',
      points: 50
    },
    {
      name: 'Wild Draw 4',
      symbol: '+4',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Choose any color, next player draws 4 cards and loses their turn',
      points: 50
    }
  ];

  const scoringRules = [
    { type: 'Number cards', points: 'Face value', icon: '0-9' },
    { type: 'Action cards', points: '20 points', icon: '⊘' },
    { type: 'Wild cards', points: '50 points', icon: '🌈' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-sm rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20 bg-gradient-to-r from-purple-800/50 to-blue-800/50">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🎯</div>
            <h2 className="text-3xl font-bold text-white">UNO Arena - Game Rules</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowRules(false)}
            className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-8 space-y-8">
            {/* Main Rules Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Classic UNO Rules</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Objective */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-green-500/10 rounded-xl p-6 border border-green-500/20"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Target className="w-8 h-8 text-green-400" />
                      <h4 className="text-2xl font-bold text-white">Objective</h4>
                    </div>
                    <p className="text-lg text-gray-200">Be the first player to get rid of all your cards</p>
                  </motion.div>

                  {/* Setup */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="w-8 h-8 text-blue-400" />
                      <h4 className="text-2xl font-bold text-white">Setup</h4>
                    </div>
                    <p className="text-lg text-gray-200">Each player starts with 7 cards</p>
                  </motion.div>

                  {/* Gameplay */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/20"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Zap className="w-8 h-8 text-purple-400" />
                      <h4 className="text-2xl font-bold text-white">Gameplay</h4>
                    </div>
                    <p className="text-lg text-gray-200">Match cards by color or number/symbol</p>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Scoring */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      <h4 className="text-2xl font-bold text-white">Scoring</h4>
                    </div>
                    <div className="space-y-2 text-gray-200">
                      <p>Number cards = face value</p>
                      <p>Action cards = 20 points</p>
                      <p>Wild cards = 50 points</p>
                    </div>
                  </motion.div>

                  {/* Winning */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/20"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Crown className="w-8 h-8 text-orange-400" />
                      <h4 className="text-2xl font-bold text-white">Winning</h4>
                    </div>
                    <div className="space-y-2 text-gray-200">
                      <p>First player to play all cards wins</p>
                      <p className="text-yellow-400 font-semibold">+500 bonus points</p>
                    </div>
                  </motion.div>

                  {/* Unlimited Players */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-cyan-500/10 rounded-xl p-6 border border-cyan-500/20"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Infinity className="w-8 h-8 text-cyan-400" />
                      <h4 className="text-2xl font-bold text-white">Unlimited Players</h4>
                    </div>
                    <p className="text-lg text-gray-200">No limit on the number of players per game</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Special Cards Section */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center justify-center space-x-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <span>Special Cards</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {specialCards.map((card, index) => (
                  <motion.div
                    key={card.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all duration-300"
                  >
                    <div className={`w-20 h-28 ${card.color} rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4`}>
                      {card.symbol}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{card.name}</h4>
                    <p className="text-sm text-gray-300 mb-3">{card.description}</p>
                    <div className="text-yellow-400 font-bold">{card.points} points</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Detailed Scoring Breakdown */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-yellow-500/20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Scoring System</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {scoringRules.map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center bg-white/10 rounded-xl p-6 border border-white/20"
                  >
                    <div className="text-4xl mb-4">{rule.icon}</div>
                    <div className="text-xl font-bold text-white mb-2">{rule.type}</div>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">{rule.points}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-yellow-500/20 rounded-xl border border-yellow-500/30 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">🏆 Winner Bonus</div>
                <div className="text-xl text-white">First player to empty their hand gets <span className="font-bold text-yellow-400">+500 bonus points</span></div>
              </div>
            </div>

            {/* UNO Call Rule */}
            <div className="bg-red-500/10 rounded-2xl p-8 border border-red-500/20">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-5xl">🎯</div>
                <h3 className="text-3xl font-bold text-white">UNO Call Rule</h3>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-center space-y-4">
                  <p className="text-xl text-gray-200">
                    When you have <span className="text-red-400 font-bold">only ONE card left</span>, 
                    you must click the <span className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold">UNO!</span> button
                  </p>
                  <div className="text-lg text-red-300">
                    <strong>⚠️ Penalty:</strong> Forget to call UNO? Draw 2 penalty cards!
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Features */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Platform Features</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-blue-400">🌟 Game Features</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li>• Real-time multiplayer gameplay</li>
                    <li>• Custom house rules support</li>
                    <li>• Team play modes available</li>
                    <li>• Tournament system</li>
                    <li>• Global leaderboards</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-purple-400">🎮 Social Features</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li>• In-game chat system</li>
                    <li>• Friend lists and clubs</li>
                    <li>• Private room creation</li>
                    <li>• Spectator mode</li>
                    <li>• Achievement system</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-600/30">
              <h4 className="text-xl font-bold text-white mb-4 text-center">Quick Reference</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="text-green-400 font-bold">Starting Cards</div>
                  <div className="text-white">7 per player</div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold">Win Condition</div>
                  <div className="text-white">0 cards left</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">Win Bonus</div>
                  <div className="text-white">+500 points</div>
                </div>
                <div>
                  <div className="text-purple-400 font-bold">Max Players</div>
                  <div className="text-white">Unlimited</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameRules;