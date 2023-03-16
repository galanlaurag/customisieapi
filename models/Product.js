const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        title: {type: String},
        desc: {type: String},
        img: {type: String},
        size: {type: Array},
        // categories: {type: Array},
        //colour & inStock added later - not sure if will be working
         // add required & default
        headShape: {type: Array},
        earsShape: {type: Array},
        armsShape: {type: Array},
        legsShape: {type: Array},
        headColour: {type: Array},
        eyesColour: {type: Array},
        noseColour: {type: Array},
        earsColour: {type: Array},
        innerEarsColour: {type: Array, default: "Same as ears"},
        armsColour: {type: Array},
        handsColour: {type: Array, default: "Same as arms"},
        legsColour: {type: Array},
        feetColour: {type: Array, default: "Same as legs"},
        price: {type: Number, default: 99},
        inStock: {type: Boolean, default: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);