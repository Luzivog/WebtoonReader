const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const webtoonSchema = new Schema({
    name: String,
    chapters: {
        type: Map,
        of: [{
            comment: String,
            likes: Number
        }]
    },
});

const Webtoon = model("Webtoon", webtoonSchema);

module.exports = {Webtoon};