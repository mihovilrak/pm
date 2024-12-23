const express = require('express');
const notificationController = require('../controllers/notificationController');

// Notification routes
module.exports = (pool) => {
  const router = express.Router();

  // Get all notifications for a user
  router.get('/:user_id', (req, res) => 
    notificationController.getUserNotifications(req, res, pool));

  // Mark notifications as read
  router.patch('/:user_id', (req, res) => 
    notificationController.markAsRead(req, res, pool));

  // Delete notification
  router.delete('/:id', (req, res) => 
    notificationController.deleteNotification(req, res, pool));

  return router;
};
