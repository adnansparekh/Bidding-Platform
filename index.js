const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { sequelize , Item, Bid, Notification } = require('./models');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const bidRoutes = require('./routes/bids');
const notificationRoutes = require('./routes/notifications');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/bids', bidRoutes);
app.use('/notifications', notificationRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('bid', async (data) => {
    const { itemId, bidAmount, userId } = data;

    try {
      const item = await Item.findByPk(itemId);
      if (!item) {
        socket.emit('error', 'Item not found');
        return;
      }

      if (bidAmount <= item.current_price) {
        socket.emit('error', 'Bid amount must be higher than current price');
        return;
      }

      const bid = await Bid.create({ bid_amount: bidAmount, item_id: itemId, user_id: userId });

      item.current_price = bidAmount;
      await item.save();

      // Notify item owner
      await Notification.create({
        user_id: item.user_id,
        message: `New bid on your item: ${item.name}`,
      });

     
      io.emit('update', { itemId, bidAmount, userId });
    } catch (error) {
      console.error(error);
      socket.emit('error', 'An error occurred while placing the bid');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Synchronize models with the database
    await sequelize.sync(); // Use { force: true } only in development to drop and recreate tables

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
