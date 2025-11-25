export type Category = 
  | 'anchor' 
  | 'school' 
  | 'gym' 
  | 'deepwork' 
  | 'maintenance' 
  | 'recovery' 
  | 'transition' 
  | 'personal' 
  | 'social' 
  | 'church' 
  | 'planning';

export interface ScheduleItem {
  id: string;
  time: string;
  duration: string;
  category: Category;
  activity: string;
  notes: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrenceEndDate?: string; // YYYY-MM-DD format
}

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type Schedule = Record<Day, ScheduleItem[]>;

export interface Habit {
  id: string;
  title: string;
  category: 'health' | 'learning' | 'mindfulness' | 'productivity' | 'other';
}

export type HabitLog = Record<string, string[]>; // Key: YYYY-MM-DD, Value: Array of completed Habit IDs