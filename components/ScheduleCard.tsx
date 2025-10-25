
import React from 'react';
import type { ScheduleItem } from '../types';
import { CATEGORY_STYLES, CATEGORY_ICONS } from '../constants';
import { Clock, Edit2, Trash2, Repeat } from './icons';
import { useLocalization } from '../App';

interface ScheduleCardProps {
  item: ScheduleItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ item, onEdit, onDelete }) => {
  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.personal;
  const { t, locale } = useLocalization();

  return (
    <div className={`p-4 border-l-4 ${style.border} bg-white`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl mt-1">{CATEGORY_ICONS[item.category]}</span>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-lg ${style.text} truncate`}>{item.activity}</h3>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{item.time}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>{item.duration}</span>
              {item.recurrence && item.recurrence !== 'none' && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5 capitalize">
                    <Repeat className="w-4 h-4 text-gray-500" />
                    <span>{t(item.recurrence)}</span>
                    {item.recurrenceEndDate && <span>{t('repeatUntil')} {new Date(item.recurrenceEndDate + 'T00:00:00').toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
                  </div>
                </>
              )}
            </div>
            {item.notes && (
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{item.notes}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-1">
          <button
            onClick={() => onEdit(item.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            aria-label={t('edit')}
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label={t('delete')}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
