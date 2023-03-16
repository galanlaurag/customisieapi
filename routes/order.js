const router = require("express").Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization} = require("./verifyToken");
const Order = require("../models/Order");

//ADD NEW ORDER
router.post("/", verifyToken, async (req,res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        return res.status(200).json(savedOrder);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//UPDATE ORDER - admin only
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new:true }
        );
        return res.status(200).json(updatedOrder);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//DELETE ORDER - admin only
router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        return  req.status(200).json("Order has been deleted.");
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET INFO ABOUT USER ORDERS - logged in + admin
router.get("/find/:userId", verifyTokenAndAuthorization, async (req,res) => {
    try {
        const orders = await Order.find({userId: req.params.userId});
        return res.status(200).json(orders);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET ORDERS OF ALL USERS - admin only
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET MONTLY INCOME - admin only
router.get("/income", verifyTokenAndAdmin, async (req,res) => {
    //current date
    const date = new Date();
    //2 last months from today
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: {
                    createdAt: { $gte: previousMonth }
                } },
            { $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                } },
            { $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                } }
        ]);
        return res.status(200).json(income);
    } catch(err) {
        return res.status(500).json(err);
    }
})

module.exports = router;