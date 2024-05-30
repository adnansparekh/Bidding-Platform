const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('./user');
const ItemModel = require('./item');
const BidModel = require('./bid');
const NotificationModel = require('./notification');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

// Define models
const User = UserModel(sequelize, DataTypes);
const Item = ItemModel(sequelize, DataTypes);
const Bid = BidModel(sequelize, DataTypes);
const Notification = NotificationModel(sequelize, DataTypes);

// Define associations
User.hasMany(Bid, { foreignKey: 'user_id' });
Bid.belongsTo(User, { foreignKey: 'user_id' });

Item.hasMany(Bid, { foreignKey: 'item_id' });
Bid.belongsTo(Item, { foreignKey: 'item_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

sequelize.sync({ force: false, alter: false })
  .then(() => {
    console.log("Database connected and models synchronized");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = { sequelize, User, Item, Bid, Notification };
