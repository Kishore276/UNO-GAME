# UNO Arena - Multiplayer Card Game

A modern, feature-rich UNO card game built with React, TypeScript, and Tailwind CSS. Experience the classic UNO game with enhanced multiplayer features, real-time chat, and beautiful animations.

## 🎮 Features

### Core Game Features
- **Multiplayer UNO Game**: Classic UNO rules with modern UI
- **Room Management**: Create, join, and manage game rooms
- **Real-time Chat**: In-game chat with emojis and system messages
- **Player Profiles**: Customizable usernames, avatars, and statistics
- **Game Modes**: Classic, Tournament, Team Play, and Premium modes
- **House Rules**: Customizable game rules and settings

### Room System
- **Room Creation**: Create custom rooms with unique IDs
- **Room Joining**: Join rooms via room ID or browse public rooms
- **Private Rooms**: Password-protected private rooms
- **Player Limits**: Configurable player limits (4-16 players)
- **Room Sharing**: Easy room sharing with generated links
- **Host Controls**: Host can start games and manage settings

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered animations
- **Modern UI**: Beautiful gradient backgrounds and glass morphism
- **Toast Notifications**: Real-time feedback and notifications
- **Keyboard Shortcuts**: Quick actions with keyboard support

### Social Features
- **Leaderboard**: Track player statistics and rankings
- **Achievements**: Unlock achievements for milestones
- **Tournaments**: Competitive tournament system
- **Friends System**: Add and play with friends
- **Clubs**: Join gaming communities

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uno-arena
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 How to Play

### Creating a Room
1. Enter your username when prompted
2. Click "Create Room" in the lobby
3. Configure room settings:
   - Room name
   - Maximum players (4-16)
   - Private/public room
   - Password (for private rooms)
4. Share the room ID with friends

### Joining a Room
1. **Via Room ID**: Click "Join with ID" and enter the room ID
2. **Browse Public Rooms**: Click on any available room in the lobby
3. **Private Rooms**: Enter the password when prompted

### Game Rules
- **Objective**: Be the first player to get rid of all cards
- **Card Types**:
  - Number cards (0-9): Match color or number
  - Action cards: Skip, Reverse, Draw 2
  - Wild cards: Change color
  - Wild Draw 4: Change color + opponent draws 4 cards
- **Special Rules**:
  - Say "UNO!" when you have 1 card left
  - Challenge Wild Draw 4 if you suspect bluffing
  - Stack Draw 2 cards (if enabled)

### House Rules
- **Stack Draw Cards**: Chain multiple draw cards
- **Jump In**: Play out of turn if you have the same card
- **Seven Swap**: Swap hands with another player
- **Zero Rotate**: Pass all cards to the next player
- **No Bluffing**: Disable Wild Draw 4 challenges
- **Challenge Wild 4**: Enable Wild Draw 4 challenges

## 🛠️ Technical Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **Zustand**: Lightweight state management
- **Vite**: Fast build tool and dev server

### Libraries
- **Lucide React**: Beautiful icons
- **React Hot Toast**: Toast notifications
- **React Router**: Client-side routing

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ChatPanel.tsx   # In-game chat
│   ├── GameBoard.tsx   # Main game interface
│   ├── GameLobby.tsx   # Room lobby
│   ├── GameRoom.tsx    # Room interface
│   ├── GameRules.tsx   # Rules modal
│   ├── JoinRoomModal.tsx # Room joining
│   ├── Leaderboard.tsx # Player rankings
│   └── UsernameModal.tsx # Username setup
├── stores/             # State management
│   └── gameStore.ts    # Main game state
├── types/              # TypeScript types
│   └── game.ts         # Game type definitions
├── utils/              # Utility functions
│   └── gameLogic.ts    # Game logic helpers
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## 🎨 Customization

### Themes
The game uses a modern dark theme with gradient backgrounds. You can customize colors by modifying the Tailwind configuration.

### House Rules
House rules can be enabled/disabled in room settings:
- Stack Draw Cards
- Jump In
- Seven Swap
- Zero Rotate
- No Bluffing
- Challenge Wild 4

### Game Modes
Different game modes offer unique experiences:
- **Classic**: Standard UNO rules
- **Tournament**: Competitive with strict timing
- **Team Play**: 2v2v2v2 team battles
- **Premium**: Exclusive features for premium players

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript type checking

### State Management
The game uses Zustand for state management with the following stores:
- **Game Store**: Main game state, rooms, players
- **UI Store**: Modal states, UI preferences
- **Chat Store**: Message history, chat settings

### Adding New Features
1. **Components**: Add new components in `src/components/`
2. **Types**: Define new types in `src/types/game.ts`
3. **Logic**: Add utility functions in `src/utils/gameLogic.ts`
4. **State**: Extend the game store in `src/stores/gameStore.ts`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with default settings

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- UNO is a trademark of Mattel
- Icons provided by Lucide React
- Animations powered by Framer Motion
- Built with modern web technologies

## 🐛 Known Issues

- Room joining by ID creates new rooms if the room doesn't exist (demo behavior)
- Real-time multiplayer requires backend implementation
- Chat messages are not persisted between sessions

## 🔮 Future Enhancements

- [ ] Backend integration for real-time multiplayer
- [ ] Voice chat support
- [ ] Mobile app versions
- [ ] AI opponents
- [ ] Tournament brackets
- [ ] Custom card themes
- [ ] Replay system
- [ ] Statistics tracking
- [ ] Social media integration

---

**Enjoy playing UNO Arena! 🎉** 