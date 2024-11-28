const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *   delete:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *   get:
 *     summary: Check login status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login status
 */
const authApi = require('../apis/auth-api');
router.post('/login', authApi.login);
router.delete('/login', checkAuthorization(), authApi.logout);
router.get('/login', authApi.isLoggedIn);

/**
 * @openapi
 * /api/user:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 */
const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

/**
 * @openapi
 * /api/people:
 *   get:
 *     summary: Get all people
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of people
 */
const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization(), peopleDemoApi.getPeople);

/**
 * @openapi
 * /api/salesmen:
 *   get:
 *     summary: Get all salesmen
 *     tags: [Salesmen]
 *     responses:
 *       200:
 *         description: List of salesmen
 *
 * /api/salesmen/create:
 *   post:
 *     summary: Create salesman
 *     tags: [Salesmen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Salesman created
 *
 * /api/salesmen/update/{sid}:
 *   put:
 *     summary: Update salesman
 *     tags: [Salesmen]
 *     parameters:
 *       - in: path
 *         name: sid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: Salesman updated
 */
const salesmenApi = require('../apis/salesmen-api');
router.get('/salesmen', salesmenApi.getAllSalesMen);
router.post('/salesmen/create', salesmenApi.createSalesMan);
router.put('/salesmen/update/:sid', salesmenApi.updateSalesMan)

/**
 * @openapi
 * /api/test:
 *   get:
 *     summary: Test endpoint
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Test successful
 */
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test route is working' });
});

module.exports = router;