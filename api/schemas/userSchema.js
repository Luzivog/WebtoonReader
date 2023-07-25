const mongoose = require('mongoose');
const {Schema, model} = mongoose;

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

module.exports = {User};