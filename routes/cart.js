const router = require("express").Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization} = require("./verifyToken");
const Cart = require("../models/Cart");

// ADD NEW CART - all
router.post("/", verifyToken, async (req,res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        return res.status(200).json(savedCart);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//UPDATE CART - logged in + admin ?
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new:true }
        );
        return res.status(200).json(updatedCart);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//DELETE CART - logged in + admin
router.delete("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        return  req.status(200).json("Cart has been deleted.");
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET INFO ABOUT USER CART - logged in + admin
router.get("/find/:userId", verifyTokenAndAuthorization, async (req,res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        return res.status(200).json(cart);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET CARTS OF ALL USERS - admin only
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        return res.status(200).json(carts);
    } catch(err) {
        return res.status(500).json(err);
    }
})

module.exports = router;