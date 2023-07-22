const mongoose = require('mongoose');
require("dotenv").config();

(async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
})()