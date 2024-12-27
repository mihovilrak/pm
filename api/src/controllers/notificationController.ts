import { Request, Response } from 'express';
import { Pool } from 'pg';
import * as notificationModel from '../models/notificationModel';

// Get user notifications
export const getUserNotifications = async (req: Request, res: Response, pool: Pool): Promise<void> => {
  const { user_id } = req.params;
  try {
    const notifications = await notificationModel.getNotificationsByUserId(pool, user_id);
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark notifications as read
export const markAsRead = async (req: Request, res: Response, pool: Pool): Promise<void> => {
  const { user_id } = req.params;
  try {
    const updatedNotifications = await notificationModel.markNotificationsAsRead(pool, user_id);
    res.status(200).json(updatedNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response, pool: Pool): Promise<void> => {
  const { id } = req.params;
  try {
    await notificationModel.deleteNotification(pool, id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
