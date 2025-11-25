import React, { useState } from 'react';
import { Habit, HabitLog } from '../types';
import { Check, Plus, Trash2, X, Activity } from './icons';
import { useLocalization } from '../App';
import { triggerHaptic } from '../utils/native';

interface HabitTrackerProps {
  habits: Habit[];
  habitLogs: HabitLog;
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onToggleHabit: (id: string, date: string) => void;
  onClose: () => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  habitLogs,
  onAddHabit,
  onDeleteHabit,
  onToggleHabit,
  onClose,
}) => {
  const { t } = useLocalization();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habitLogs[today] || [];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitTitle.trim(),
      category: 'health', // Default for now
    };

    onAddHabit(newHabit);
    setNewHabitTitle('');
    setIsAdding(false);
    triggerHaptic('success');
  };

  const handleToggle = (id: string) => {
    triggerHaptic('light');
    onToggleHabit(id, today);
  };

  const progress = habits.length > 0 
    ? Math.round((completedToday.length / habits.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh] mx-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('habitTracker')}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-white dark:bg-gray-800">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">{t('dailyProgress')}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Habit List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
          {habits.length === 0 && !isAdding && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <p>{t('noHabitsYet')}</p>
            </div>
          )}

          {habits.map(habit => {
            const isCompleted = completedToday.includes(habit.id);
            return (
              <div 
                key={habit.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50' 
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-500 hover:border-blue-400'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4" />}
                  </button>
                  <span className={`font-medium ${isCompleted ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {habit.title}
                  </span>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('warning');
                    onDeleteHabit(habit.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {isAdding && (
            <form onSubmit={handleAdd} className="animate-fade-in-down">
              <input
                autoFocus
                type="text"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder={t('newHabitPlaceholder')}
                className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('add')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!isAdding && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsAdding(true);
              }}
              className="w-full py-3 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t('addHabit')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
