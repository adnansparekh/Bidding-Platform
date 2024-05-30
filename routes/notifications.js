const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.post('/mark-read', authMiddleware, markAsRead);

module.exports = router;
