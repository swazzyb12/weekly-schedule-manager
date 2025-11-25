import React from 'react';
import type { ScheduleItem } from '../types';
import { CATEGORY_STYLES, CATEGORY_ICONS } from '../constants';
import { triggerHaptic } from '../utils/native';

interface QuickTemplatesProps {
  onSelectTemplate: (template: Partial<ScheduleItem>) => void;
  templates: Partial<ScheduleItem>[];
}

const QuickTemplates: React.FC<QuickTemplatesProps> = ({ onSelectTemplate, templates }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {templates.map((template, index) => {
        const style = CATEGORY_STYLES[template.category!] || CATEGORY_STYLES.personal;
        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onSelectTemplate(template);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors ${style.bg} ${style.border} ${style.text} dark:bg-opacity-20 dark:border-opacity-50`}
          >
            <span>{CATEGORY_ICONS[template.category!]}</span>
            <span className="font-medium">{template.activity}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickTemplates;
