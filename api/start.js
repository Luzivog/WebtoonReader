const { User } = require("./schemas/userSchema");
const mongoose = require('mongoose');
const express = require('express');
const { isValidUserObject } = require("./utils");
require('dotenv').config();

const app = express();
app.use(express.json());

const apiStart = () => {

    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('MongoDB connected...'))
        .catch((err) => console.log(err));

    /**
     * Handle GET requests to retrieve user information based on query parameters.
     *
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * @returns {Promise<void>} - A Promise that resolves when the response is sent.
     */
    app.get('/users', async (req, res) => {
        /**
         * Retrieves user information based on either id or username/password combination.
         *
         * Query parameters:
         * - id: User ID
         * - username: User's username
         * - password: User's password
         *
         * Returns user data in JSON format or appropriate error responses.
         */

        const id = req.query.id;
        const username = req.query.username;
        const password = req.query.password;

        if ((!id && (!username && !password)) || (id && username && password)) 
            return res.status(400).json({ error: 'Invalid query parameters' });

        try {
            if (id) {
                const user = await User.findOne({_id: id});
                if (!user) return res.status(404).json({ error: 'User not found' });
                res.json(user);
            } else {
                const user = await User.findOne({username: username, password: password});
                if (!user) return res.status(404).json({ error: 'User not found' });
                res.json(user);
            }
        } catch (err) {
            console.error('Error retrieving user:', err);
            res.status(500).json({ error: 'An error occurred while retrieving user information' });
        }
    });

    /**
     * Handle POST requests to create new users with provided username and password.
     *
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * @returns {Promise<void>} - A Promise that resolves when the response is sent.
     */
    app.post('/users', async (req, res) => {
        /**
         * Creates new users by providing a username and password.
         *
         * Request body:
         * {
         *   username: User's username,
         *   password: User's password
         * }
         *
         * Returns the created user data in JSON format or error responses for invalid input.
         */

        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password)
            return res.status(400).json({ error: 'Username and password are required' });

        if (username.length > 20)
            return res.status(400).json({ error: 'Username can be 20 characters maximum' });

        if (password.length > 100)
            return res.status(400).json({ error: 'Password can be 100 characters maximum' });

        const newUser = new User({username: username, password: password});
        try {
            await newUser.save();
            res.status(201).json(newUser);
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'An error occurred while creating the user' });
        }
    });

    /**
     * Handle POST requests to update users with provided user object.
     *
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * @returns {Promise<void>} - A Promise that resolves when the response is sent.
     */
    app.post('/updateUser', async (req, res) => {
        /**
         * Updates user information by providing a valid user ID and updated data.
         *
         * Query parameters:
         * - id: User ID
         *
         * Request body should contain a valid user object:
         * {
         *   username: User's username,
         *   password: User's password,
         *   bookmarks: Array of bookmarks,
         *   viewed: Object containing viewed items
         * }
         *
         * Returns updated user data in JSON format or appropriate error responses.
         */

        const id = req.query.id;

        if (!id) return res.status(400).json({ error: 'Invalid user id' });

        const userObject = req.body;

        if (!isValidUserObject(userObject)) return res.status(400).json({ error: 'Invalid user object' });

        try {
            const updatedUser = await User.findOneAndUpdate({ _id: id }, userObject, { new: true });
            if (updatedUser) return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
            else return res.status(404).json({ error: 'User not found' });

        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ error: 'An error occurred while updating the user' });

        };
    });

    app.listen(5000, () => console.log('Server running on port 5000'));
};

apiStart();