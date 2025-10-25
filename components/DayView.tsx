import React from 'react';
import type { Schedule, Day, ScheduleItem } from '../types';
import Header from './Header';
import DayTabs from './DayTabs';
import ScheduleCard from './ScheduleCard';
import EditForm from './EditForm';
import { Plus } from './icons';

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
  } = props;

  const NEW_ITEM_TEMPLATE: ScheduleItem = {
      id: 'new-item-placeholder',
      time: "12:00-13:00",
      duration: "1h",
      category: "personal",
      activity: "",
      notes: "",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-24">
      <Header 
        onSetView={onSetView} 
        onResetToDefault={onResetToDefault} 
        onExportToCSV={onExportToCSV}
        onExportToICS={onExportToICS} 
      />
      <DayTabs selectedDay={selectedDay} onSetSelectedDay={onSetSelectedDay} />
      
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        {schedule[selectedDay].map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            {editingId === item.id ? (
              <EditForm 
                item={item} 
                onSave={onSaveItem} 
                onCancel={() => onSetEditingId(null)} 
              />
            ) : (
              <ScheduleCard 
                item={item} 
                onEdit={onSetEditingId} 
                onDelete={onDeleteItem} 
              />
            )}
          </div>
        ))}

        {isAdding && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-down">
            <EditForm 
              item={NEW_ITEM_TEMPLATE}
              onSave={onSaveNewItem} 
              onCancel={onCancelAddItem} 
            />
          </div>
        )}
        
        {schedule[selectedDay].length === 0 && !isAdding && (
          <div className="text-center py-10 px-4 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500">No activities scheduled for today.</p>
            <button onClick={onAddNewItem} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
              Add an activity
            </button>
          </div>
        )}
      </main>

      <button
        onClick={onAddNewItem}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
        aria-label="Add new item"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};

export default DayView;