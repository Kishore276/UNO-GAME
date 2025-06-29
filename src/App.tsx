import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useGameStore } from './stores/gameStore';
import GameLobby from './components/GameLobby';
import GameRoom from './components/GameRoom';
import Leaderboard from './components/Leaderboard';
import UsernameModal from './components/UsernameModal';
import JoinRoomModal from './components/JoinRoomModal';
import GameRules from './components/GameRules';
import DemoVideo from './components/DemoVideo';

function App() {
  const { 
    currentRoom, 
    showLeaderboard,
    showUsernameModal,
    showJoinRoomModal,
    showRules,
    showDemo,
    currentUser,
    initializeRooms
  } = useGameStore();

  // Initialize rooms when app starts
  useEffect(() => {
    initializeRooms();
  }, [initializeRooms]);

  return (
    <div className="min-h-screen">
      {/* Username Modal - Shows first if no user */}
      {showUsernameModal && !currentUser && <UsernameModal />}
      
      {/* Main Game Views - Only show if user exists */}
      {currentUser && (
        <>
          {currentRoom ? <GameRoom /> : <GameLobby />}
          
          {/* Modals */}
          {showLeaderboard && <Leaderboard />}
          {showJoinRoomModal && <JoinRoomModal />}
          {showRules && <GameRules />}
          {showDemo && <DemoVideo />}
        </>
      )}
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </div>
  );
}

export default App;