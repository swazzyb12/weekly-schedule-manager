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
