
export type Player = 0 | 1 | 2;

export interface Level {
  id: number;
  name: string;
  difficulty: number;
  requiredWins: number;
  unlocked: boolean;
  completed: boolean;
  wins: number;
  totalGames: number;
  stars: number;
}

export interface GameState {
  board: Player[][];
  currentPlayer: 1 | 2;
  captures: { black: number; white: number };
  history: Player[][][];
  level?: Level;
  gameOver: boolean;
  winner?: 1 | 2;
}

export interface UserProgress {
  currentLevel: number;
  levels: Level[];
  totalWins: number;
  totalGames: number;
}

export const BOARD_SIZE = 19;
