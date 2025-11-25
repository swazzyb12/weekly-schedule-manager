import React, { useMemo } from 'react';
import type { Schedule } from '../types';
import { CATEGORY_STYLES, CATEGORY_ICONS, DAYS } from '../constants';
import { useLocalization } from '../App';
import { parseTimeRange } from '../utils/time';

interface AnalyticsProps {
  schedule: Schedule;
  onClose: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ schedule, onClose }) => {
  const { t } = useLocalization();

  const stats = useMemo(() => {
    const categoryDurations: Record<string, number> = {};
    let totalMinutes = 0;

    DAYS.forEach(day => {
      schedule[day].forEach(item => {
        const { start, end } = parseTimeRange(item.time);
        let duration = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute);
        if (duration < 0) duration += 24 * 60; // Handle overnight? Assuming no for now based on constraints
        
        categoryDurations[item.category] = (categoryDurations[item.category] || 0) + duration;
        totalMinutes += duration;
      });
    });

    return Object.entries(categoryDurations)
      .map(([category, minutes]) => ({
        category,
        minutes,
        percentage: totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [schedule]);

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('weeklyAnalytics')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          <div className="space-y-4">
            {stats.map(({ category, minutes, percentage }) => {
              const style = CATEGORY_STYLES[category as any] || CATEGORY_STYLES.personal;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{CATEGORY_ICONS[category as any]}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">{t(`categories.${category}`)}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">{formatDuration(minutes)} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${style.bg.replace('bg-', 'bg-opacity-100 bg-')}`} // Hack to get solid color if bg is light
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: style.border.replace('border-', 'var(--tw-colors-') // Try to use border color for bar
                      }} 
                    />
                    {/* Fallback inline style for color since we use classes */}
                    <div 
                        className={`h-full rounded-full`}
                        style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: getCategoryColor(category) 
                        }}
                    />
                  </div>
                </div>
              );
            })}
            {stats.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noData')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to map category to a hex color or valid tailwind color for inline styles
function getCategoryColor(category: string): string {
    switch(category) {
        case 'anchor': return '#9CA3AF'; // gray-400
        case 'school': return '#3B82F6'; // blue-500
        case 'gym': return '#EF4444'; // red-500
        case 'deepwork': return '#8B5CF6'; // violet-500
        case 'maintenance': return '#F59E0B'; // amber-500
        case 'recovery': return '#10B981'; // emerald-500
        case 'transition': return '#6366F1'; // indigo-500
        case 'personal': return '#EC4899'; // pink-500
        case 'social': return '#F97316'; // orange-500
        case 'church': return '#06B6D4'; // cyan-500
        case 'planning': return '#64748B'; // slate-500
        default: return '#6B7280';
    }
}

export default Analytics;
