// controllers/itemController.js
const { Item, Bid } = require('../models');

const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(404).json({ error: 'Item not found' });
  }
};


const createItem = async (req, res) => {
  const { name, description, starting_price, end_time } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newItem = await Item.create({
      name,
      description,
      starting_price,
      current_price: starting_price,
      end_time,
      image_url,
    });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const updateItem = async (req, res) => {
  const { name, description, starting_price, current_price, end_time } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      item.name = name;
      item.description = description;
      item.starting_price = starting_price;
      item.current_price = current_price;
      item.end_time = end_time;
      item.image_url = image_url;
      await item.save();
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };
