/**
 * Parses a time string (e.g., "9:00-10:30") into start and end minutes from midnight.
 * Returns null if the format is invalid or not a specific time range.
 */
export const parseTimeRange = (timeStr: string): [number, number] | null => {
  if (typeof timeStr !== 'string') return null;
  // Regex to match "HH:MM-HH:MM" format
  const match = timeStr.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const [, startHour, startMin, endHour, endMin] = match.map(Number);

  // Convert times to total minutes from midnight
  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  // A valid range must have a start time before the end time
  if (startTotalMinutes >= endTotalMinutes) return null;

  return [startTotalMinutes, endTotalMinutes];
};

/**
 * Checks if two time ranges overlap.
 * Ranges are tuples of [startMinutes, endMinutes].
 */
export const doesOverlap = (range1: [number, number], range2: [number, number]): boolean => {
  // An interval [a, b] overlaps with [c, d] if a < d and c < b.
  const [start1, end1] = range1;
  const [start2, end2] = range2;
  return start1 < end2 && start2 < end1;
};

/**
 * Formats a duration in minutes into a human-readable string like "1h 30m".
 * @param totalMinutes The duration in total minutes.
 * @returns A formatted string.
 */
export const formatDuration = (totalMinutes: number): string => {
    if (totalMinutes <= 0) return "0m";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    let result = '';
    if (hours > 0) {
        result += `${hours}h`;
    }
    if (minutes > 0) {
        if(result) result += ' ';
        result += `${minutes}m`;
    }
    
    return result || '0m';
};

/**
 * Gets the ISO 8601 week number for a given date.
 * @param d The date.
 * @returns The week number (1-53).
 */
export const getWeekNumber = (d: Date): number => {
  // Create a copy of the date to avoid modifying the original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Sunday is 0 for getUTCDay(), but we want it to be 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  // Return week number
  return weekNo;
};

/**
 * Gets the date of the Monday of a given week number and year.
 * @param weekNo The week number.
 * @param year The year.
 * @returns The date of the first day of the week (Monday).
 */
export const getStartDateOfWeek = (weekNo: number, year: number): Date => {
  const d = new Date(year, 0, 1 + (weekNo - 1) * 7);
  const day = d.getDay() || 7; // Get day of week, making Sunday 7
  if (day !== 1) { // If not Monday
    d.setHours(-24 * (day - 1)); // Adjust to Monday
  }
  d.setHours(0,0,0,0);
  return d;
};
