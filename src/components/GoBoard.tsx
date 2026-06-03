import React, { useEffect, useRef, useState } from 'react';
import { Player, BOARD_SIZE } from '../types';

interface GoBoardProps {
  board: Player[][];
  onMove?: (x: number, y: number) => void;
  disabled?: boolean;
  lastMove?: [number, number] | null;
}

const GoBoard: React.FC<GoBoardProps> = ({ board, onMove, disabled = false, lastMove = null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverPos, setHoverPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(window.innerWidth - 40, 500);
    canvas.width = size;
    canvas.height = size;
    const cellSize = size / (BOARD_SIZE + 1);
    const stoneRadius = cellSize * 0.4;

    ctx.fillStyle = '#E8C387';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < BOARD_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(cellSize, cellSize + i * cellSize);
      ctx.lineTo(size - cellSize, cellSize + i * cellSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cellSize + i * cellSize, cellSize);
      ctx.lineTo(cellSize + i * cellSize, size - cellSize);
      ctx.stroke();
    }

    const starPoints = [
      [3, 3], [3, 9], [3, 15],
      [9, 3], [9, 9], [9, 15],
      [15, 3], [15, 9], [15, 15]
    ];
    ctx.fillStyle = '#8B4513';
    for (const point of starPoints) {
      const x = point[0];
      const y = point[1];
      ctx.beginPath();
      ctx.arc(cellSize + x * cellSize, cellSize + y * cellSize, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (board[x][y] !== 0) {
          const centerX = cellSize + x * cellSize;
          const centerY = cellSize + y * cellSize;

          const isLast = lastMove && lastMove[0] === x && lastMove[1] === y;

          if (board[x][y] === 1) {
            const gradient = ctx.createRadialGradient(
              centerX - 3, centerY - 3, 2, centerX, centerY, stoneRadius
            );
            gradient.addColorStop(0, '#555555');
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
          } else {
            const gradient = ctx.createRadialGradient(
              centerX - 3, centerY - 3, 2, centerX, centerY, stoneRadius
            );
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(1, '#DDDDDD');
            ctx.fillStyle = gradient;
          }

          ctx.beginPath();
          ctx.arc(centerX, centerY, stoneRadius, 0, Math.PI * 2);
          ctx.fill();

          if (board[x][y] === 2) {
            ctx.strokeStyle = '#CCCCCC';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          if (isLast) {
            ctx.fillStyle = board[x][y] === 1 ? '#FFD700' : '#FF6B6B';
            ctx.beginPath();
            ctx.arc(centerX, centerY, stoneRadius * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    if (hoverPos && !disabled) {
      const hx = hoverPos[0];
      const hy = hoverPos[1];
      if (board[hx][hy] === 0) {
        ctx.strokeStyle = 'rgba(0, 100, 200, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(cellSize + hx * cellSize, cellSize + hy * cellSize, stoneRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [board, hoverPos, lastMove, disabled]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent): [number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const size = canvas.width;
    const cellSize = size / (BOARD_SIZE + 1);

    const x = Math.round((clientX - rect.left - cellSize) / cellSize);
    const y = Math.round((clientY - rect.top - cellSize) / cellSize);

    if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      return [x, y];
    }
    return null;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    const pos = getPosition(e);
    if (pos && onMove) {
      onMove(pos[0], pos[1]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    const pos = getPosition(e);
    if (pos && onMove) {
      onMove(pos[0], pos[1]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) {
      setHoverPos(null);
      return;
    }
    setHoverPos(getPosition(e));
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="rounded-lg shadow-2xl cursor-pointer"
      style={{ touchAction: 'none' }}
    />
  );
};

export default GoBoard;
