import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import type { Schedule, Day, ScheduleItem, Habit, HabitLog, JournalLog, JournalEntry, UserStats, CompletionLog } from './types';
import { getInitialSchedule, DAYS, TEMPLATES } from './constants';
import DayView from './components/DayView';
import WeekView from './components/WeekView';
import Modal from './components/Modal';
import HabitTracker from './components/HabitTracker';
import MoodTracker from './components/MoodTracker';
import { parseTimeRange, doesOverlap, getWeekNumber, getStartDateOfWeek } from './utils/time';
import { requestNotificationPermissions, scheduleNotificationsForWeek } from './utils/native';

// --- Localization System ---
// To avoid creating new files as per the project constraints, the localization
// logic (translations, context, and hook) is included in this main App component file.

const translations: Record<string, Record<string, string>> = {
  en: {
    appName: "My Schedule",
    weekOverview: "Week Overview",
    exportToICal: "Export to iCal (.ics)",
    exportToCSV: "Export to CSV",
    resetToDefault: "Reset to Default",
    dayView: "Day View",
    home: "Day View",
    ical: "iCal",
    csv: "CSV",
    addNewItem: "Add new item",
    noActivities: "No activities scheduled for today.",
    addActivity: "Add an activity",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    activity: "Activity",
    timePlaceholder: "Time (e.g., 9:00-10:00)",
    durationPlaceholder: "Duration (e.g., 1h)",
    notes: "Notes",
    doesNotRepeat: "Does not repeat",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    repeatUntil: "until",
    schedulingConflictTitle: "Scheduling Conflict",
    schedulingConflictMessage: "The time slot {time} overlaps with an existing activity: \"{activity}\" ({conflictTime}). Please choose a different time.",
    confirmDeletionTitle: "Confirm Deletion",
    confirmDeletionMessage: "Are you sure you want to delete \"{activity}\"? This action cannot be undone.",
    resetConfirm: "Are you sure you want to reset to the default schedule? This cannot be undone.",
    ok: "OK",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    weeklyAnalytics: "Weekly Analytics",
    focusMode: "Focus Mode",
    noData: "No data available for this week.",
    saveAsTemplate: "Save as Template",
    "days.monday": "Monday",
    "days.tuesday": "Tuesday",
    "days.wednesday": "Wednesday",
    "days.thursday": "Thursday",
    "days.friday": "Friday",
    "days.saturday": "Saturday",
    "days.sunday": "Sunday",
    "categories.anchor": "Anchor",
    "categories.school": "School",
    "categories.gym": "Gym",
    "categories.deepwork": "Deep Work",
    "categories.maintenance": "Maintenance",
    "categories.recovery": "Recovery",
    "categories.transition": "Transition",
    "categories.personal": "Personal",
    "categories.social": "Social",
    "categories.church": "Church",
    "categories.planning": "Planning",
    backupData: "Backup Data",
    restoreData: "Restore Data",
    restoreConfirmTitle: "Confirm Restore",
    restoreConfirmMessage: "This will overwrite your current schedule and templates. Are you sure?",
    restoreSuccess: "Data restored successfully!",
    restoreError: "Invalid data file.",
    habitTracker: "Habit Tracker",
    dailyProgress: "Daily Progress",
    noHabitsYet: "No habits added yet. Start building your routine!",
    newHabitPlaceholder: "Enter new habit...",
    addHabit: "Add Habit",
    add: "Add",
    habitPerformance: "Habit Performance",
    timeDistribution: "Time Distribution",
    dailyJournal: "Daily Journal",
    howAreYouFeeling: "How are you feeling today?",
    saveEntry: "Save Entry",
    entrySaved: "Journal entry saved!",
    "mood.great": "Great",
    "mood.good": "Good",
    "mood.neutral": "Neutral",
    "mood.bad": "Bad",
    "mood.awful": "Awful",
    journalNote: "Journal Note",
    journalPlaceholder: "Write about your day...",
    xp: "XP",
    levelUp: "Level Up!",
    levelUpMessage: "Congratulations! You've reached level {level}!",
    streak: "Streak"
  },
  nl: {
    appName: "Mijn Schema",
    weekOverview: "Weekoverzicht",
    exportToICal: "Exporteer naar iCal (.ics)",
    exportToCSV: "Exporteer naar CSV",
    resetToDefault: "Reset naar standaard",
    dayView: "Dagweergave",
    home: "Dagweergave",
    ical: "iCal",
    csv: "CSV",
    addNewItem: "Nieuw item toevoegen",
    noActivities: "Geen activiteiten gepland voor vandaag.",
    addActivity: "Voeg een activiteit toe",
    save: "Opslaan",
    cancel: "Annuleren",
    edit: "Bewerken",
    delete: "Verwijderen",
    activity: "Activiteit",
    timePlaceholder: "Tijd (bijv. 9:00-10:00)",
    durationPlaceholder: "Duur (bijv. 1u)",
    notes: "Notities",
    doesNotRepeat: "Herhaalt niet",
    daily: "Dagelijks",
    weekly: "Wekelijks",
    monthly: "Maandelijks",
    repeatUntil: "tot",
    schedulingConflictTitle: "Planningsconflict",
    schedulingConflictMessage: "Het tijdslot {time} overlapt met een bestaande activiteit: \"{activity}\" ({conflictTime}). Kies een andere tijd.",
    confirmDeletionTitle: "Verwijdering bevestigen",
    confirmDeletionMessage: "Weet je zeker dat je \"{activity}\" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
    resetConfirm: "Weet je zeker dat je wilt resetten naar het standaardschema? Dit kan niet ongedaan worden gemaakt.",
    ok: "OK",
    darkMode: "Donkere Modus",
    lightMode: "Lichte Modus",
    weeklyAnalytics: "Wekelijkse Analyse",
    focusMode: "Focus Modus",
    noData: "Geen gegevens beschikbaar voor deze week.",
    saveAsTemplate: "Opslaan als sjabloon",
    "days.monday": "Maandag",
    "days.tuesday": "Dinsdag",
    "days.wednesday": "Woensdag",
    "days.thursday": "Donderdag",
    "days.friday": "Vrijdag",
    "days.saturday": "Zaterdag",
    "days.sunday": "Zondag",
    "categories.anchor": "Anker",
    "categories.school": "School",
    "categories.gym": "Sportschool",
    "categories.deepwork": "Diep Werk",
    "categories.maintenance": "Onderhoud",
    "categories.recovery": "Herstel",
    "categories.transition": "Overgang",
    "categories.personal": "Persoonlijk",
    "categories.social": "Sociaal",
    "categories.church": "Kerk",
    "categories.planning": "Planning",
    backupData: "Backup Gegevens",
    restoreData: "Herstel Gegevens",
    restoreConfirmTitle: "Herstel Bevestigen",
    restoreConfirmMessage: "Dit overschrijft je huidige schema en sjablonen. Weet je het zeker?",
    restoreSuccess: "Gegevens succesvol hersteld!",
    restoreError: "Ongeldig gegevensbestand.",
    habitTracker: "Gewoonte Tracker",
    dailyProgress: "Dagelijkse Voortgang",
    noHabitsYet: "Nog geen gewoontes toegevoegd. Begin met bouwen aan je routine!",
    newHabitPlaceholder: "Nieuwe gewoonte invoeren...",
    addHabit: "Gewoonte Toevoegen",
    add: "Toevoegen",
    habitPerformance: "Gewoonte Prestaties",
    timeDistribution: "Tijdsverdeling",
    dailyJournal: "Dagboek",
    howAreYouFeeling: "Hoe voel je je vandaag?",
    saveEntry: "Opslaan",
    entrySaved: "Dagboek item opgeslagen!",
    "mood.great": "Geweldig",
    "mood.good": "Goed",
    "mood.neutral": "Neutraal",
    "mood.bad": "Slecht",
    "mood.awful": "Verschrikkelijk",
    journalNote: "Dagboek Notitie",
    journalPlaceholder: "Schrijf over je dag...",
    xp: "XP",
    levelUp: "Niveau Omhoog!",
    levelUpMessage: "Gefeliciteerd! Je hebt niveau {level} bereikt!",
    streak: "Reeks"
  },
};

type Language = 'en' | 'nl';
interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: string;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

// --- Theme System ---

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- App Component ---

const AppContent: React.FC = () => {
  const { t, language, locale } = useLocalization();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [schedule, setSchedule] = useState<Schedule>(() => {
    try {
      const savedSchedule = localStorage.getItem('weekly-schedule');
      if (savedSchedule) return JSON.parse(savedSchedule);
    } catch (error) {
      console.error('Failed to parse schedule from localStorage.', error);
    }
    return getInitialSchedule(language);
  });

  useEffect(() => {
    // Request notification permissions on mount
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    // Save schedule to local storage whenever it changes
    try {
      localStorage.setItem('weekly-schedule', JSON.stringify(schedule));
      // Schedule notifications whenever schedule changes
      scheduleNotificationsForWeek(schedule);
    } catch (error) {
      console.error('Failed to save schedule to localStorage:', error);
    }
  }, [schedule]);

  const [selectedDay, setSelectedDay] = useState<Day>('monday');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedWeek, setSelectedWeek] = useState(() => getWeekNumber(new Date()));
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '' });

  const [templates, setTemplates] = useState<Partial<ScheduleItem>[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('templates');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return TEMPLATES;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('habits');
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const [habitLogs, setHabitLogs] = useState<HabitLog>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('habitLogs');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  const [journalLogs, setJournalLogs] = useState<JournalLog>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('journalLogs');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userStats');
      if (saved) return JSON.parse(saved);
    }
    return { xp: 0, level: 1, streak: 0, lastActiveDate: new Date().toISOString().split('T')[0] };
  });

  const [completionLog, setCompletionLog] = useState<CompletionLog>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completionLog');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habitLogs', JSON.stringify(habitLogs));
  }, [habitLogs]);

  useEffect(() => {
    localStorage.setItem('journalLogs', JSON.stringify(journalLogs));
  }, [journalLogs]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('completionLog', JSON.stringify(completionLog));
  }, [completionLog]);

  const handleAddHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleToggleHabit = (id: string, date: string) => {
    setHabitLogs(prev => {
      const currentDayLogs = prev[date] || [];
      const isCompleted = currentDayLogs.includes(id);
      
      let newDayLogs;
      if (isCompleted) {
        newDayLogs = currentDayLogs.filter(hId => hId !== id);
      } else {
        newDayLogs = [...currentDayLogs, id];
      }

      return {
        ...prev,
        [date]: newDayLogs
      };
    });
  };

  const handleAddTemplate = (template: Partial<ScheduleItem>) => {
    setTemplates(prev => [...prev, template]);
  };

  const handleSetEditingId = (id: string | null) => {
    setEditingId(id);
    if (id !== null) {
      setIsAdding(false);
    }
  };

  const handleSaveItem = (updatedItem: ScheduleItem) => {
    if (editingId === null) return;
    
    const newRange = parseTimeRange(updatedItem.time);
    if (newRange) {
      const conflict = schedule[selectedDay].find(item => {
        if (item.id === editingId) return false;
        const existingRange = parseTimeRange(item.time);
        return existingRange ? doesOverlap(newRange, existingRange) : false;
      });

      if (conflict) {
        setErrorModal({
          isOpen: true,
          title: t('schedulingConflictTitle'),
          message: t('schedulingConflictMessage', {
            time: updatedItem.time,
            activity: conflict.activity,
            conflictTime: conflict.time
          }),
        });
        return;
    }
  }

    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [selectedDay]: prevSchedule[selectedDay].map(item => item.id === editingId ? updatedItem : item)
    }));
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = schedule[selectedDay].find(item => item.id === id);
    if (!itemToDelete) return;
  
    const confirmAction = () => {
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [selectedDay]: prevSchedule[selectedDay].filter(item => item.id !== id)
      }));
      closeConfirmModal();
    };
  
    setConfirmModal({
      isOpen: true,
      title: t('confirmDeletionTitle'),
      message: t('confirmDeletionMessage', { activity: itemToDelete.activity }),
      onConfirm: confirmAction
    });
  };
  
  const handleAddNewItem = () => {
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSaveNewItem = (newItem: ScheduleItem) => {
    const newRange = parseTimeRange(newItem.time);
    if (newRange) {
      const conflict = schedule[selectedDay].find(item => {
        const existingRange = parseTimeRange(item.time);
        return existingRange ? doesOverlap(newRange, existingRange) : false;
      });

      if (conflict) {
        setErrorModal({
          isOpen: true,
          title: t('schedulingConflictTitle'),
          message: t('schedulingConflictMessage', {
            time: newItem.time,
            activity: conflict.activity,
            conflictTime: conflict.time
          }),
        });
        return;
      }
    }

    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [selectedDay]: [...prevSchedule[selectedDay], { ...newItem, id: new Date().toISOString() }]
    }));
    setIsAdding(false);
  };
  
  const handleCancelAddItem = () => {
    setIsAdding(false);
  };

  const handleResetToDefault = () => {
    if (window.confirm(t('resetConfirm'))) {
      const defaultSchedule = getInitialSchedule(language);
      setSchedule(defaultSchedule);
    }
  };

  const handleExportToCSV = () => {
    const escapeCsvCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
    
    const headers = ['Day', 'Time', 'Duration', 'Category', 'Activity', 'Notes'];
    const csvRows = [headers.join(',')];

    DAYS.forEach(day => {
      schedule[day].forEach(item => {
        const row = [
          t(`days.${day}`),
          item.time,
          item.duration,
          item.category,
          item.activity,
          item.notes
        ].map(escapeCsvCell);
        csvRows.push(row.join(','));
      });
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `weekly-schedule-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportToICS = () => {
    const toICSDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const toICSUntilDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const parseTimeAndDuration = (item: ScheduleItem, eventDate: Date): [Date, Date] | null => {
        const startDate = new Date(eventDate);
        const endDate = new Date(eventDate);
        const range = parseTimeRange(item.time);
        if (range) {
            startDate.setHours(Math.floor(range[0] / 60), range[0] % 60, 0, 0);
            endDate.setHours(Math.floor(range[1] / 60), range[1] % 60, 0, 0);
            return [startDate, endDate];
        }

        let startHours = 9, startMinutes = 0;
        if (item.time.toLowerCase() === 'morning') { startHours = 9; }
        else if (item.time.toLowerCase() === 'midday') { startHours = 12; }
        else if (item.time.toLowerCase() === 'afternoon') { startHours = 14; }
        else { return null; }

        const durationMatch = item.duration.match(/(?:(\d+)h)?(?:(\d+)m)?/);
        let durationInMinutes = 60;
        if (durationMatch) {
            const hours = parseInt(durationMatch[1] || '0', 10);
            const minutes = parseInt(durationMatch[2] || '0', 10);
            if (hours > 0 || minutes > 0) {
              durationInMinutes = (hours * 60) + minutes;
            }
        }
        
        startDate.setHours(startHours, startMinutes, 0, 0);
        endDate.setTime(startDate.getTime() + durationInMinutes * 60 * 1000);
        return [startDate, endDate];
    };

    let icsString = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MyScheduleApp//EN',
    ].join('\r\n');
    
    const weekStartDate = getStartDateOfWeek(selectedWeek, new Date().getFullYear());

    DAYS.forEach((day, dayIndex) => {
      schedule[day].forEach(item => {
        const eventDate = new Date(weekStartDate);
        eventDate.setDate(weekStartDate.getDate() + dayIndex);
        const dates = parseTimeAndDuration(item, eventDate);
        if (!dates) return;
        const [startDate, endDate] = dates;
        const eventParts = [
          'BEGIN:VEVENT', `DTSTAMP:${toICSDate(new Date())}`, `UID:${item.id}@myschedule.app`,
          `DTSTART:${toICSDate(startDate)}`, `DTEND:${toICSDate(endDate)}`, `SUMMARY:${item.activity}`,
          `DESCRIPTION:${item.notes.replace(/\n/g, '\\n')}`,
        ];
        if (item.recurrence && item.recurrence !== 'none') {
            let rrule = `RRULE:FREQ=${item.recurrence.toUpperCase()}`;
            if (item.recurrenceEndDate) {
                rrule += `;UNTIL=${toICSUntilDate(item.recurrenceEndDate)}`;
            }
            eventParts.push(rrule);
        }
        eventParts.push('END:VEVENT');
        icsString += '\r\n' + eventParts.join('\r\n');
      });
    });
    icsString += '\r\nEND:VCALENDAR';

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'weekly-schedule.ics');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBackupData = () => {
    const data = {
      version: 1,
      timestamp: new Date().toISOString(),
      schedule,
      templates,
      habits,
      habitLogs,
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `schedule-backup-${date}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestoreData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      
      // Basic validation
      if (!data.schedule || !data.templates) {
        throw new Error('Invalid backup file format');
      }

      const confirmAction = () => {
        setSchedule(data.schedule);
        setTemplates(data.templates);
        if (data.habits) setHabits(data.habits);
        if (data.habitLogs) setHabitLogs(data.habitLogs);
        closeConfirmModal();
        alert(t('restoreSuccess'));
      };

      setConfirmModal({
        isOpen: true,
        title: t('restoreConfirmTitle'),
        message: t('restoreConfirmMessage'),
        onConfirm: confirmAction
      });

    } catch (e) {
      console.error('Restore failed:', e);
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: t('restoreError')
      });
    }
  };

  const closeErrorModal = () => setErrorModal({ isOpen: false, title: '', message: '' });
  const closeConfirmModal = () => setConfirmModal({ isOpen: false, title: '', message: '' });

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    setJournalLogs(prev => ({
      ...prev,
      [entry.date]: entry
    }));
    setMoodTrackerDate(null);
  };

  const addXP = (amount: number) => {
    setUserStats(prev => {
      const newXP = Math.max(0, prev.xp + amount); // Prevent negative XP
      const nextLevelXP = prev.level * 100;
      let newLevel = prev.level;
      
      if (newXP >= nextLevelXP) {
        newLevel += 1;
        triggerHaptic('success');
        setErrorModal({
            isOpen: true,
            title: t('levelUp'),
            message: t('levelUpMessage', { level: newLevel })
        });
      }

      // Update streak logic
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.streak;
      if (today !== prev.lastActiveDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (prev.lastActiveDate === yesterdayStr) {
              newStreak += 1;
          } else if (prev.lastActiveDate !== today) {
              newStreak = 1; 
          }
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today
      };
    });
  };

  const handleToggleScheduleItem = (id: string, date: string) => {
      setCompletionLog(prev => {
          const currentDayLogs = prev[date] || [];
          const isCompleted = currentDayLogs.includes(id);
          
          let newDayLogs;
          if (isCompleted) {
              newDayLogs = currentDayLogs.filter(itemId => itemId !== id);
              addXP(-10); 
          } else {
              newDayLogs = [...currentDayLogs, id];
              addXP(10); 
          }
          
          return {
              ...prev,
              [date]: newDayLogs
          };
      });
  };

  return (
    <>
      {view === 'week' ? (
        <WeekView
          schedule={schedule}
          setView={setView}
          onExportToCSV={handleExportToCSV}
          onExportToICS={handleExportToICS}
          selectedWeek={selectedWeek}
          onSetSelectedWeek={setSelectedWeek}
          onOpenHabitTracker={() => setShowHabitTracker(true)}
        />
      ) : (
        <DayView 
          schedule={schedule}
          selectedDay={selectedDay}
          editingId={editingId}
          isAdding={isAdding}
          onSetSelectedDay={setSelectedDay}
          onSetEditingId={handleSetEditingId}
          onSaveItem={handleSaveItem}
          onDeleteItem={handleDeleteItem}
          onAddNewItem={handleAddNewItem}
          onSaveNewItem={handleSaveNewItem}
          onCancelAddItem={handleCancelAddItem}
          onResetToDefault={handleResetToDefault}
          onSetView={setView}
          onExportToCSV={handleExportToCSV}
          onExportToICS={handleExportToICS}
          selectedWeek={selectedWeek}
          onSetSelectedWeek={setSelectedWeek}
          templates={templates}
          onAddTemplate={handleAddTemplate}
          onBackupData={handleBackupData}
          onRestoreData={handleRestoreData}
          onOpenHabitTracker={() => setShowHabitTracker(true)}
          onOpenMoodTracker={setMoodTrackerDate}
          habits={habits}
          habitLogs={habitLogs}
        />
      )}
      
      {showHabitTracker && (
        <HabitTracker
          habits={habits}
          habitLogs={habitLogs}
          onAddHabit={handleAddHabit}
          onDeleteHabit={handleDeleteHabit}
          onToggleHabit={handleToggleHabit}
          onClose={() => setShowHabitTracker(false)}
        />
      )}
      {moodTrackerDate && (
        <MoodTracker
          date={moodTrackerDate}
          entry={journalLogs[moodTrackerDate]}
          onSave={handleSaveJournalEntry}
          onClose={() => setMoodTrackerDate(null)}
        />
      )}

      <Modal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
      />
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={t('delete')}
      />
    </>
  );
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const browserLang = navigator.language.split(/[-_]/)[0];
    return browserLang === 'nl' ? 'nl' : 'en';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev: boolean) => !prev);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => {
    let translation = translations[language][key] || translations['en'][key] || key;
    if (vars) {
      Object.keys(vars).forEach(varKey => {
        const regex = new RegExp(`{${varKey}}`, 'g');
        translation = translation.replace(regex, String(vars[varKey]));
      });
    }
    return translation;
  }, [language]);

  const localizationContextValue: LocalizationContextType = {
    language,
    setLanguage,
    t,
    locale: language === 'nl' ? 'nl-NL' : 'en-US'
  };
  
  return (
    <LocalizationContext.Provider value={localizationContextValue}>
      <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <AppContent />
        </div>
      </ThemeContext.Provider>
    </LocalizationContext.Provider>
  );
};

export default App;