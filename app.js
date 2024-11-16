const express = require("express");
const { getUserModel, getOrderModel } = require('microservicec');

const app = express();
app.use(express.json());

const USER_DB_URI = "mongodb://localhost:27017/microserviceA";
// const USER_DB_NAME = "";
const ORDER_DB_URI = "mongodb://localhost:27017/microserviceB";
// const ORDER_DB_NAME = "";

// create sample data
app.get("/create-users", async (req, res) => {
    try {
        const User = await getUserModel(USER_DB_URI);
        const users = new User({
            name: "Neetesh Trivedi",
            email: "neetesh@yopmail.com",
            gender: "Male",
            address: "abc address",
        });
        const data = await users.save();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/users", async (req, res) => {
    try {
        const User = await getUserModel(USER_DB_URI);
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log("check error ", error);
        res.status(500).json({ error: error.message });
    }
});


// create sample data 
app.get("/create-order", async (req, res) => {
    try {
        const Order = await getOrderModel(ORDER_DB_URI);
        const order = new Order({
            orderNumber: "some order number",
            userId: "6738b5f91d54fa40ae659a86"
        });
        const data = await order.save();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/orders", async (req, res) => {
    try {
        const Order = await getOrderModel(ORDER_DB_URI);
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
