const router = require("express").Router();
const User = require("../models/User");
// const {response} = require("express");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.email,
        //encrypt the password
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch(err) {
        return res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).json("We cannot find such email in out database!")
        }

        //decrypt the password
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if (originalPassword !== req.body.password) {
            return res.status(401).json("Wrong password!");
        }

        const accessToken = jwt.sign({
           id: user._id,
           isAdmin: user.isAdmin
        }, process.env.JWT_SEC,
            {expiresIn: "3d"}
        );

        const { password, ...others } = user._doc;
        return res.status(201).json({...others, accessToken});
    } catch(err) {
        return res.status(500).json(err);
    }
})

module.exports = router;