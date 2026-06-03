import { Player, BOARD_SIZE } from '../types';
import { placeStone, findGroup } from './goLogic';

interface Move {
  x: number;
  y: number;
  score: number;
}

export const getAIMove = (
  board: Player[][],
  player: 1 | 2,
  difficulty: number
): [number, number] | null => {
  const moves: Move[] = [];
  
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (board[x][y] === 0) {
        const result = placeStone(board, x, y, player);
        if (result.valid) {
          let score = 0;
          
          score += result.captures * 10;
          
          const { liberties } = findGroup(result.board, x, y);
          score += liberties * 2;
          
          const distanceFromCenter = Math.abs(x - 9) + Math.abs(y - 9);
          score += (36 - distanceFromCenter) * 0.5;
          
          const opponent = player === 1 ? 2 : 1;
          for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
            if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
              if (result.board[nx][ny] === opponent) {
                const oppGroup = findGroup(result.board, nx, ny);
                if (oppGroup.liberties === 1) {
                  score += 50;
                } else if (oppGroup.liberties === 2) {
                  score += 15;
                }
              }
            }
          }
          
          const randomness = Math.max(0, 30 - difficulty * 2);
          score += Math.random() * randomness;
          
          moves.push({ x, y, score });
        }
      }
    }
  }
  
  if (moves.length === 0) return null;
  
  moves.sort((a, b) => b.score - a.score);
  
  const selectionRange = Math.max(1, Math.floor(moves.length * Math.max(0.1, 0.5 - difficulty * 0.05)));
  const selectedIndex = Math.floor(Math.random() * selectionRange);
  
  return [moves[selectedIndex].x, moves[selectedIndex].y];
};
