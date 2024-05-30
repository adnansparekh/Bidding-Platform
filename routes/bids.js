const express = require('express');
const { getBidsByItem, createBid } = require('../controllers/bidController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/items/:itemId/bids', getBidsByItem);
router.post('/items/:itemId/bids', authMiddleware, createBid);

module.exports = router;
