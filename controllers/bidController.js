// controllers/bidController.js
const { Bid, Item, Notification } = require('../models');

const getBidsByItem = async (req, res) => {
  try {
    const bids = await Bid.findAll({ where: { item_id: req.params.itemId } });
    res.json(bids);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createBid = async (req, res) => {
  try {
    const { bid_amount } = req.body;
    const { itemId } = req.params;
    const userId = req.user.id;

    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (bid_amount <= item.current_price) {
      return res.status(400).json({ error: 'Bid amount must be higher than current price' });
    }

    const bid = await Bid.create({ bid_amount, item_id: itemId, user_id: userId });

    item.current_price = bid_amount;
    await item.save();

   
    await Notification.create({
      user_id: item.user_id,
      message: `New bid on your item: ${item.name}`,
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getBidsByItem, createBid };
