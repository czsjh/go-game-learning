import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import LevelCard from '../components/LevelCard';
import ProgressBar from '../components/ProgressBar';
import { ArrowLeft, Trophy, TrendingUp, Star, RotateCcw } from 'lucide-react';

const Stats: React.FC = () => {
  const navigate = useNavigate();
  const { progress, resetProgress } = useGameStore();

  const winRate = progress.totalGames > 0 
    ? Math.round((progress.totalWins / progress.totalGames) * 100) 
    : 0;

  const totalStars = progress.levels.reduce((sum, level) => sum + level.stars, 0);
  const maxStars = progress.levels.length * 3;

  const handleConfirmReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This will clear all game history!')) {
      resetProgress();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold text-gray-700">Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            My Statistics
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="text-yellow-500" size={32} />
              <span className="text-gray-600 font-semibold">Total Wins</span>
            </div>
            <div className="text-4xl font-bold text-yellow-600">
              {progress.totalWins}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-500" size={32} />
              <span className="text-gray-600 font-semibold">Total Games</span>
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {progress.totalGames}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-500" size={32} />
              <span className="text-gray-600 font-semibold">Win Rate</span>
            </div>
            <div className="text-4xl font-bold text-green-600">
              {winRate}%
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Star className="text-purple-500" size={32} />
              <span className="text-gray-600 font-semibold">Stars</span>
            </div>
            <div className="text-4xl font-bold text-purple-600">
              {totalStars}/{maxStars}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <ProgressBar levels={progress.levels} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Level Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {progress.levels.map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                onClick={() => navigate(`/play/${level.id}`)}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirmReset}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold mx-auto"
          >
            <RotateCcw size={24} />
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stats;
