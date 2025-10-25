
import React from 'react';
import type { Day } from '../types';
import { DAYS } from '../constants';

interface DayTabsProps {
  selectedDay: Day;
  onSetSelectedDay: (day: Day) => void;
}

const DayTabs: React.FC<DayTabsProps> = ({ selectedDay, onSetSelectedDay }) => {
  return (
    <div className="bg-white sticky top-[88px] z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => onSetSelectedDay(day)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all duration-300 ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayTabs;
