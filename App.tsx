import React, { useState, useEffect } from 'react';
import type { Schedule, Day, ScheduleItem } from './types';
import { INITIAL_SCHEDULE, DAYS } from './constants';
import DayView from './components/DayView';
import WeekView from './components/WeekView';
import Modal from './components/Modal';
import { parseTimeRange, doesOverlap } from './utils/time';

const App: React.FC = () => {
  const [schedule, setSchedule] = useState<Schedule>(INITIAL_SCHEDULE);
  const [selectedDay, setSelectedDay] = useState<Day>('monday');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [view, setView] = useState<'day' | 'week'>('day');
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    const loadSchedule = () => {
      try {
        const savedSchedule = localStorage.getItem('weekly-schedule');
        if (savedSchedule) {
          setSchedule(JSON.parse(savedSchedule));
        } else {
          setSchedule(INITIAL_SCHEDULE);
        }
      } catch (error) {
        console.error('Failed to load schedule from localStorage, using default.', error);
        setSchedule(INITIAL_SCHEDULE);
      }
    };
    loadSchedule();
  }, []);
  
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
      // Check for conflicts with other items on the same day
      const conflict = schedule[selectedDay].find(item => {
        // Exclude the item being edited from the check
        if (item.id === editingId) return false;
        
        const existingRange = parseTimeRange(item.time);
        return existingRange ? doesOverlap(newRange, existingRange) : false;
      });

      if (conflict) {
        setErrorModal({
          isOpen: true,
          title: 'Scheduling Conflict',
          message: `The time slot ${updatedItem.time} overlaps with an existing activity: "${conflict.activity}" (${conflict.time}). Please choose a different time.`,
        });
        return; // Abort save
      }
    }

    setSchedule(prevSchedule => {
      const newDaySchedule = prevSchedule[selectedDay].map((item) =>
        item.id === editingId ? updatedItem : item
      );
      const newSchedule = { ...prevSchedule, [selectedDay]: newDaySchedule };
      try {
        localStorage.setItem('weekly-schedule', JSON.stringify(newSchedule));
      } catch (error) {
        console.error('Failed to save schedule:', error);
      }
      return newSchedule;
    });

    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setSchedule(prevSchedule => {
        const newDaySchedule = prevSchedule[selectedDay].filter((item) => item.id !== id);
        const newSchedule = { ...prevSchedule, [selectedDay]: newDaySchedule };
        try {
          localStorage.setItem('weekly-schedule', JSON.stringify(newSchedule));
        } catch (error) {
          console.error('Failed to save schedule:', error);
        }
        return newSchedule;
      });
    }
  };
  
  const handleAddNewItem = () => {
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSaveNewItem = (newItem: ScheduleItem) => {
    const newRange = parseTimeRange(newItem.time);
    if (newRange) {
      // Check for conflicts with all existing items on the same day
      const conflict = schedule[selectedDay].find(item => {
        const existingRange = parseTimeRange(item.time);
        return existingRange ? doesOverlap(newRange, existingRange) : false;
      });

      if (conflict) {
        setErrorModal({
          isOpen: true,
          title: 'Scheduling Conflict',
          message: `The time slot ${newItem.time} overlaps with an existing activity: "${conflict.activity}" (${conflict.time}). Please choose a different time.`,
        });
        return; // Abort save
      }
    }

    setSchedule(prevSchedule => {
      const itemWithId = { ...newItem, id: new Date().toISOString() };
      const newDaySchedule = [...prevSchedule[selectedDay], itemWithId];
      const newSchedule = { ...prevSchedule, [selectedDay]: newDaySchedule };
      try {
        localStorage.setItem('weekly-schedule', JSON.stringify(newSchedule));
      } catch (error) {
        console.error('Failed to save schedule:', error);
      }
      return newSchedule;
    });
    setIsAdding(false);
  };
  
  const handleCancelAddItem = () => {
    setIsAdding(false);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to the default schedule? This cannot be undone.')) {
      try {
        localStorage.setItem('weekly-schedule', JSON.stringify(INITIAL_SCHEDULE));
        setSchedule(INITIAL_SCHEDULE);
      } catch (error) {
        console.error('Failed to save schedule:', error);
      }
    }
  };

  const handleExportToCSV = () => {
    const escapeCsvCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
    
    const headers = ['Day', 'Time', 'Duration', 'Category', 'Activity', 'Notes'];
    const csvRows = [headers.join(',')];

    DAYS.forEach(day => {
      schedule[day].forEach(item => {
        const row = [
          day.charAt(0).toUpperCase() + day.slice(1),
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
        // Create date in UTC to avoid timezone shifts, set to end of day
        const date = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const getWeekStartDate = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
        const monday = new Date(today.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday;
    };
    
    const parseTimeAndDuration = (item: ScheduleItem, eventDate: Date): [Date, Date] | null => {
        const startDate = new Date(eventDate);
        const endDate = new Date(eventDate);

        // First, try to parse HH:MM-HH:MM format
        const range = parseTimeRange(item.time);
        if (range) {
            startDate.setHours(Math.floor(range[0] / 60), range[0] % 60, 0, 0);
            endDate.setHours(Math.floor(range[1] / 60), range[1] % 60, 0, 0);
            return [startDate, endDate];
        }

        // Fallback for vague times like "Morning"
        let startHours = 9, startMinutes = 0;
        if (item.time.toLowerCase() === 'morning') { startHours = 9; }
        else if (item.time.toLowerCase() === 'midday') { startHours = 12; }
        else if (item.time.toLowerCase() === 'afternoon') { startHours = 14; }
        else { return null; } // Skip items with flexible/unparsable time

        const durationMatch = item.duration.match(/(?:(\d+)h)?(?:(\d+)m)?/);
        let durationInMinutes = 60; // Default to 1 hr if not specified
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
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MyScheduleApp//EN',
    ].join('\r\n');
    
    const weekStartDate = getWeekStartDate();

    DAYS.forEach((day, dayIndex) => {
      schedule[day].forEach(item => {
        const eventDate = new Date(weekStartDate);
        eventDate.setDate(weekStartDate.getDate() + dayIndex);

        const dates = parseTimeAndDuration(item, eventDate);
        if (!dates) return; // Skip if time cannot be parsed

        const [startDate, endDate] = dates;

        const eventParts = [
          'BEGIN:VEVENT',
          `DTSTAMP:${toICSDate(new Date())}`,
          `UID:${item.id}@myschedule.app`,
          `DTSTART:${toICSDate(startDate)}`,
          `DTEND:${toICSDate(endDate)}`,
          `SUMMARY:${item.activity}`,
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
        
        const event = eventParts.join('\r\n');
        icsString += '\r\n' + event;
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

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: '', message: '' });
  };

  return (
    <>
      {view === 'week' ? (
        <WeekView
          schedule={schedule}
          setView={setView}
          onExportToCSV={handleExportToCSV}
          onExportToICS={handleExportToICS}
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
        />
      )}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
      />
    </>
  );
};

export default App;