// controllers/notificationController.js
const { Notification } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { user_id: req.user.id, is_read: false } });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    await Notification.update({ is_read: true }, { where: { id: ids, user_id: req.user.id } });
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getNotifications, markAsRead };
