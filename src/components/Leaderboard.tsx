import React from 'react';
import { motion } from 'framer-motion';
import { X, Crown, Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

const Leaderboard: React.FC = () => {
  const { setShowLeaderboard, leaderboard, setLeaderboard } = useGameStore();

  React.useEffect(() => {
    // Mock leaderboard data
    const mockLeaderboard = [
      {
        id: 'leader-1',
        name: 'ProPlayer99',
        avatar: '👑',
        coins: 50000,
        level: 85,
        wins: 1250,
        gamesPlayed: 1800,
        isPremium: true,
        theme: 'gold',
        cards: [],
        isReady: false,
        isHost: false
      },
      {
        id: 'leader-2',
        name: 'UnoMaster',
        avatar: '🎯',
        coins: 45000,
        level: 78,
        wins: 1100,
        gamesPlayed: 1600,
        isPremium: true,
        theme: 'diamond',
        cards: [],
        isReady: false,
        isHost: false
      },
      {
        id: 'leader-3',
        name: 'CardShark',
        avatar: '🦈',
        coins: 42000,
        level: 72,
        wins: 980,
        gamesPlayed: 1450,
        isPremium: false,
        theme: 'default',
        cards: [],
        isReady: false,
        isHost: false
      },
      {
        id: 'leader-4',
        name: 'WildCard',
        avatar: '🃏',
        coins: 38000,
        level: 65,
        wins: 850,
        gamesPlayed: 1300,
        isPremium: true,
        theme: 'premium',
        cards: [],
        isReady: false,
        isHost: false
      },
      {
        id: 'leader-5',
        name: 'StackKing',
        avatar: '🎪',
        coins: 35000,
        level: 60,
        wins: 720,
        gamesPlayed: 1200,
        isPremium: false,
        theme: 'default',
        cards: [],
        isReady: false,
        isHost: false
      }
    ];

    setLeaderboard(mockLeaderboard);
  }, [setLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <Star className="w-6 h-6 text-blue-400" />;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-orange-400/20 to-red-500/20 border-orange-400/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-sm rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Global Leaderboard</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLeaderboard(false)}
            className="p-2 hover:bg-white/10 rounded-lg text-white"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">2,847</div>
              <div className="text-sm text-gray-300">Active Players</div>
            </div>
            <div className="bg-green-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">15,293</div>
              <div className="text-sm text-gray-300">Games Today</div>
            </div>
            <div className="bg-purple-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">847</div>
              <div className="text-sm text-gray-300">Tournaments</div>
            </div>
            <div className="bg-orange-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">5.2M</div>
              <div className="text-sm text-gray-300">Cards Played</div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const rank = index + 1;
              const winRate = ((player.wins / player.gamesPlayed) * 100).toFixed(1);
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${getRankBg(rank)} rounded-xl p-4 border`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
                      {getRankIcon(rank)}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 flex items-center space-x-4">
                      <div className="text-3xl">{player.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-white">{player.name}</h3>
                          {player.isPremium && (
                            <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                              PREMIUM
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-300">Level {player.level}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex space-x-8 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{player.wins.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Wins</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-400">{winRate}%</div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-400">{player.coins.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Coins</div>
                      </div>
                    </div>

                    {/* Trend */}
                    <div className="flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 text-center">
          <div className="text-sm text-gray-400">
            Leaderboard updates every 5 minutes • Climb the ranks and earn exclusive rewards!
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;