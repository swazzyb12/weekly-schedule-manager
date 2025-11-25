import React from 'react';
import { Trophy, Star } from './icons';
import { useLocalization } from '../App';

interface LevelProgressProps {
  level: number;
  xp: number;
  nextLevelXp: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ level, xp, nextLevelXp }) => {
  const { t } = useLocalization();
  const progress = Math.min(100, (xp / nextLevelXp) * 100);

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="relative">
        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-lg">
          {level}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-800">
          Lvl
        </div>
      </div>
      
      <div className="flex-1 min-w-[100px]">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-semibold text-gray-700 dark:text-gray-300">{t('xp')}</span>
          <span className="text-gray-500 dark:text-gray-400">{xp} / {nextLevelXp}</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;
