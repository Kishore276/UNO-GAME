import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

const DemoVideo: React.FC = () => {
  const { setShowDemo } = useGameStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const totalDuration = 45; // 45 seconds demo

  const demoSteps = [
    {
      title: "Welcome to UNO Arena",
      description: "Create your username and choose your avatar",
      timestamp: 0,
      cards: []
    },
    {
      title: "Join or Create Room",
      description: "Browse public rooms or create your own private room",
      timestamp: 5,
      cards: []
    },
    {
      title: "Game Setup",
      description: "Players join the room and get ready to play",
      timestamp: 10,
      cards: ['red-5', 'blue-7', 'green-skip', 'yellow-2']
    },
    {
      title: "Gameplay Begins",
      description: "Match cards by color or number, use special cards strategically",
      timestamp: 15,
      cards: ['red-5', 'red-8', 'blue-8', 'wild']
    },
    {
      title: "Special Cards in Action",
      description: "Skip, Reverse, Draw 2, and Wild cards change the game",
      timestamp: 25,
      cards: ['skip', 'reverse', 'draw2', 'wild4']
    },
    {
      title: "UNO Call",
      description: "Don't forget to call UNO when you have one card left!",
      timestamp: 35,
      cards: ['red-9']
    },
    {
      title: "Victory!",
      description: "First player to empty their hand wins the round",
      timestamp: 40,
      cards: []
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          
          // Update demo step based on timestamp
          const currentStep = demoSteps.findIndex((step, index) => {
            const nextStep = demoSteps[index + 1];
            return newTime >= step.timestamp && (!nextStep || newTime < nextStep.timestamp);
          });
          
          if (currentStep !== -1 && currentStep !== demoStep) {
            setDemoStep(currentStep);
          }
          
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoStep]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setDemoStep(0);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCard = (cardType: string, index: number) => {
    const cardStyles = {
      'red-5': 'bg-red-500 text-white',
      'red-8': 'bg-red-500 text-white',
      'red-9': 'bg-red-500 text-white',
      'blue-7': 'bg-blue-500 text-white',
      'blue-8': 'bg-blue-500 text-white',
      'green-skip': 'bg-green-500 text-white',
      'yellow-2': 'bg-yellow-400 text-black',
      'skip': 'bg-red-500 text-white',
      'reverse': 'bg-blue-500 text-white',
      'draw2': 'bg-green-500 text-white',
      'wild': 'bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 to-blue-400 text-white',
      'wild4': 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
    };

    const cardSymbols = {
      'red-5': '5',
      'red-8': '8',
      'red-9': '9',
      'blue-7': '7',
      'blue-8': '8',
      'green-skip': '⊘',
      'yellow-2': '2',
      'skip': '⊘',
      'reverse': '⇄',
      'draw2': '+2',
      'wild': '🌈',
      'wild4': '+4'
    };

    return (
      <motion.div
        key={`${cardType}-${index}`}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ delay: index * 0.1 }}
        className={`w-12 h-16 ${cardStyles[cardType as keyof typeof cardStyles]} rounded-lg border-2 border-white/20 flex items-center justify-center font-bold text-sm shadow-lg`}
      >
        {cardSymbols[cardType as keyof typeof cardSymbols]}
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20 bg-gradient-to-r from-purple-800/30 to-blue-800/30">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🎬</div>
            <h2 className="text-2xl font-bold text-white">UNO Arena - Gameplay Demo</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDemo(false)}
            className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Video Player Area */}
        <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 aspect-video">
          {/* Simulated Game Screen */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-6">
              {/* Current Demo Step */}
              <motion.div
                key={demoStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl"
              >
                <h3 className="text-3xl font-bold text-white mb-4">
                  {demoSteps[demoStep]?.title}
                </h3>
                <p className="text-xl text-gray-300 mb-6">
                  {demoSteps[demoStep]?.description}
                </p>
                
                {/* Demo Cards */}
                <AnimatePresence mode="wait">
                  {demoSteps[demoStep]?.cards.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center space-x-2"
                    >
                      {demoSteps[demoStep].cards.map((card, index) => 
                        renderCard(card, index)
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Animated Elements */}
              {isPlaying && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl"
                >
                  🎯
                </motion.div>
              )}
            </div>
          </div>

          {/* Play/Pause Overlay */}
          {!isPlaying && currentTime === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                className="bg-white/20 backdrop-blur-sm rounded-full p-8 border border-white/30"
              >
                <Play className="w-16 h-16 text-white ml-2" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-black/30 border-t border-white/20">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRestart}
                className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full text-white"
              >
                <RotateCcw className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full text-white"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </motion.button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                Step {demoStep + 1} of {demoSteps.length}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full text-white"
              >
                <Maximize className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Demo Steps Timeline */}
        <div className="p-6 border-t border-white/20 bg-black/20">
          <h4 className="text-white font-semibold mb-4">Demo Timeline</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoSteps.map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setCurrentTime(step.timestamp);
                  setDemoStep(index);
                }}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-all
                  ${index === demoStep 
                    ? 'bg-blue-600/20 border-blue-500/50 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }
                `}
              >
                <div className="text-sm font-medium mb-1">{step.title}</div>
                <div className="text-xs opacity-75">{formatTime(step.timestamp)}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 border-t border-white/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Play?</h3>
            <p className="text-gray-300 mb-4">Join thousands of players in the ultimate UNO experience!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDemo(false)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-lg"
            >
              Start Playing Now! 🎯
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoVideo;