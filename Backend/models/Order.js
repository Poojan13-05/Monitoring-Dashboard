const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        itemid: {
            type: String, // Changed to String to store the ID directly
            required: true
        },
        title: {
            type: String, // Added title to store the item name
            required: true
        },
        price: {
            type: Number, // Added price to store the item's price directly
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    customerDetails: {
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
