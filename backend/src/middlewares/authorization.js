// Middleware for Basic Authentication
const userService = require('../services/user-service');

exports.basicAuth = async function (req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const db = req.app.get('db');
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ message: 'Unauthorized: Missing or invalid credentials' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        try {
            const result = await userService.verify(db, { username, password });
            if (!result) {
                return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
