import React, { useState, useRef } from 'react';
import { Menu, Calendar, Download, CalendarPlus, ChevronLeft, ChevronRight, Moon, Sun, BarChart2, Upload, Activity, BookOpen } from './icons';
import { useLocalization, useTheme } from '../App';
import { triggerHaptic } from '../utils/native';
import LevelProgress from './LevelProgress';
import { UserStats } from '../types';

interface HeaderProps {
  onSetView: (view: 'day' | 'week') => void;
  onResetToDefault: () => void;
  onExportToCSV: () => void;
  onExportToICS: () => void;
  selectedWeek: number;
  onSetSelectedWeek: React.Dispatch<React.SetStateAction<number>>;
  onShowAnalytics?: () => void;
  onBackupData?: () => void;
  onRestoreData?: (jsonString: string) => void;
  onOpenHabitTracker?: () => void;
  onOpenMoodTracker?: () => void;
  userStats?: UserStats;
}

const Header: React.FC<HeaderProps> = ({ 
  onSetView, 
  onResetToDefault, 
  onExportToCSV, 
  onExportToICS, 
  selectedWeek, 
  onSetSelectedWeek, 
  onShowAnalytics,
  onBackupData,
  onRestoreData,
  onOpenHabitTracker,
  onOpenMoodTracker,
  userStats
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { language, setLanguage, t } = useLocalization();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleTheme = () => {
    triggerHaptic('light');
    toggleDarkMode();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onRestoreData) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onRestoreData(content);
      };
      reader.readAsText(file);
    }
    // Reset input so same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="truncate">{t('appName')}</span>
            </h1>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onSetSelectedWeek(prev => Math.max(1, prev - 1));
                }}
                className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm whitespace-nowrap px-1 select-none">
                Week {selectedWeek}
              </span>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onSetSelectedWeek(prev => Math.min(53, prev + 1));
                }}
                className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                aria-label="Next week"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full p-1 text-sm">
              <button 
                onClick={() => { triggerHaptic('light'); setLanguage('en'); }} 
                className={`px-2 py-0.5 rounded-full transition-colors ${language === 'en' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
              >
                EN
              </button>
              <button 
                onClick={() => { triggerHaptic('light'); setLanguage('nl'); }} 
                className={`px-2 py-0.5 rounded-full transition-colors ${language === 'nl' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
              >
                NL
              </button>
            </div>
            <button
              onClick={() => { triggerHaptic('light'); setShowMenu(!showMenu); }}
              className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        {showMenu && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2 animate-fade-in-down shadow-lg">
            <button
              onClick={() => { triggerHaptic('medium'); onSetView('week'); setShowMenu(false); }}
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('weekOverview')}
            </button>
            {onShowAnalytics && (
              <button
                onClick={() => { triggerHaptic('medium'); onShowAnalytics(); setShowMenu(false); }}
                className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                {t('weeklyAnalytics')}
              </button>
            )}

            {onOpenHabitTracker && (
              <button
                onClick={() => { triggerHaptic('medium'); onOpenHabitTracker(); setShowMenu(false); }}
                className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Activity className="w-4 h-4" />
                {t('habitTracker')}
              </button>
            )}

            {onOpenMoodTracker && (
              <button
                onClick={() => { triggerHaptic('medium'); onOpenMoodTracker(); setShowMenu(false); }}
                className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                {t('dailyJournal')}
              </button>
            )}

            <button
              onClick={() => { triggerHaptic('medium'); onExportToICS(); setShowMenu(false); }}
              className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
              {t('exportToICal')}
            </button>
            <button
              onClick={() => { triggerHaptic('medium'); onExportToCSV(); setShowMenu(false); }}
              className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              {t('exportToCSV')}
            </button>
            
            {onBackupData && (
              <button
                onClick={() => { triggerHaptic('medium'); onBackupData(); setShowMenu(false); }}
                className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('backupData')}
              </button>
            )}

            {onRestoreData && (
              <button
                onClick={() => { 
                  triggerHaptic('medium'); 
                  fileInputRef.current?.click(); 
                  setShowMenu(false); 
                }}
                className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {t('restoreData')}
              </button>
            )}

            <button
              onClick={() => { triggerHaptic('medium'); onResetToDefault(); setShowMenu(false); }}
              className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('resetToDefault')}
            </button>
          </div>
        )}
        {userStats && (
              <div className="hidden sm:block mr-2">
                <LevelProgress 
                  level={userStats.level} 
                  xp={userStats.xp} 
                  nextLevelXp={userStats.level * 100} 
                />
              </div>
            )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};

export default Header;
