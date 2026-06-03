import { Player, BOARD_SIZE } from '../types';

export const createEmptyBoard = (): Player[][] => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
};

export const cloneBoard = (board: Player[][]): Player[][] => {
  return board.map(row => [...row]);
};

const getNeighbors = (x: number, y: number): [number, number][] => {
  const neighbors: [number, number][] = [];
  if (x > 0) neighbors.push([x - 1, y]);
  if (x < BOARD_SIZE - 1) neighbors.push([x + 1, y]);
  if (y > 0) neighbors.push([x, y - 1]);
  if (y < BOARD_SIZE - 1) neighbors.push([x, y + 1]);
  return neighbors;
};

export const findGroup = (
  board: Player[][],
  startX: number,
  startY: number
): { group: [number, number][]; liberties: number } => {
  const color = board[startX][startY];
  if (color === 0) return { group: [], liberties: 0 };

  const visited = new Set<string>();
  const group: [number, number][] = [];
  let liberties = 0;
  const queue: [number, number][] = [[startX, startY]];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (board[x][y] === color) {
      group.push([x, y]);
      for (const [nx, ny] of getNeighbors(x, y)) {
        const nKey = `${nx},${ny}`;
        if (!visited.has(nKey)) {
          if (board[nx][ny] === color) {
            queue.push([nx, ny]);
          } else if (board[nx][ny] === 0) {
            liberties++;
            visited.add(nKey);
          }
        }
      }
    }
  }

  return { group, liberties };
};

const removeGroup = (board: Player[][], group: [number, number][]): number => {
  for (const [x, y] of group) {
    board[x][y] = 0;
  }
  return group.length;
};

export const placeStone = (
  board: Player[][],
  x: number,
  y: number,
  player: 1 | 2
): { board: Player[][]; captures: number; valid: boolean } => {
  if (board[x][y] !== 0) return { board, captures: 0, valid: false };

  const newBoard = cloneBoard(board);
  newBoard[x][y] = player;

  const opponent = player === 1 ? 2 : 1;
  let totalCaptures = 0;

  for (const [nx, ny] of getNeighbors(x, y)) {
    if (newBoard[nx][ny] === opponent) {
      const { group, liberties } = findGroup(newBoard, nx, ny);
      if (liberties === 0) {
        totalCaptures += removeGroup(newBoard, group);
      }
    }
  }

  const { liberties: ownLiberties } = findGroup(newBoard, x, y);
  if (ownLiberties === 0) {
    return { board, captures: 0, valid: false };
  }

  return { board: newBoard, captures: totalCaptures, valid: true };
};

export const boardsEqual = (b1: Player[][], b2: Player[][]): boolean => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (b1[i][j] !== b2[i][j]) return false;
    }
  }
  return true;
};

export const countTerritory = (board: Player[][]): { black: number; white: number } => {
  const blackTerritory = new Set<string>();
  const whiteTerritory = new Set<string>();
  const visited = new Set<string>();

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const key = `${x},${y}`;
      if (board[x][y] === 0 && !visited.has(key)) {
        const { territory, owner } = floodFillTerritory(board, x, y, visited);
        if (owner === 1) {
          territory.forEach(t => blackTerritory.add(t));
        } else if (owner === 2) {
          territory.forEach(t => whiteTerritory.add(t));
        }
      }
    }
  }

  return { black: blackTerritory.size, white: whiteTerritory.size };
};

const floodFillTerritory = (
  board: Player[][],
  startX: number,
  startY: number,
  visited: Set<string>
): { territory: string[]; owner: Player } => {
  const territory: string[] = [];
  let blackBorder = false;
  let whiteBorder = false;
  const queue: [number, number][] = [[startX, startY]];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (board[x][y] === 0) {
      territory.push(key);
      for (const [nx, ny] of getNeighbors(x, y)) {
        const nKey = `${nx},${ny}`;
        if (!visited.has(nKey)) {
          if (board[nx][ny] === 0) {
            queue.push([nx, ny]);
          } else if (board[nx][ny] === 1) {
            blackBorder = true;
          } else if (board[nx][ny] === 2) {
            whiteBorder = true;
          }
        }
      }
    }
  }

  let owner: Player = 0;
  if (blackBorder && !whiteBorder) owner = 1;
  if (whiteBorder && !blackBorder) owner = 2;

  return { territory, owner };
};

export const countStones = (board: Player[][]): { black: number; white: number } => {
  let black = 0;
  let white = 0;
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (board[x][y] === 1) black++;
      if (board[x][y] === 2) white++;
    }
  }
  return { black, white };
};
