import React, { useState, useEffect, useRef } from 'react';
import type { ScheduleItem, Category } from '../types';
import { CATEGORY_STYLES } from '../constants';
import { Save, X, Clock } from './icons';
import { useLocalization } from '../App';
import { parseTimeRange, formatDuration } from '../utils/time';

// --- TimeRangePicker Component (inlined for project constraints) ---

interface Time {
  hour: number;
  minute: number;
}

interface TimeRangePickerProps {
  isOpen: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (timeRange: string) => void;
}

const minutes: number[] = [0, 15, 30, 45];

const ClockFace: React.FC<{
  onSelectHour: (hour: number) => void;
  selectedHour: number | null;
}> = ({ onSelectHour, selectedHour }) => {
  const R_OUTER = 100;
  const R_INNER = 65;
  
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12

  return (
    <div className="relative w-64 h-64 mx-auto my-4" role="listbox" aria-label="Hour selector">
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full" />
      
      {/* Outer ring (PM hours: 13-23 and 12) */}
      {hours.map((h) => {
        const hour24 = h === 12 ? 12 : h + 12; // 1 -> 13, 11 -> 23, 12 -> 12
        const angle = (h / 6) * Math.PI - Math.PI / 2;
        const x = R_OUTER * Math.cos(angle);
        const y = R_OUTER * Math.sin(angle);
        const isSelected = selectedHour === hour24;
        return (
          <button
            key={`h-outer-${h}`}
            type="button"
            onClick={() => onSelectHour(hour24)}
            className={`absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSelected ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'}`}
            style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
            aria-label={`${h} PM`}
          >
            {h}
          </button>
        );
      })}

      {/* Inner ring (AM hours: 1-11 and 00) */}
      {hours.map((h) => {
        const hour24 = h === 12 ? 0 : h; // 1 -> 1, 11 -> 11, 12 -> 00
        const displayHour = h === 12 ? '00' : h;
        const angle = (h / 6) * Math.PI - Math.PI / 2;
        const x = R_INNER * Math.cos(angle);
        const y = R_INNER * Math.sin(angle);
        const isSelected = selectedHour === hour24;
        return (
          <button
            key={`h-inner-${h}`}
            type="button"
            onClick={() => onSelectHour(hour24)}
            className={`absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSelected ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'}`}
            style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
            aria-label={`${displayHour} AM`}
          >
            {displayHour}
          </button>
        );
      })}
    </div>
  );
};


const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ isOpen, initialValue, onClose, onSave }) => {
  const { t } = useLocalization();

  const parseTime = (timeStr: string): Time => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const roundedMinute = minutes.reduce((prev, curr) =>
      (Math.abs(curr - (minute || 0)) < Math.abs(prev - (minute || 0)) ? curr : prev)
    );
    return { hour: hour || 0, minute: roundedMinute };
  };

  const parseInitTimeRange = (timeRange: string): [Time, Time] => {
    const parts = timeRange.split('-');
    if (parts.length === 2 && parts[0] && parts[1]) {
      const start = parseTime(parts[0]);
      const end = parseTime(parts[1]);
      if ((start.hour * 60 + start.minute) < (end.hour * 60 + end.minute)) {
        return [start, end];
      }
    }
    return [{ hour: 9, minute: 0 }, { hour: 10, minute: 0 }];
  };

  const [startTime, setStartTime] = useState<Time>(() => parseInitTimeRange(initialValue)[0]);
  const [endTime, setEndTime] = useState<Time>(() => parseInitTimeRange(initialValue)[1]);
  const [activeSelector, setActiveSelector] = useState<'start' | 'end'>('start');
  const [selectionStage, setSelectionStage] = useState<'hour' | 'minute'>('hour');

  useEffect(() => {
    if (isOpen) {
      const [start, end] = parseInitTimeRange(initialValue);
      setStartTime(start);
      setEndTime(end);
      setActiveSelector('start');
      setSelectionStage('hour');
    }
  }, [initialValue, isOpen]);
  
  const formatTimeToStr = (time: Time) => `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;

  const handleSelectHour = (hour: number) => {
    if (activeSelector === 'start') {
      const newStartTime = { ...startTime, hour };
      setStartTime(newStartTime);
      
      const startTotalMinutes = newStartTime.hour * 60 + newStartTime.minute;
      const endTotalMinutes = endTime.hour * 60 + endTime.minute;

      if (startTotalMinutes >= endTotalMinutes) {
          const newEndTotalMinutes = startTotalMinutes + 60;
          setEndTime({
              hour: Math.floor(newEndTotalMinutes / 60) % 24,
              minute: newEndTotalMinutes % 60,
          });
      }

    } else { // 'end'
      const newEndTime = { ...endTime, hour };
      const startTotalMinutes = startTime.hour * 60 + startTime.minute;
      const endTotalMinutes = newEndTime.hour * 60 + newEndTime.minute;
      
      if(endTotalMinutes > startTotalMinutes){
        setEndTime(newEndTime);
      }
    }
    setSelectionStage('minute');
  };

  const handleSelectMinute = (minute: number) => {
    if (activeSelector === 'start') {
      const newStartTime = { ...startTime, minute };
      setStartTime(newStartTime);
      
      const startTotalMinutes = newStartTime.hour * 60 + newStartTime.minute;
      const endTotalMinutes = endTime.hour * 60 + endTime.minute;

      if (startTotalMinutes >= endTotalMinutes) {
          const newEndTotalMinutes = startTotalMinutes + 60;
          setEndTime({
              hour: Math.floor(newEndTotalMinutes / 60) % 24,
              minute: newEndTotalMinutes % 60,
          });
      }

      setActiveSelector('end');
      setSelectionStage('hour');
    } else { // 'end'
      const newEndTime = { ...endTime, minute };
      const startTotalMinutes = startTime.hour * 60 + startTime.minute;
      const endTotalMinutes = newEndTime.hour * 60 + newEndTime.minute;
      if(endTotalMinutes > startTotalMinutes){
        setEndTime(newEndTime);
        // Defer saving to allow user to review before modal closes
        // handleSave(); // Auto-save on completing end time can be jarring
      }
    }
  };

  const handleSave = () => {
    onSave(`${formatTimeToStr(startTime)}-${formatTimeToStr(endTime)}`);
  };

  if (!isOpen) return null;

  const currentSelectedHour = activeSelector === 'start' ? startTime.hour : endTime.hour;
  const currentSelectedMinute = activeSelector === 'start' ? startTime.minute : endTime.minute;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-around items-center mb-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Start Time</p>
            <button
              onClick={() => { setActiveSelector('start'); setSelectionStage('hour'); }}
              className={`text-4xl font-bold p-2 rounded-lg transition-colors w-40 ${activeSelector === 'start' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'}`}
              aria-label={`Selected start time: ${formatTimeToStr(startTime)}. Click to edit.`}
            >
              {formatTimeToStr(startTime)}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">End Time</p>
            <button
              onClick={() => { setActiveSelector('end'); setSelectionStage('hour'); }}
              className={`text-4xl font-bold p-2 rounded-lg transition-colors w-40 ${activeSelector === 'end' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'}`}
              aria-label={`Selected end time: ${formatTimeToStr(endTime)}. Click to edit.`}
            >
              {formatTimeToStr(endTime)}
            </button>
          </div>
        </div>

        {selectionStage === 'hour' ? (
          <ClockFace onSelectHour={handleSelectHour} selectedHour={currentSelectedHour} />
        ) : (
          <div className="h-64 flex flex-col items-center justify-center my-4">
            <div className="grid grid-cols-2 gap-4">
              {minutes.map(m => {
                const isSelected = currentSelectedMinute === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectMinute(m)}
                    className={`w-24 h-16 flex items-center justify-center text-xl font-semibold rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-300'}`}
                    aria-label={`Select ${m} minutes.`}
                  >
                    :{String(m).padStart(2, '0')}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            {t('cancel')}
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Set Time
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main EditForm Component ---

interface EditFormProps {
  item: ScheduleItem;
  onSave: (item: ScheduleItem) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ item, onSave, onCancel }) => {
  const [editForm, setEditForm] = useState<ScheduleItem>(item);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const { t } = useLocalization();

  useEffect(() => {
    setEditForm(item);
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const newForm = { ...prev, [name]: value };
      if (name === 'recurrence' && value === 'none') {
        newForm.recurrenceEndDate = undefined;
      }
      return newForm;
    });
  };

  const handleTimeChange = (newTime: string) => {
    const range = parseTimeRange(newTime);
    let newDuration = editForm.duration;
    if (range) {
      const [startMinutes, endMinutes] = range;
      newDuration = formatDuration(endMinutes - startMinutes);
    }

    setEditForm(prev => ({
      ...prev,
      time: newTime,
      duration: newDuration,
    }));
    setIsTimePickerOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editForm);
  };
  
  return (
    <>
      <form onSubmit={handleSave} className="p-4 bg-gray-50 dark:bg-gray-700 space-y-3 transition-colors duration-200">
        <input
          type="text"
          name="activity"
          value={editForm.activity}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('activity')}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsTimePickerOpen(true)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span className={editForm.time ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
              {editForm.time || t('timePlaceholder')}
            </span>
          </button>
          <input
            type="text"
            name="duration"
            value={editForm.duration}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            placeholder={t('durationPlaceholder')}
          />
        </div>
        <select
          name="category"
          value={editForm.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {Object.keys(CATEGORY_STYLES).map(cat => (
            <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
          ))}
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            name="recurrence"
            value={editForm.recurrence || 'none'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="none">{t('doesNotRepeat')}</option>
            <option value="daily">{t('daily')}</option>
            <option value="weekly">{t('weekly')}</option>
            <option value="monthly">{t('monthly')}</option>
          </select>
          {editForm.recurrence && editForm.recurrence !== 'none' && (
            <div className="relative pt-2">
              <label htmlFor="recurrenceEndDate" className="absolute -top-0.5 left-2 -mt-px inline-block bg-gray-50 dark:bg-gray-700 px-1 text-xs font-medium text-gray-500 dark:text-gray-400">{t('repeatUntil')}</label>
              <input
                id="recurrenceEndDate"
                type="date"
                name="recurrenceEndDate"
                value={editForm.recurrenceEndDate || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}
        </div>
        <textarea
          name="notes"
          value={editForm.notes}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('notes')}
          rows={2}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('save')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
            {t('cancel')}
          </button>
        </div>
      </form>
      <TimeRangePicker
        isOpen={isTimePickerOpen}
        initialValue={editForm.time}
        onClose={() => setIsTimePickerOpen(false)}
        onSave={handleTimeChange}
      />
    </>
  );
};

export default EditForm;
