import { api } from './api';
import { Notification } from '../types/notifications';

// Get notifications
export const getNotifications = async (userId: number): Promise<Notification[]> => {
  try {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

// Mark notifications as read
export const markAsRead = async (userId: number): Promise<void> => {
  try {
    await api.patch(`/notifications/${userId}`);
  } catch (error) {
    console.error('Failed to mark notifications as read:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId: number): Promise<void> => {
  try {
    await api.delete(`/notifications/${notificationId}`);
  } catch (error) {
    console.error('Failed to delete notification:', error);
    throw error;
  }
}; 