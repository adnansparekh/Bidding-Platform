const express = require('express');
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', authMiddleware, upload.single('image'), createItem);
router.put('/:id', authMiddleware, upload.single('image'), updateItem);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'owner']), deleteItem);

module.exports = router;
