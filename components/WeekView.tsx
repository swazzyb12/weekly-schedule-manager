import React from 'react';
import type { Schedule } from '../types';
import { DAYS, CATEGORY_STYLES, CATEGORY_ICONS } from '../constants';
import { Calendar, Home, Download, CalendarPlus, ChevronLeft, ChevronRight } from './icons';
import { useLocalization } from '../App';

interface WeekViewProps {
  schedule: Schedule;
  setView: (view: 'day' | 'week') => void;
  onExportToCSV: () => void;
  onExportToICS: () => void;
  selectedWeek: number;
  onSetSelectedWeek: React.Dispatch<React.SetStateAction<number>>;
}

const WeekView: React.FC<WeekViewProps> = ({ schedule, setView, onExportToCSV, onExportToICS, selectedWeek, onSetSelectedWeek }) => {
  const { t } = useLocalization();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-4 sticky top-2 sm:top-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <span className="truncate">{t('weekOverview')}</span>
                </h1>
                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                    <button
                        onClick={() => onSetSelectedWeek(prev => Math.max(1, prev - 1))}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Previous week"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-gray-700 text-sm whitespace-nowrap px-1 select-none">
                        Week {selectedWeek}
                    </span>
                    <button
                        onClick={() => onSetSelectedWeek(prev => Math.min(53, prev + 1))}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Next week"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2">
               <button
                onClick={onExportToICS}
                className="px-3 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                aria-label={t('exportToICal')}
              >
                <CalendarPlus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('ical')}</span>
              </button>
              <button
                onClick={onExportToCSV}
                className="px-3 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                aria-label={t('exportToCSV')}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('csv')}</span>
              </button>
              <button
                onClick={() => setView('day')}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t('dayView')}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map(day => (
            <div key={day} className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-3 capitalize border-b pb-2">{t(`days.${day}`)}</h2>
              <div className="space-y-2 flex-grow">
                {schedule[day].length > 0 ? schedule[day].map((item) => {
                  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.personal;
                  return (
                    <div key={item.id} className={`p-2 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg mt-0.5">{CATEGORY_ICONS[item.category]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className={`font-semibold text-sm ${style.text} break-words`}>{item.activity}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400 py-4">
                    <span>{t('noActivities')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default WeekView;
