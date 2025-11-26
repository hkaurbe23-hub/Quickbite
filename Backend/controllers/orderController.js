import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ================================
// PLACE ORDER (DEMO MODE)
// ================================
const placeOrder = async (req, res) => {
    try {
        // ⭐ FIX: ensure req.user exists (admin routes do NOT use token)
        const userId = req.user?.id;
        if (!userId) {
            return res.json({ success: false, message: "User not authorized" });
        }

        // 1. CREATE ORDER
        const newOrder = await orderModel.create({
            userId: userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "Food is Getting Ready!",  // Default status
            payment: true                      // Fake payment success
        });

        // 2. CLEAR USER CART
        await userModel.findByIdAndUpdate(userId, {
            cartData: {}
        });

        // 3. SEND RESPONSE
        return res.json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// ================================
// VERIFY ORDER (DEMO MODE)
// ================================
const verifyOrder = async (req, res) => {
    try {
        // Demo mode → always successful
        return res.json({
            success: true,
            message: "Payment Verified"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Verification Error" });
    }
};

// ================================
// USER ORDERS FOR FRONTEND
// ================================
const userOrders = async (req, res) => {
    try {
        // ⭐ Use user from token
        const userId = req.user?.id;

        const orders = await orderModel.find({ userId: userId });
        res.json({ success: true, data: orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

// ================================
// ALL ORDERS FOR ADMIN PANEL
// ================================
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// ================================
// UPDATE ORDER STATUS (ADMIN)
// ================================
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {
            status: req.body.status
        });

        res.json({
            success: true,
            message: "Status Updated!"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
};

// ================================
// GET MY ORDERS (GET endpoint)
// ================================
const myOrders = async (req, res) => {
    try {
        // Use user from token
        const userId = req.user?.id;
        
        if (!userId) {
            return res.json({ success: false, message: "User not authorized" });
        }

        const orders = await orderModel.find({ userId: userId }).sort({ date: -1 });
        res.json({ success: true, data: orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

export { placeOrder, verifyOrder, userOrders, updateStatus, listOrders, myOrders };
