import { Card, CardColor, CardType, Player, GameState, GameRoom } from '../types/game';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  
  // Number cards (0-9)
  colors.forEach(color => {
    // One 0 card per color
    deck.push({
      id: `${color}-0-${Math.random()}`,
      color,
      type: 'number',
      value: 0,
      symbol: '0'
    });
    
    // Two of each number 1-9 per color
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 2; j++) {
        deck.push({
          id: `${color}-${i}-${j}-${Math.random()}`,
          color,
          type: 'number',
          value: i,
          symbol: i.toString()
        });
      }
    }
    
    // Action cards (2 of each per color)
    const actionCards: { type: CardType; symbol: string }[] = [
      { type: 'skip', symbol: '⊘' },
      { type: 'reverse', symbol: '⇄' },
      { type: 'draw2', symbol: '+2' }
    ];
    
    actionCards.forEach(({ type, symbol }) => {
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: `${color}-${type}-${i}-${Math.random()}`,
          color,
          type,
          symbol
        });
      }
    });
  });
  
  // Wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `wild-${i}-${Math.random()}`,
      color: 'wild',
      type: 'wild',
      symbol: '🌈'
    });
    
    deck.push({
      id: `wild4-${i}-${Math.random()}`,
      color: 'wild',
      type: 'wild4',
      symbol: '+4'
    });
  }
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck: Card[], players: Player[], cardsPerPlayer: number = 7): Card[] {
  let currentDeck = [...deck];
  
  players.forEach(player => {
    player.cards = currentDeck.splice(0, cardsPerPlayer);
  });
  
  return currentDeck;
}

export function canPlayCard(card: Card, lastCard: Card, currentColor?: CardColor): boolean {
  // Wild cards can always be played
  if (card.type === 'wild' || card.type === 'wild4') {
    return true;
  }
  
  // If there's a current color (from wild card), match that
  if (currentColor) {
    return card.color === currentColor;
  }
  
  // Match color or symbol/value
  if (card.color === lastCard.color) {
    return true;
  }
  
  if (card.type === 'number' && lastCard.type === 'number') {
    return card.value === lastCard.value;
  }
  
  if (card.type === lastCard.type && card.type !== 'number') {
    return true;
  }
  
  return false;
}

export function getCardColorClass(color: CardColor): string {
  const colorMap = {
    red: 'bg-red-500 border-red-600',
    blue: 'bg-blue-500 border-blue-600',
    green: 'bg-green-500 border-green-600',
    yellow: 'bg-yellow-400 border-yellow-500',
    wild: 'bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 to-blue-400 border-purple-600'
  };
  
  return colorMap[color] || 'bg-gray-300 border-gray-400';
}

export function getCardPattern(color: CardColor): string {
  // Patterns for colorblind accessibility
  const patternMap = {
    red: '●●●',
    blue: '■■■',
    green: '▲▲▲',
    yellow: '♦♦♦',
    wild: '★★★'
  };
  
  return patternMap[color] || '';
}

export const generateMockPlayers = (count: number): Player[] => {
  const avatars = ['👨', '👩', '👦', '👧', '👴', '👵', '🤖', '👻', '🐱', '🐶', '🦊', '🐼'];
  const names = [
    'Alex', 'Sam', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Quinn',
    'Avery', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Gray', 'Harper'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `player-${index}`,
    name: names[index % names.length],
    avatar: avatars[index % avatars.length],
    cards: generateMockCards(7),
    isReady: Math.random() > 0.3,
    isHost: index === 0,
    coins: Math.floor(Math.random() * 10000),
    level: Math.floor(Math.random() * 50) + 1,
    wins: Math.floor(Math.random() * 100),
    gamesPlayed: Math.floor(Math.random() * 200) + 50,
    isPremium: Math.random() > 0.7,
    theme: 'default'
  }));
};

export const generateMockCards = (count: number): Card[] => {
  const colors: Array<'red' | 'blue' | 'green' | 'yellow'> = ['red', 'blue', 'green', 'yellow'];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const specialCards = ['skip', 'reverse', 'draw2'];
  
  const cards: Card[] = [];
  
  for (let i = 0; i < count; i++) {
    const isSpecial = Math.random() > 0.7;
    
    if (isSpecial) {
      const specialType = specialCards[Math.floor(Math.random() * specialCards.length)] as 'skip' | 'reverse' | 'draw2';
      cards.push({
        id: `card-${i}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: specialType,
        symbol: specialType === 'skip' ? '⊘' : specialType === 'reverse' ? '↺' : '+2'
      });
    } else {
      const number = numbers[Math.floor(Math.random() * numbers.length)];
      cards.push({
        id: `card-${i}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'number',
        value: number,
        symbol: number.toString()
      });
    }
  }
  
  return cards;
};

export const generateRoomId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const validateRoomId = (roomId: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(roomId);
};

export const canJoinRoom = (room: GameRoom, player: Player, password?: string): { canJoin: boolean; error?: string } => {
  // Check if room is full
  if (room.currentPlayers >= room.maxPlayers) {
    return { canJoin: false, error: 'Room is full' };
  }
  
  // Check if game is in progress
  if (room.gameInProgress) {
    return { canJoin: false, error: 'Game is already in progress' };
  }
  
  // Check if room is private and password is required
  if (room.isPrivate && room.password !== password) {
    return { canJoin: false, error: 'Incorrect password' };
  }
  
  // Check if player is already in the room
  if (room.players.find(p => p.id === player.id)) {
    return { canJoin: false, error: 'You are already in this room' };
  }
  
  return { canJoin: true };
};

export const addPlayerToRoom = (room: GameRoom, player: Player): GameRoom => {
  return {
    ...room,
    players: [...room.players, player],
    currentPlayers: room.currentPlayers + 1
  };
};

export const removePlayerFromRoom = (room: GameRoom, playerId: string): GameRoom => {
  const updatedPlayers = room.players.filter(p => p.id !== playerId);
  const newHost = updatedPlayers.length > 0 ? updatedPlayers[0].id : '';
  
  return {
    ...room,
    players: updatedPlayers,
    currentPlayers: room.currentPlayers - 1,
    host: newHost
  };
};

export const isValidPlay = (card: Card, topCard: Card, currentColor?: string): boolean => {
  // Wild cards can always be played
  if (card.type === 'wild' || card.type === 'wild4') {
    return true;
  }
  
  // Check color match
  if (card.color === topCard.color || card.color === currentColor) {
    return true;
  }
  
  // Check number/symbol match
  if (card.type === topCard.type) {
    if (card.type === 'number') {
      return card.value === topCard.value;
    }
    return true; // For special cards like skip, reverse, draw2
  }
  
  return false;
};

export const getNextPlayer = (currentPlayerIndex: number, direction: 1 | -1, playerCount: number): number => {
  let nextIndex = currentPlayerIndex + direction;
  
  // Handle wrapping around
  if (nextIndex < 0) {
    nextIndex = playerCount - 1;
  } else if (nextIndex >= playerCount) {
    nextIndex = 0;
  }
  
  return nextIndex;
};

export const calculateScore = (cards: Card[]): number => {
  return cards.reduce((score, card) => {
    switch (card.type) {
      case 'number':
        return score + (card.value || 0);
      case 'skip':
      case 'reverse':
      case 'draw2':
        return score + 20;
      case 'wild':
      case 'wild4':
        return score + 50;
      default:
        return score;
    }
  }, 0);
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) { // Less than 1 minute
    return 'Just now';
  } else if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) { // Less than 1 day
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const checkAchievements = (player: Player, gameResult: 'win' | 'loss' | 'draw'): string[] => {
  const achievements: string[] = [];
  
  // First win achievement
  if (gameResult === 'win' && player.wins === 1) {
    achievements.push('First Victory');
  }
  
  // 10 wins achievement
  if (gameResult === 'win' && player.wins === 10) {
    achievements.push('Decade Master');
  }
  
  // 100 games played
  if (player.gamesPlayed === 100) {
    achievements.push('Century Player');
  }
  
  // Level milestones
  if (player.level === 10) {
    achievements.push('Rising Star');
  } else if (player.level === 25) {
    achievements.push('Veteran Player');
  } else if (player.level === 50) {
    achievements.push('Legend');
  }
  
  return achievements;
};