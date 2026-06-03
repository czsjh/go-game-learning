import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Level, UserProgress, GameState, Player, BOARD_SIZE } from '../types';
import { createEmptyBoard, cloneBoard, placeStone } from '../utils/goLogic';

const initializeLevels = (): Level[] => {
  const levels: Level[] = [];
  for (let i = 25; i >= 1; i--) {
    levels.push({
      id: 26 - i,
      name: `${i}级`,
      difficulty: 26 - i,
      requiredWins: 3,
      unlocked: i === 25,
      completed: false,
      wins: 0,
      totalGames: 0,
      stars: 0
    });
  }
  for (let i = 1; i <= 5; i++) {
    levels.push({
      id: 25 + i,
      name: `${i}段`,
      difficulty: 25 + i,
      requiredWins: 5,
      unlocked: false,
      completed: false,
      wins: 0,
      totalGames: 0,
      stars: 0
    });
  }
  return levels;
};

interface GameStore {
  progress: UserProgress;
  currentGame: GameState | null;
  setCurrentLevel: (levelId: number) => void;
  startNewGame: (levelId: number) => void;
  makeMove: (x: number, y: number) => boolean;
  undoMove: () => void;
  pass: () => void;
  finishGame: (winner: 1 | 2) => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      progress: {
        currentLevel: 1,
        levels: initializeLevels(),
        totalWins: 0,
        totalGames: 0
      },
      currentGame: null,

      setCurrentLevel: (levelId: number) =>
        set(state => ({
          progress: {
            ...state.progress,
            currentLevel: levelId
          }
        })),

      startNewGame: (levelId: number) => {
        const level = get().progress.levels.find(l => l.id === levelId);
        set({
          currentGame: {
            board: createEmptyBoard(),
            currentPlayer: 1,
            captures: { black: 0, white: 0 },
            history: [],
            level,
            gameOver: false
          }
        });
      },

      makeMove: (x: number, y: number): boolean => {
        const state = get();
        if (!state.currentGame || state.currentGame.gameOver) return false;

        const result = placeStone(
          state.currentGame.board,
          x,
          y,
          state.currentGame.currentPlayer
        );

        if (!result.valid) return false;

        const newHistory = [
          ...state.currentGame.history,
          cloneBoard(state.currentGame.board)
        ];

        const newCaptures = { ...state.currentGame.captures };
        if (state.currentGame.currentPlayer === 1) {
          newCaptures.black += result.captures;
        } else {
          newCaptures.white += result.captures;
        }

        set({
          currentGame: {
            ...state.currentGame,
            board: result.board,
            currentPlayer: state.currentGame.currentPlayer === 1 ? 2 : 1,
            captures: newCaptures,
            history: newHistory
          }
        });

        return true;
      },

      undoMove: () => {
        const state = get();
        if (!state.currentGame || state.currentGame.history.length === 0) return;

        const previousBoard = state.currentGame.history[state.currentGame.history.length - 1];
        const newHistory = state.currentGame.history.slice(0, -1);

        set({
          currentGame: {
            ...state.currentGame,
            board: previousBoard,
            currentPlayer: state.currentGame.currentPlayer === 1 ? 2 : 1,
            history: newHistory
          }
        });
      },

      pass: () => {
        const state = get();
        if (!state.currentGame || state.currentGame.gameOver) return;

        const newHistory = [
          ...state.currentGame.history,
          cloneBoard(state.currentGame.board)
        ];

        set({
          currentGame: {
            ...state.currentGame,
            currentPlayer: state.currentGame.currentPlayer === 1 ? 2 : 1,
            history: newHistory
          }
        });
      },

      finishGame: (winner: 1 | 2) => {
        const state = get();
        if (!state.currentGame || !state.currentGame.level) return;

        const level = state.currentGame.level;
        const newLevels = [...state.progress.levels];
        const levelIndex = newLevels.findIndex(l => l.id === level.id);
        
        if (levelIndex !== -1) {
          newLevels[levelIndex] = {
            ...newLevels[levelIndex],
            totalGames: newLevels[levelIndex].totalGames + 1,
            wins: winner === 1 ? newLevels[levelIndex].wins + 1 : newLevels[levelIndex].wins
          };

          const winRate = newLevels[levelIndex].wins / newLevels[levelIndex].totalGames;
          if (newLevels[levelIndex].wins >= newLevels[levelIndex].requiredWins) {
            newLevels[levelIndex].completed = true;
            newLevels[levelIndex].stars = Math.min(3, Math.max(1, Math.floor(winRate * 3)));
            
            if (levelIndex + 1 < newLevels.length) {
              newLevels[levelIndex + 1].unlocked = true;
            }
          }
        }

        set({
          currentGame: {
            ...state.currentGame,
            gameOver: true,
            winner
          },
          progress: {
            ...state.progress,
            levels: newLevels,
            totalGames: state.progress.totalGames + 1,
            totalWins: winner === 1 ? state.progress.totalWins + 1 : state.progress.totalWins
          }
        });
      },

      resetProgress: () =>
        set({
          progress: {
            currentLevel: 1,
            levels: initializeLevels(),
            totalWins: 0,
            totalGames: 0
          },
          currentGame: null
        })
    }),
    {
      name: 'go-game-storage'
    }
  )
);
