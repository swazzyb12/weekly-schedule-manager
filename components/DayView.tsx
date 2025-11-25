import React, { useState } from 'react';
import type { Schedule, Day, ScheduleItem, Habit, HabitLog, UserStats, CompletionLog } from '../types';
import Header from './Header';
import DayTabs from './DayTabs';
import ScheduleCard from './ScheduleCard';
import EditForm from './EditForm';
import FocusTimer from './FocusTimer';
import Analytics from './Analytics';
import { Plus } from './icons';
import { useLocalization } from '../App';
import { triggerHaptic } from '../utils/native';
import { getStartDateOfWeek } from '../utils/time';
import { DAYS } from '../constants';

interface DayViewProps {
  schedule: Schedule;
  selectedDay: Day;
  editingId: string | null;
  isAdding: boolean;
  onSetSelectedDay: (day: Day) => void;
  onSetEditingId: (id: string | null) => void;
  onSaveItem: (item: ScheduleItem) => void;
  onDeleteItem: (id: string) => void;
  onAddNewItem: () => void;
  onSaveNewItem: (item: ScheduleItem) => void;
  onCancelAddItem: () => void;
  onResetToDefault: () => void;
  onSetView: (view: 'day' | 'week') => void;
  onExportToCSV: () => void;
  onExportToICS: () => void;
  selectedWeek: number;
  onSetSelectedWeek: React.Dispatch<React.SetStateAction<number>>;
  templates: Partial<ScheduleItem>[];
  onAddTemplate: (template: Partial<ScheduleItem>) => void;
  onBackupData: () => void;
  onRestoreData: (jsonString: string) => void;
  onOpenHabitTracker: () => void;
  onOpenMoodTracker: (date: string) => void;
  habits: Habit[];
  habitLogs: HabitLog;
  userStats: UserStats;
  completionLog: CompletionLog;
  onToggleScheduleItem: (id: string, date: string) => void;
}

const DayView: React.FC<DayViewProps> = (props) => {
  const {
    schedule,
    selectedDay,
    editingId,
    isAdding,
    onSetSelectedDay,
    onSetEditingId,
    onSaveItem,
    onDeleteItem,
    onAddNewItem,
    onSaveNewItem,
    onCancelAddItem,
    onResetToDefault,
    onSetView,
    onExportToCSV,
    onExportToICS,
    selectedWeek,
    onSetSelectedWeek,
    templates,
    onAddTemplate,
    onBackupData,
    onRestoreData,
    onOpenHabitTracker,
    onOpenMoodTracker,
    habits,
    habitLogs,
    userStats,
    completionLog,
    onToggleScheduleItem,
  } = props;
  
  const { t } = useLocalization();
  const [focusItem, setFocusItem] = useState<ScheduleItem | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const NEW_ITEM_TEMPLATE: ScheduleItem = {
      id: 'new-item-placeholder',
      time: "12:00-13:00",
      duration: "1h",
      category: "personal",
      activity: "",
      notes: "",
  };

  const year = new Date().getFullYear();
  const startDate = getStartDateOfWeek(selectedWeek, year);
  const dayIndex = DAYS.indexOf(selectedDay);
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + dayIndex);
  const currentDateString = date.toISOString().split('T')[0];

  const handleOpenMoodTracker = () => {
    onOpenMoodTracker(currentDateString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pb-24 transition-colors duration-200">
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-md">
        <Header 
          onSetView={onSetView} 
          onResetToDefault={onResetToDefault} 
          onExportToCSV={onExportToCSV}
          onExportToICS={onExportToICS} 
          selectedWeek={selectedWeek}
          onSetSelectedWeek={onSetSelectedWeek}
          onShowAnalytics={() => setShowAnalytics(true)}
          onBackupData={onBackupData}
          onRestoreData={onRestoreData}
          onOpenHabitTracker={onOpenHabitTracker}
          onOpenMoodTracker={handleOpenMoodTracker}
          userStats={userStats}
        />
        <DayTabs selectedDay={selectedDay} onSetSelectedDay={onSetSelectedDay} />
      </div>
      
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        {schedule[selectedDay].map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            {editingId === item.id ? (
              <EditForm 
                item={item} 
                onSave={onSaveItem} 
                onCancel={() => onSetEditingId(null)} 
                templates={templates}
                onAddTemplate={onAddTemplate}
              />
            ) : (
              <ScheduleCard 
                item={item} 
                onEdit={onSetEditingId} 
                onDelete={onDeleteItem}
                onFocus={setFocusItem}
                isCompleted={completionLog[currentDateString]?.includes(item.id) || false}
                onToggle={() => onToggleScheduleItem(item.id, currentDateString)}
              />
            )}
          </div>
        ))}

        {isAdding && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fade-in-down">
            <EditForm 
              item={NEW_ITEM_TEMPLATE}
              onSave={onSaveNewItem} 
              onCancel={onCancelAddItem} 
              templates={templates}
              onAddTemplate={onAddTemplate}
            />
          </div>
        )}
      </main>

      <button
        onClick={() => { triggerHaptic('medium'); onAddNewItem(); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-transform hover:scale-110 active:scale-95 z-30"
        aria-label={t('addNewItem')}
      >
        <Plus className="w-8 h-8" />
      </button>

      {focusItem && (
        <FocusTimer 
          duration={focusItem.duration} 
          activity={focusItem.activity} 
          onClose={() => setFocusItem(null)} 
        />
      )}

      {showAnalytics && (
        <Analytics 
          schedule={schedule} 
          habits={habits}
          habitLogs={habitLogs}
          onClose={() => setShowAnalytics(false)} 
        />
      )}
    </div>
  );
};

export default DayView;
