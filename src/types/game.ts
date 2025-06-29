export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
  symbol?: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  cards: Card[];
  isReady: boolean;
  isHost: boolean;
  coins: number;
  level: number;
  wins: number;
  gamesPlayed: number;
  isPremium: boolean;
  theme: string;
}

export interface GameRoom {
  id: string;
  name: string;
  isPrivate: boolean;
  password?: string;
  maxPlayers: number;
  currentPlayers: number;
  players: Player[];
  gameInProgress: boolean;
  host: string;
  gameMode: GameMode;
  houseRules: HouseRules;
}

export interface GameState {
  currentPlayer: string;
  direction: 1 | -1;
  lastCard: Card;
  drawPile: Card[];
  discardPile: Card[];
  players: Player[];
  gameStarted: boolean;
  gameEnded: boolean;
  winner?: string;
  currentColor?: CardColor;
}

export interface GameMode {
  name: string;
  description: string;
  rules: string[];
  isTeamMode: boolean;
  maxPlayers: number;
}

export interface HouseRules {
  stackDrawCards: boolean;
  jumpIn: boolean;
  sevenSwap: boolean;
  zeroRotate: boolean;
  noBluffing: boolean;
  challengeWild4: boolean;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'chat' | 'system' | 'emote';
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  entryFee: number;
  prizePool: number;
  startDate: Date;
  endDate: Date;
  participants: Player[];
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface Club {
  id: string;
  name: string;
  description: string;
  members: Player[];
  maxMembers: number;
  isPrivate: boolean;
  owner: string;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward: {
    type: 'coins' | 'theme' | 'avatar' | 'title';
    value: string | number;
  };
}