import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageCircle, Volume2, Settings, Zap } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { getCardColorClass, getCardPattern, canPlayCard } from '../utils/gameLogic';
import { Card } from '../types/game';
import ChatPanel from './ChatPanel';
import toast from 'react-hot-toast';

const GameBoard: React.FC = () => {
  const {
    gameState,
    currentUser,
    setCurrentRoom,
    setGameState,
    selectedCards,
    toggleSelectedCard,
    playCard,
    drawCard,
    sayUno
  } = useGameStore();

  const [showChat, setShowChat] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!gameState || !currentUser) {
    return null;
  }

  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
  const userPlayer = gameState.players.find(p => p.id === currentUser.id);
  const isUserTurn = currentUser.id === gameState.currentPlayer;

  const handlePlayCard = (cardId: string) => {
    const card = userPlayer?.cards.find(c => c.id === cardId);
    if (!card) return;

    if (!canPlayCard(card, gameState.lastCard, gameState.currentColor)) {
      toast.error("You can't play that card!");
      return;
    }

    if (card.type === 'wild' || card.type === 'wild4') {
      setShowColorPicker(true);
      return;
    }

    playCard(cardId);
    toast.success('Card played!');
  };

  const handleDrawCard = () => {
    drawCard();
    toast.success('Card drawn!');
  };

  const handleSayUno = () => {
    sayUno();
    toast.success('UNO!', { 
      icon: '🎯',
      style: {
        background: '#f59e0b',
        color: '#fff',
      }
    });
  };

  const handleLeaveGame = () => {
    setCurrentRoom(null);
    setGameState(null);
  };

  const renderCard = (card: Card, onClick?: () => void, isSelected = false, size = 'normal') => {
    const sizeClasses = {
      small: 'w-12 h-16 text-xs',
      normal: 'w-20 h-28 text-sm',
      large: 'w-24 h-36 text-base'
    };

    return (
      <motion.div
        key={card.id}
        whileHover={onClick ? { scale: 1.05, y: -5 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
        onClick={onClick}
        className={`
          ${sizeClasses[size]} ${getCardColorClass(card.color)} 
          rounded-lg border-2 flex flex-col items-center justify-center
          font-bold text-white shadow-lg cursor-pointer relative
          ${isSelected ? 'ring-4 ring-yellow-400 transform -translate-y-2' : ''}
          ${onClick ? 'hover:shadow-xl' : ''}
        `}
      >
        {/* Colorblind pattern */}
        <div className="absolute top-1 left-1 text-xs opacity-60">
          {getCardPattern(card.color)}
        </div>
        
        {/* Card symbol/value */}
        <div className="text-center">
          <div className="text-lg font-bold">{card.symbol}</div>
          {card.type === 'number' && (
            <div className="text-xs mt-1">{card.value}</div>
          )}
        </div>
        
        {/* Bottom corner (mirrored) */}
        <div className="absolute bottom-1 right-1 text-xs opacity-60 transform rotate-180">
          {card.symbol}
        </div>
      </motion.div>
    );
  };

  const renderPlayerArea = (player: any, position: string, isCurrentPlayer: boolean) => {
    const positionClasses = {
      top: 'top-4 left-1/2 transform -translate-x-1/2',
      right: 'right-4 top-1/2 transform -translate-y-1/2',
      bottom: 'bottom-4 left-1/2 transform -translate-x-1/2',
      left: 'left-4 top-1/2 transform -translate-y-1/2'
    };

    return (
      <div className={`absolute ${positionClasses[position as keyof typeof positionClasses]} z-10`}>
        <motion.div
          animate={isCurrentPlayer ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className={`
            bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2
            ${isCurrentPlayer ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/20'}
          `}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-2xl">{player.avatar}</div>
            <div>
              <div className="text-white font-semibold">{player.name}</div>
              <div className="text-xs text-gray-300">{player.cards.length} cards</div>
            </div>
            {isCurrentPlayer && (
              <div className="text-yellow-400">
                <Zap className="w-5 h-5" />
              </div>
            )}
          </div>
          
          {/* Cards preview */}
          <div className="flex space-x-1">
            {player.cards.slice(0, 5).map((card: Card, index: number) => (
              <div
                key={index}
                className="w-4 h-6 bg-gray-700 rounded border border-gray-600"
                style={{ transform: `translateX(${index * -2}px)` }}
              />
            ))}
            {player.cards.length > 5 && (
              <div className="text-xs text-gray-400 ml-2">
                +{player.cards.length - 5}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-blue-800 to-purple-800 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm relative z-20">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLeaveGame}
            className="flex items-center space-x-2 text-white hover:text-yellow-400"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Leave Game</span>
          </motion.button>
        </div>
        
        <div className="text-white text-center">
          <div className="text-lg font-bold">
            {currentPlayer?.name}'s Turn
          </div>
          <div className="text-sm text-gray-300">
            Direction: {gameState.direction === 1 ? '→' : '←'}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg ${showChat ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
          
          <button className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className={`flex-1 relative ${showChat ? 'mr-80' : ''}`}>
        {/* Other players */}
        {gameState.players
          .filter(p => p.id !== currentUser.id)
          .slice(0, 4)
          .map((player, index) => {
            const positions = ['top', 'right', 'left'];
            return renderPlayerArea(
              player, 
              positions[index % positions.length], 
              player.id === gameState.currentPlayer
            );
          })}

        {/* Center area with discard pile and draw pile */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-8">
          {/* Draw pile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isUserTurn ? handleDrawCard : undefined}
            className={`
              w-24 h-36 bg-gradient-to-br from-gray-800 to-gray-900 
              rounded-lg border-2 border-gray-600 flex items-center justify-center
              font-bold text-white shadow-xl cursor-pointer relative
              ${isUserTurn ? 'hover:shadow-2xl' : 'opacity-50 cursor-not-allowed'}
            `}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎴</div>
              <div className="text-xs">Draw</div>
            </div>
          </motion.div>

          {/* Discard pile */}
          <div className="relative">
            {renderCard(gameState.lastCard, undefined, false, 'large')}
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Last Card
            </div>
            {gameState.currentColor && gameState.currentColor !== gameState.lastCard.color && (
              <div className="absolute -bottom-2 -left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                Color: {gameState.currentColor}
              </div>
            )}
          </div>
        </div>

        {/* Current user's cards */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">Your Cards ({userPlayer?.cards.length})</div>
              <div className="flex space-x-2">
                {isUserTurn && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSayUno}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm"
                  >
                    UNO!
                  </motion.button>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2 max-w-4xl overflow-x-auto pb-2">
              {userPlayer?.cards.map((card) => (
                <div key={card.id}>
                  {renderCard(
                    card,
                    isUserTurn ? () => handlePlayCard(card.id) : undefined,
                    selectedCards.includes(card.id)
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && <ChatPanel />}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose a Color</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { color: 'red', name: 'Red', class: 'bg-red-500 hover:bg-red-600' },
                { color: 'blue', name: 'Blue', class: 'bg-blue-500 hover:bg-blue-600' },
                { color: 'green', name: 'Green', class: 'bg-green-500 hover:bg-green-600' },
                { color: 'yellow', name: 'Yellow', class: 'bg-yellow-400 hover:bg-yellow-500' }
              ].map(({ color, name, class: colorClass }) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Handle color selection
                    setShowColorPicker(false);
                    toast.success(`Color changed to ${name}!`);
                  }}
                  className={`${colorClass} text-white font-bold py-4 px-6 rounded-lg shadow-lg`}
                >
                  {name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;