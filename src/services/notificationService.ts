import type { NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from './mock/mockNotifications';

let localNotificationsStore: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

export async function getNotifications(): Promise<NotificationItem[]> {
  return [...localNotificationsStore];
}

export async function markNotificationAsRead(id: string): Promise<NotificationItem[]> {
  localNotificationsStore = localNotificationsStore.map(n => n.id === id ? { ...n, isRead: true } : n);
  return [...localNotificationsStore];
}

export async function markAllNotificationsAsRead(): Promise<NotificationItem[]> {
  localNotificationsStore = localNotificationsStore.map(n => ({ ...n, isRead: true }));
  return [...localNotificationsStore];
}

export async function addNotification(notification: Omit<NotificationItem, 'id' | 'isRead'>): Promise<NotificationItem> {
  const newItem: NotificationItem = {
    ...notification,
    id: `notif-${Date.now()}`,
    isRead: false
  };
  localNotificationsStore = [newItem, ...localNotificationsStore];
  return newItem;
}
