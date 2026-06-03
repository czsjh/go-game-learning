import React from 'react';
import { Level } from '../types';

interface ProgressBarProps {
  levels: Level[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ levels }) => {
  const completedCount = levels.filter(l => l.completed).length;
  const totalCount = levels.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between mb-2">
        <span className="text-gray-700 font-semibold">
          Overall Progress
        </span>
        <span className="text-blue-600 font-bold">
          {completedCount}/{totalCount} ({percentage}%)
        </span>
      </div>
      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
