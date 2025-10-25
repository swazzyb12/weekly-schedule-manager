
import React, { useState, useEffect } from 'react';
import type { ScheduleItem, Category } from '../types';
import { CATEGORY_STYLES } from '../constants';
import { Save, X } from './icons';
import { useLocalization } from '../App';

interface EditFormProps {
  item: ScheduleItem;
  onSave: (item: ScheduleItem) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ item, onSave, onCancel }) => {
  const [editForm, setEditForm] = useState<ScheduleItem>(item);
  const { t } = useLocalization();

  useEffect(() => {
    setEditForm(item);
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const newForm = { ...prev, [name]: value };
      if (name === 'recurrence' && value === 'none') {
        newForm.recurrenceEndDate = '';
      }
      return newForm;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editForm);
  };
  
  return (
    <form onSubmit={handleSave} className="p-4 bg-gray-50 space-y-3">
      <input
        type="text"
        name="activity"
        value={editForm.activity}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={t('activity')}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          name="time"
          value={editForm.time}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('timePlaceholder')}
        />
        <input
          type="text"
          name="duration"
          value={editForm.duration}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('durationPlaceholder')}
        />
      </div>
       <select
        name="category"
        value={editForm.category}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="none">{t('doesNotRepeat')}</option>
          <option value="daily">{t('daily')}</option>
          <option value="weekly">{t('weekly')}</option>
          <option value="monthly">{t('monthly')}</option>
        </select>
        {editForm.recurrence && editForm.recurrence !== 'none' && (
          <div className="relative pt-2">
            <label htmlFor="recurrenceEndDate" className="absolute -top-0.5 left-2 -mt-px inline-block bg-gray-50 px-1 text-xs font-medium text-gray-500">{t('repeatUntil')}</label>
            <input
              id="recurrenceEndDate"
              type="date"
              name="recurrenceEndDate"
              value={editForm.recurrenceEndDate || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>
      <textarea
        name="notes"
        value={editForm.notes}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  );
};

export default EditForm;
