const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require('path');
const buildPath = path.join(__dirname, '..', 'build');
const transporter = require('./routes/formConfig');
const axios = require('axios');


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
.then(() =>
    console.log("DBConnection Successful!"))
.catch((err) => {
    console.log(err);
});

app.use(cors());
app.use(express.json());
app.use(express.static(buildPath));
app.use(express.urlencoded({extended: true}));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

//form sending
app.post('/api/send', async (req, res) => {
    const {captchaToken} = req.body;
    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captchaToken}`
    );
    // Extract result from the API response
    if(response.data.success) {
        console.log('Human');
        try {
            const mailOptions = {
                from: req.body.email,
                to: process.env.EMAIL,
                subject: "Formularz kontaktowy - nowa wiadomość",
                html: `
                  <h3>Szczegóły wiadomości:</h3>
                  <ul>
                    <li>Imię: ${req.body.name}</li>
                    <li>Email: ${req.body.email}</li>
                    <li>Wiadomość: ${req.body.message}</li>
                  </ul>
                  `
            };

            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'Something went wrong. Try again later'
                    });
                } else {
                    res.send({
                        success: true,
                        message: 'Thanks for contacting us. We will get back to you shortly'
                    });
                }
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Something went wrong. Try again later'
            });
        }
    } else {
        console.log('BOT!!!');
        res.status(500).send({
            success: false,
            message: 'Something went wrong. Try again later'
        });
    }
});

//port 5000 is private, 80 public
// app.listen(process.env.PORT || 5000, () => {
app.listen(80, () => {
    console.log("Backend server is running!");
})
