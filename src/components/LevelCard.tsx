import React from 'react';
import { Level } from '../types';
import { Lock, Trophy, Star } from 'lucide-react';

interface LevelCardProps {
  level: Level;
  onClick: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, onClick }) => {
  const getLevelColor = () => {
    if (!level.unlocked) return 'from-gray-300 to-gray-400';
    if (level.completed) return 'from-green-400 to-emerald-500';
    if (level.id <= 10) return 'from-blue-400 to-cyan-500';
    if (level.id <= 20) return 'from-yellow-400 to-orange-500';
    return 'from-purple-400 to-pink-500';
  };

  const renderStars = () => {
    return Array(3).fill(0).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={i < level.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <button
      onClick={level.unlocked ? onClick : undefined}
      disabled={!level.unlocked}
      className={`
        relative overflow-hidden rounded-2xl p-4 transition-all duration-300
        ${level.unlocked 
          ? 'hover:scale-105 hover:shadow-xl cursor-pointer' 
          : 'cursor-not-allowed opacity-60'}
        bg-gradient-to-br ${getLevelColor()}
      `}
    >
      <div className="relative z-10">
        {!level.unlocked && (
          <div className="flex justify-center mb-2">
            <Lock size={28} className="text-white" />
          </div>
        )}
        {level.completed && (
          <div className="flex justify-center mb-2">
            <Trophy size={28} className="text-yellow-300" />
          </div>
        )}
        <h3 className="text-xl font-bold text-white text-center mb-2">
          {level.name}
        </h3>
        {level.totalGames > 0 && (
          <div className="text-white/90 text-sm text-center mb-2">
            {level.wins}/{level.totalGames} wins
          </div>
        )}
        {level.completed && (
          <div className="flex justify-center gap-1">
            {renderStars()}
          </div>
        )}
      </div>
    </button>
  );
};

export default LevelCard;
