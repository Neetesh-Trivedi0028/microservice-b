const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/microserviceB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Microservice B: Connected to MongoDB'));

// Order Schema and Model
const orderSchema = new mongoose.Schema({
    orderNumber: String,
    userId: String, // Reference to User in Microservice A
    date: Date
});

const Order = mongoose.model('Order', orderSchema);

// Routes
app.post('/orders', async (req, res) => {
    try {
        const { orderNumber, userId, date } = req.body;

        // Validate userId with Microservice A
        const userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
        if (!userResponse.data) return res.status(404).json({ message: 'User not found in Microservice A' });

        // Create the order
        const order = new Order({ orderNumber, userId, date });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Fetch user details from Microservice A
        const userResponse = await axios.get(`http://localhost:3001/users/${order.userId}`);
        res.json({ order, user: userResponse.data });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Microservice B running on port ${PORT}`));
