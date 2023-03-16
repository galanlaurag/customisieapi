const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);