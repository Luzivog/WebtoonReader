const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true, maxLength: 20},
    password: {type: String, required: true, maxLength: 100},
    bookmarks: {
        type: [{type: String, maxLength: 500}],
        default: []
    },
    viewed: {
        type: Map,
        of: [{type: String, maxLength: 500}],
        default: {}
    },
});

const User = model("User", userSchema);

module.exports = {User};