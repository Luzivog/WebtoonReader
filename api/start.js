const { User } = require("./schemas/userSchema");
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoInit = () => {

    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('MongoDB connected...'))
        .catch((err) => console.log(err));

    app.get('/users/:userId', async (req, res) => {
        const userId = req.params.userId;
        console.log(userId)

        if (userId == null) return res.sendStatus(401);

        User.findOne({_id: userId})
            .then((user) => {
                if (user == null) return res.status(404).json({ error: 'User not found' });
                res.json(user)
            })
            .catch((err) => {
                res.status(404).json({ error: 'Invalid ID format' })
            });
    });

    app.post('/users', async (req, res) => {
        const newUser = new User(req.body);
        await newUser.save();
        res.json(newUser);
    });

    app.listen(5000, () => console.log('Server running on port 5000'));
};

mongoInit()