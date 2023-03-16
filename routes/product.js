const router = require("express").Router();
const { verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/Product");

//ADD NEW PRODUCT - admin only BUT in my case every user?
router.post("/", verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        return res.status(200).json(savedProduct);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//UPDATE PRODUCT INFO - admin only BUT in my case every user ?
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new:true }
        );
        return res.status(200).json(updatedProduct);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//DELETE PRODUCT - admin only
router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id.toString().trim());
        return req.status(200).json("Product has been deleted.");
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET INFO ABOUT PRODUCT - all users so no token required
router.get("/:id", async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch(err) {
        return res.status(500).json(err);
    }
})

//GET ALL PRODUCTS - all users so no token required
router.get("/", async (req,res) => {
    const query = req.query.new;
    try {
        //query with added path /?new=true to show only 5 newest products
        const products = query ? await Product.find().sort({_id:-1}).limit(5) : await Product.find();
        return res.status(200).json(products);
    } catch(err) {
        return res.status(500).json(err);
    }

    //TODO access products based on categories
    // (e.g. axios.get("http://localhost:5000/api/products?category=test") in Customisation.jsx - frontend)
    // - this is how i can access specific properties from database

    // const query = req.query.new;
    // const queryCategory = req.query.category;
    // try {
    //     let products;
    //     if (query) {
    //         products = await Product.find().sort({_id: -1}).limit(5);
    //     } else if (queryCategory) {
    //         products = await Product.find( {
    //             categories: {
    //                 $in: [queryCategory]
    //             }
    //         })
    //     } else {
    //         products = await Product.find();
    //     }
    //     return res.status(200).json(products);
    // } catch(err) {
    //     return res.status(500).json(err);
    // }
})

module.exports = router;