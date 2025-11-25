
import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import type { ScheduleItem } from '../types';
import { CATEGORY_STYLES, CATEGORY_ICONS } from '../constants';
import { Clock, Edit2, Trash2, Repeat, Play, Check } from './icons';
import { useLocalization } from '../App';
import { triggerHaptic } from '../utils/native';

interface ScheduleCardProps {
  item: ScheduleItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onFocus: (item: ScheduleItem) => void;
  isCompleted?: boolean;
  onToggle?: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ item, onEdit, onDelete, onFocus, isCompleted, onToggle }) => {
  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.personal;
  const { t, locale } = useLocalization();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      triggerHaptic('medium');
      onDelete(item.id);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      className={`relative overflow-hidden touch-pan-y`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Swipe Background */}
      <div className="absolute inset-y-0 right-0 w-full bg-red-500 flex items-center justify-end px-6">
        <Trash2 className="w-6 h-6 text-white" />
      </div>

      <motion.div
        className={`relative p-4 border-l-4 ${style.border} bg-white dark:bg-gray-800 transition-colors duration-200`}
        style={{ x: 0 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.7, right: 0.1 }}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {onToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('light');
                  onToggle();
                }}
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                }`}
              >
                {isCompleted && <Check className="w-4 h-4 text-white" />}
              </button>
            )}
            <span className="text-2xl mt-1">{CATEGORY_ICONS[item.category]}</span>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg ${style.text} dark:text-white truncate`}>{item.activity}</h3>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                      <Repeat className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span>{t(item.recurrence)}</span>
                      {item.recurrenceEndDate && <span>{t('repeatUntil')} {new Date(item.recurrenceEndDate + 'T00:00:00').toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
                    </div>
                  </>
                )}
              </div>
              {item.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">{item.notes}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-1">
            <button
              onClick={() => { triggerHaptic('light'); onFocus(item); }}
              className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label={t('focusMode')}
            >
              <Play className="w-5 h-5" />
            </button>
            <button
              onClick={() => { triggerHaptic('light'); onEdit(item.id); }}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label={t('edit')}
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => { triggerHaptic('medium'); onDelete(item.id); }}
              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label={t('delete')}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScheduleCard;
