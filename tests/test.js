const mongoose = require('mongoose');
const {Schema, model} = mongoose;
require('dotenv').config();

const userSchema = new Schema({
    username: String,
    password: String,
    bookmarks: [String],
    viewed: {
        type: Map,
        of: [String]
    },
});

const User = model("User", userSchema);


(async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        const user = new User({
            username: 'testUser',
            password: 'testPassword',
            bookmarks: [],
            viewed: new Map()
        });
        user.save()
            .then((doc) => {
                console.log("Saved user", doc);
            })
            .catch((err) => {
                console.error(err);
            });

        User.findOne({ username: 'testUser' })
            .then((doc) => {
                console.log("User found", doc);
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (error) {
        console.log(error);
    }
})()