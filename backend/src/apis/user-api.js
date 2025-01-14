/**
 * endpoint, which returns information about the user, which is currently authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
const userService = require("../services/user-service");
const User = require("../models/User");
exports.getSelf = async function(req, res){
    res.send(req.session.user); //retrieve userdata of authenticated user from session and return it
}

/**
 * endpoint, which creates a new user (functionality reserved only for admin)
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.createNewUser = async function(req, res) {
    const user = req.session.user;
    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        await userService.add(req.app.get('db'), req.body); // Use req.body for new user data
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
}