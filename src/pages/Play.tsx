import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import GoBoard from '../components/GoBoard';
import { getAIMove } from '../utils/aiEngine';
import { countTerritory, countStones } from '../utils/goLogic';
import { ArrowLeft, RotateCcw, Flag, RefreshCw, Trophy } from 'lucide-react';

const Play: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { currentGame, startNewGame, makeMove, undoMove, pass, finishGame } = useGameStore();
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);

  useEffect(() => {
    if (levelId) {
      startNewGame(parseInt(levelId));
      setShowGameEnd(false);
      setLastMove(null);
    }
  }, [levelId, startNewGame]);

  useEffect(() => {
    if (currentGame?.gameOver) {
      setShowGameEnd(true);
    }
  }, [currentGame?.gameOver]);

  useEffect(() => {
    if (currentGame?.currentPlayer === 2 && !currentGame.gameOver) {
      setIsAIThinking(true);
      const timer = setTimeout(() => {
        const move = getAIMove(currentGame.board, 2, currentGame.level?.difficulty || 5);
        if (move) {
          makeMove(move[0], move[1]);
          setLastMove(move);
        } else {
          pass();
        }
        setIsAIThinking(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentGame?.currentPlayer, currentGame?.gameOver, currentGame?.board, currentGame?.level?.difficulty, makeMove, pass]);

  const handleMove = (x: number, y: number) => {
    if (currentGame?.currentPlayer === 1 && !currentGame.gameOver && !isAIThinking) {
      const success = makeMove(x, y);
      if (success) {
        setLastMove([x, y]);
      }
    }
  };

  const handleFinish = (resign = false) => {
    if (!currentGame) return;

    if (resign) {
      finishGame(2);
    } else {
      const territory = countTerritory(currentGame.board);
      const stones = countStones(currentGame.board);
      const blackScore = stones.black + territory.black;
      const whiteScore = stones.white + territory.white + 6.5;

      finishGame(blackScore > whiteScore ? 1 : 2);
    }
  };

  const handleRestart = () => {
    if (levelId) {
      startNewGame(parseInt(levelId));
      setShowGameEnd(false);
      setLastMove(null);
    }
  };

  if (!currentGame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold text-gray-700">Back</span>
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {currentGame.level?.name}
          </h2>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`bg-white rounded-2xl p-6 shadow-lg ${currentGame.currentPlayer === 1 && !currentGame.gameOver ? 'ring-4 ring-yellow-400' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-semibold">You (Black)</span>
              {currentGame.currentPlayer === 1 && !currentGame.gameOver && !isAIThinking && (
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold animate-pulse">
                  Your turn
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-full"></div>
              <span className="text-2xl font-bold text-gray-700">
                Captures: {currentGame.captures.black}
              </span>
            </div>
          </div>

          <div className={`bg-white rounded-2xl p-6 shadow-lg ${currentGame.currentPlayer === 2 && !currentGame.gameOver ? 'ring-4 ring-yellow-400' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-semibold">AI (White)</span>
              {isAIThinking && (
                <span className="bg-blue-400 text-white px-2 py-1 rounded-full text-sm font-bold animate-pulse">
                  Thinking...
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded-full"></div>
              <span className="text-2xl font-bold text-gray-700">
                Captures: {currentGame.captures.white}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <GoBoard
            board={currentGame.board}
            onMove={handleMove}
            disabled={currentGame.currentPlayer !== 1 || currentGame.gameOver || isAIThinking}
            lastMove={lastMove}
          />
        </div>

        {!currentGame.gameOver && (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => undoMove()}
              disabled={currentGame.history.length === 0}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <RotateCcw size={20} />
              Undo
            </button>
            <button
              onClick={() => pass()}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Flag size={20} />
              Pass
            </button>
            <button
              onClick={() => handleFinish(false)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Trophy size={20} />
              Finish Game
            </button>
            <button
              onClick={() => handleFinish(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              Resign
            </button>
          </div>
        )}

        {showGameEnd && currentGame.gameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
              <div className="text-6xl mb-4">
                {currentGame.winner === 1 ? '🎉' : '😔'}
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {currentGame.winner === 1 ? 'Congratulations! You won!' : 'Sorry, you lost'}
              </h2>
              {currentGame.winner === 1 && currentGame.level && (
                <p className="text-gray-600 mb-4">
                  {currentGame.level.wins + 1 >= currentGame.level.requiredWins ? 
                    'You unlocked the next level!' : 
                    `Win ${Math.max(0, currentGame.level.requiredWins - currentGame.level.wins - 1)} more games to unlock the next level!`}
                </p>
              )}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  <RefreshCw size={20} />
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  <ArrowLeft size={20} />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
