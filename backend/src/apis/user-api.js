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
exports.createNewUser = async function(req, res){
    const user = exports.getSelf;

    if (user.isAdmin) {
        await userService.add(req.app.get('db'), user);
    }
}