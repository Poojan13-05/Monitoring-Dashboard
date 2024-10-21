const router = require('express').Router();
const User = require('../models/Users');
const Order = require('../models/Order');

// Route to place an order
router.post('/placeOrder', async (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || !items.length) {
        return res.status(400).json({ message: 'User ID and items are required' });
    }

    // Validate items
    for (const item of items) {
        if (!item.title || !item.price || !item.quantity) {
            return res.status(400).json({ message: 'Each item must have title, price, and quantity' });
        }
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

        const newOrder = new Order({
            items,
            totalPrice,
            customerDetails: {
                email: user.email,
                username: user.username
            }
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('Error in /placeOrder:', err.message, err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
