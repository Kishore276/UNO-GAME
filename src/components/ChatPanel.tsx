import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Users, X } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { ChatMessage } from '../types/game';
import { formatTimestamp } from '../utils/gameLogic';

const ChatPanel: React.FC = () => {
  const { currentRoom, currentUser, chatMessages, addChatMessage, setShowChat } = useGameStore();
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '😍', '🎉', '🔥', '👍', '👎', '❤️', '💔', '😎', '🤔', '😴', '😡', '🤯', '🥳', '😭'];

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Simulate system messages when players join/leave
    if (currentRoom) {
      const systemMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        playerId: 'system',
        playerName: 'System',
        message: `Welcome to ${currentRoom.name}!`,
        timestamp: Date.now(),
        type: 'system'
      };
      addChatMessage(systemMessage);
    }
  }, [currentRoom, addChatMessage]);

  const handleSendMessage = () => {
    if (!message.trim() || !currentUser || !currentRoom) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      playerId: currentUser.id,
      playerName: currentUser.name,
      message: message.trim(),
      timestamp: Date.now(),
      type: 'chat'
    };

    addChatMessage(newMessage);
    setMessage('');
    setShowEmojis(false);
  };

  const handleEmojiClick = (emoji: string) => {
    if (!currentUser || !currentRoom) return;

    const emojiMessage: ChatMessage = {
      id: `emoji-${Date.now()}`,
      playerId: currentUser.id,
      playerName: currentUser.name,
      message: emoji,
      timestamp: Date.now(),
      type: 'emote'
    };

    addChatMessage(emojiMessage);
    setShowEmojis(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (msg: ChatMessage) => {
    if (msg.type === 'system') {
      return 'bg-blue-500/20 text-blue-300 text-center text-sm py-1 px-3 rounded-lg';
    }
    if (msg.type === 'emote') {
      return 'bg-purple-500/20 text-purple-300 text-center text-lg py-2 px-4 rounded-lg';
    }
    return msg.playerId === currentUser?.id 
      ? 'bg-blue-600 text-white ml-auto' 
      : 'bg-gray-700 text-white';
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white/10 backdrop-blur-sm border-l border-white/20 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Chat</h3>
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
            {currentRoom?.currentPlayers || 0}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(false)}
          className="p-1 hover:bg-white/10 rounded text-white"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">
            <div className="text-2xl mb-2">💬</div>
            <div>No messages yet</div>
            <div className="text-xs mt-1">Start the conversation!</div>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] ${msg.playerId === currentUser?.id ? 'items-end' : 'items-start'}`}
            >
              {msg.type === 'chat' && (
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-gray-400">{msg.playerName}</span>
                  <span className="text-xs text-gray-500">{formatTimestamp(msg.timestamp)}</span>
                </div>
              )}
              <div className={`px-3 py-2 rounded-lg ${getMessageStyle(msg)}`}>
                {msg.type === 'emote' ? (
                  <span className="text-2xl">{msg.message}</span>
                ) : (
                  <span className="text-sm">{msg.message}</span>
                )}
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-white/20 bg-white/5"
        >
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            <Smile className="w-4 h-4" />
          </motion.button>
          
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-2 rounded-lg ${
              message.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;