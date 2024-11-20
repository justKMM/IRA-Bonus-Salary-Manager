const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization(),authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization(), peopleDemoApi.getPeople);

// API calls for salesmen & such
const salesmenApi = require('../apis/salesmen-api');
router.get('/salesmen', salesmenApi.getAllSalesMen);
router.post('/salesmen/create', salesmenApi.createSalesMan);
router.put('/salesmen/update/:sid', salesmenApi.updateSalesMan)

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test route is working' });
});

module.exports = router;