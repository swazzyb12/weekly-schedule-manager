import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Schedule, ScheduleItem } from '../types';
import { parseTimeRange } from './time';

// --- Haptics ---

export const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
  try {
    switch (type) {
      case 'light':
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case 'medium':
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case 'heavy':
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case 'success':
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case 'warning':
        await Haptics.notification({ type: NotificationType.Warning });
        break;
      case 'error':
        await Haptics.notification({ type: NotificationType.Error });
        break;
    }
  } catch (e) {
    // Haptics might not be available (e.g. in browser)
    console.warn('Haptics not available', e);
  }
};

// --- Notifications ---

export const requestNotificationPermissions = async () => {
  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (e) {
    console.warn('Notification permissions not available', e);
    return false;
  }
};

export const scheduleNotificationsForWeek = async (schedule: Schedule) => {
  try {
    // Cancel all existing notifications first to avoid duplicates
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    const notifications: any[] = [];
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const now = new Date();
    const currentDayIndex = now.getDay(); // 0 = Sunday

    // We want to schedule for the next 7 days
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() + i);
      const dayName = days[targetDate.getDay()] as keyof Schedule;
      
      const items = schedule[dayName];
      if (!items) continue;

      items.forEach((item: ScheduleItem) => {
        const timeRange = parseTimeRange(item.time);
        if (!timeRange) return;

        const [startMinutes] = timeRange;
        const hours = Math.floor(startMinutes / 60);
        const minutes = startMinutes % 60;

        // Set notification time 10 minutes before start
        const notificationTime = new Date(targetDate);
        notificationTime.setHours(hours, minutes - 10, 0, 0);

        // Only schedule if it's in the future
        if (notificationTime > now) {
          notifications.push({
            title: `Upcoming: ${item.activity}`,
            body: `Starting at ${item.time} (${item.category})`,
            id: Math.floor(Math.random() * 1000000), // Simple random ID
            schedule: { at: notificationTime },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: null
          });
        }
      });
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
      console.log(`Scheduled ${notifications.length} notifications`);
    }
  } catch (e) {
    console.warn('Failed to schedule notifications', e);
  }
};
