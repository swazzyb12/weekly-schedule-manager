import React, { useState, useEffect } from 'react';
import { Mood, JournalEntry } from '../types';
import { Smile, Meh, Frown, Save, X, BookOpen } from './icons';
import { useLocalization } from '../App';
import { triggerHaptic } from '../utils/native';

interface MoodTrackerProps {
  date: string;
  entry: JournalEntry | undefined;
  onSave: (entry: JournalEntry) => void;
  onClose: () => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ date, entry, onSave, onClose }) => {
  const { t } = useLocalization();
  const [mood, setMood] = useState<Mood>(entry?.mood || 'neutral');
  const [note, setNote] = useState(entry?.note || '');

  const moods: { value: Mood; icon: React.ReactNode; label: string; color: string }[] = [
    { value: 'great', icon: <Smile className="w-8 h-8" />, label: t('mood.great'), color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
    { value: 'good', icon: <Smile className="w-8 h-8" />, label: t('mood.good'), color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
    { value: 'neutral', icon: <Meh className="w-8 h-8" />, label: t('mood.neutral'), color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
    { value: 'bad', icon: <Frown className="w-8 h-8" />, label: t('mood.bad'), color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
    { value: 'awful', icon: <Frown className="w-8 h-8" />, label: t('mood.awful'), color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');
    onSave({
      date,
      mood,
      note
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] mx-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('dailyJournal')}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto">
          {/* Date Display */}
          <div className="text-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Mood Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              {t('howAreYouFeeling')}
            </label>
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setMood(m.value);
                  }}
                  className={`flex flex-col items-center gap-1 p-1 sm:p-2 rounded-xl transition-all duration-200 ${
                    mood === m.value 
                      ? `${m.color} ring-2 ring-offset-2 ring-purple-500 scale-105 sm:scale-110` 
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="transform scale-75 sm:scale-100">
                    {m.icon}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Journal Note */}
          <div className="space-y-2">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('journalNote')}
            </label>
            <textarea
              id="note"
              rows={6}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('journalPlaceholder')}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-shadow"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 flex items-center justify-center gap-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 dark:shadow-none"
          >
            <Save className="w-5 h-5" />
            {t('saveEntry')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MoodTracker;
