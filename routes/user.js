const router = require("express").Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");
const CryptoJS = require("crypto-js");

//UPDATE USER'S ACCOUNT INFO - logged in + admin
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    //update password if authorized
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new:true }
        );
        return res.status(200).json(updatedUser);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//DELETE USER'S ACCOUNT - logged in + admin
router.delete("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return  req.status(200).json("User has been deleted.");
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET INFO ABOUT USER'S ACCOUNT - admin only
router.get("/find/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        return res.status(200).json({...others});
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET ALL USERS - admin only
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new;
    try {
        //query with added path /?new=true to show only 5 newest users
        const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find();
        return res.status(200).json(users);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET USER STATS per month - admin only
router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
    //current date
    const date = new Date();
    //last year from today
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            { $match: {
                createdAt: { $gte: lastYear }
            } },
            { $project: {
                month: { $month: "$createdAt" },
            } },
            { $group: {
                _id: "$month",
                total: { $sum: 1 }
            } }
        ]);
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json(err);
    }
})

module.exports = router;