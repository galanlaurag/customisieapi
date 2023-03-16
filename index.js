const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
.then(() =>
    console.log("DBConnection Successful!"))
.catch((err) => {
    console.log(err);
});

app.use(cors());
//local
// app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
//deployed
// app.use(cors({credentials: true, origin: 'https://customisie.pl'}));
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

//port 5000 is private, 80 public
// app.listen(process.env.PORT || 5000, () => {
app.listen(80, () => {
    console.log("Backend server is running!");
})