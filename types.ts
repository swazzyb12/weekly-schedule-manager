
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