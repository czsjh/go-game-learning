import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import LevelCard from '../components/LevelCard';
import ProgressBar from '../components/ProgressBar';
import { Trophy, TrendingUp, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useGameStore();

  const handleStartGame = (levelId: number) => {
    navigate(`/play/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Go Adventure
          </h1>
          <p className="text-gray-600 text-lg">
            Select a level to start your Go journey!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="text-yellow-500" size={32} />
              <span className="text-gray-600 font-semibold">Total Wins</span>
            </div>
            <div className="text-4xl font-bold text-yellow-600">
              {progress.totalWins}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-500" size={32} />
              <span className="text-gray-600 font-semibold">Total Games</span>
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {progress.totalGames}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
               onClick={() => navigate('/stats')}>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-purple-500" size={32} />
              <span className="text-gray-600 font-semibold">View Stats</span>
            </div>
            <div className="text-lg font-semibold text-purple-600">
              Click to see details →
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <ProgressBar levels={progress.levels} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {progress.levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              onClick={() => handleStartGame(level.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
