
import React from 'react';
import type { Day } from '../types';
import { DAYS } from '../constants';
import { useLocalization } from '../App';
import { triggerHaptic } from '../utils/native';

interface DayTabsProps {
  selectedDay: Day;
  onSetSelectedDay: (day: Day) => void;
}

const DayTabs: React.FC<DayTabsProps> = ({ selectedDay, onSetSelectedDay }) => {
  const { t } = useLocalization();
  return (
    <div className="bg-white dark:bg-gray-800 sticky top-[88px] z-10 shadow-sm transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => {
                triggerHaptic('light');
                onSetSelectedDay(day);
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all duration-300 ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t(`days.${day}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayTabs;
