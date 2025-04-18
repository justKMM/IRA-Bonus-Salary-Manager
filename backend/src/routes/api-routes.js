const express = require('express');
const router = express.Router();
const { checkAuthorization } = require('../middlewares/auth-middleware');
const salesmenApi = require('../apis/salesmen-api');
const evaluationApi = require('../apis/evaluation-api');
const authorization = require('../middlewares/authorization');

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user using their username and password.
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
 *     description: Logs out the user by invalidating their session.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *   get:
 *     summary: Check login status
 *     description: Checks if the user is currently logged in.
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
 *     description: Retrieves details of the currently authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 username: { type: string }
 *                 email: { type: string }
 *   post:
 *     summary: Create a new user
 *     description: Registers a new user with a username and password.
 *     tags: [Users]
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
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 username: { type: string }
 */
const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);
router.post('/user/create', userApi.createNewUser);

router.use(authorization.basicAuth);

/**
 * @openapi
 * /api/salesmen:
 *   get:
 *     summary: Get all salesmen
 *     description: Retrieves a list of all salesmen.
 *     tags: [Salesmen]
 *     responses:
 *       200:
 *         description: List of salesmen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   salesmanId: { type: integer }
 *                   uid: { type: string, nullable: true }
 *                   employeeId: { type: integer }
 *                   firstName: { type: string }
 *                   middleName: { type: string, nullable: true }
 *                   lastName: { type: string }
 *                   bonusSalary: 
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         year: { type: string }
 *                         value: { type: string }
 *                   jobTitle: { type: string }
 *                   department: { type: string, nullable: true }
 *                   gender: { type: string, nullable: true }
 * /api/salesmen/{salesmanId}:
 *   get:
 *     summary: Get a salesman
 *     description: Retrieves details of a specific salesman by ID.
 *     tags: [Salesmen]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *     responses:
 *       200:
 *         description: Salesman details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   salesmanId: { type: integer }
 *                   uid: { type: string }
 *                   employeeId: { type: integer }
 *                   firstName: { type: string }
 *                   middleName: { type: string }
 *                   lastName: { type: string }
 *                   bonusSalary: 
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         year: { type: string }
 *                         value: { type: string }
 *                   jobTitle: { type: string }
 *                   department: { type: string }
 *                   gender: { type: string }
 *   post:
 *     summary: Create a salesman
 *     description: Adds a new salesman to the system.
 *     tags: [Salesmen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 salesmanId: { type: integer }
 *                 uid: { type: string }
 *                 employeeId: { type: integer, nullable: true }
 *                 firstName: { type: string }
 *                 middleName: { type: string, nullable: true }
 *                 lastName: { type: string }
 *                 bonusSalary: 
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year: { type: string }
 *                       value: { type: string }
 *                 jobTitle: { type: string }
 *                 department: { type: string }
 *                 gender: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Salesman created successfully
 * /api/salesmen/update/{salesmanId}:
 *   put:
 *     summary: Update a salesman
 *     description: Updates the details of an existing salesman.
 *     tags: [Salesmen]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 salesmanId: { type: integer }
 *                 uid: { type: string }
 *                 employeeId: { type: integer, nullable: true }
 *                 firstName: { type: string }
 *                 middleName: { type: string, nullable: true }
 *                 lastName: { type: string }
 *                 bonusSalary: 
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year: { type: string }
 *                       value: { type: string }
 *                 jobTitle: { type: string }
 *                 department: { type: string }
 *                 gender: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Salesman updated successfully
 * /api/salesmen/delete/{salesmanId}:
 *   delete:
 *     summary: Delete a salesman
 *     description: Removes a salesman from the system.
 *     tags: [Salesmen]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *     responses:
 *       200:
 *         description: Salesman deleted successfully
 * /api/salesmen/performance/{salesmanId}:
 *   get:
 *     summary: Get salesman's performance
 *     description: Retrieves performance records for a specific salesman.
 *     tags: [SocialPerformance]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *     responses:
 *       200:
 *         description: Performance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   salesmanId: { type: integer }
 *                   socialId: { type: integer }
 *                   description: { type: string }
 *                   targetValue: { type: integer }
 *                   actualValue: { type: integer }
 *                   year: { type: integer }
 *                   bonus: { type: integer }
 * /api/salesmen/performance/create:
 *   post:
 *     summary: Create performance record
 *     description: Adds a new performance record for a salesman.
 *     tags: [SocialPerformance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   salesmanId: { type: integer }
 *                   socialId: { type: integer }
 *                   description: { type: string }
 *                   targetValue: { type: integer }
 *                   actualValue: { type: integer }
 *                   year: { type: integer }
 *                   bonus: { type: integer }
 *     responses:
 *       201:
 *         description: Performance record created successfully
 * /api/salesmen/performance/update/{salesmanId}/social/{socialId}:
 *   put:
 *     summary: Update performance record
 *     description: Updates a specific performance record for a salesman.
 *     tags: [SocialPerformance]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *       - in: path
 *         name: socialId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the social performance record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   salesmanId: { type: integer }
 *                   socialId: { type: integer }
 *                   description: { type: string }
 *                   targetValue: { type: integer }
 *                   actualValue: { type: integer }
 *                   year: { type: integer }
 *                   bonus: { type: integer }
 *     responses:
 *       200:
 *         description: Performance record updated successfully
 * /api/salesmen/performance/delete/{salesmanId}:
 *   delete:
 *     summary: Delete performance records by year
 *     description: Deletes all performance records for a salesman for a specific year.
 *     tags: [SocialPerformance]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *     responses:
 *       200:
 *         description: Performance records deleted successfully
 * /api/salesmen/performance/delete/{salesmanId}/social/{socialId}:
 *   delete:
 *     summary: Delete specific performance record
 *     description: Deletes a specific performance record for a salesman.
 *     tags: [SocialPerformance]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *       - in: path
 *         name: socialId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the social performance record
 *     responses:
 *       200:
 *         description: Performance record deleted successfully
 */
// Salesmen
router.get('/salesmen', salesmenApi.getAllSalesMen);
router.get('/salesmen/:salesmanId', salesmenApi.getSalesMan);
router.post('/salesmen/create', salesmenApi.createSalesMan);
router.put('/salesmen/update/:salesmanId', salesmenApi.updateSalesMan);
router.delete('/salesmen/delete/:salesmanId', salesmenApi.deleteSalesMan);
// SocialPerformance
router.get('/salesmen/performance/:salesmanId', salesmenApi.getPerformancesFromSalesMan);
router.post('/salesmen/performance/create', salesmenApi.createPerformance);
router.put('/salesmen/performance/update/:salesmanId/social/:socialId', salesmenApi.updatePerformance);
router.delete('/salesmen/performance/delete/:salesmanId', salesmenApi.deletePerformanceRecordsFromSalesManByYear);
router.delete('/salesmen/performance/delete/:salesmanId/social/:socialId', salesmenApi.deletePerformanceRecordsFromSalesManBySocialId);

/**
 * @openapi
 * /api/evaluation/{salesmanId}/{year}:
 *   get:
 *     summary: Get evaluation
 *     description: Retrieves the evaluation for a specific salesman and year.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year of the evaluation
 *     responses:
 *       200:
 *         description: Evaluation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullname: { type: string }
 *                 salesmanId: { type: integer }
 *                 department: { type: string }
 *                 year: { type: string }
 *                 salesEvaluation:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       salesmanId: { type: integer }
 *                       productName: { type: string }
 *                       customer: { type: string }
 *                       customerRating: { type: integer }
 *                       items: { type: integer }
 *                       bonus: { type: integer }
 *                 salesTotalBonus: { type: integer }
 *                 socialEvaluation:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       salesmanId: { type: integer }
 *                       socialId: { type: integer }
 *                       description: { type: string }
 *                       targetValue: { type: integer }
 *                       actualValue: { type: integer }
 *                       year: { type: integer }
 *                       bonus: { type: integer }
 *                 socialTotalBonus: { type: integer }
 *                 totalBonus: { type: integer }
 *                 remark: { type: string }
 *                 acceptedHR: { type: boolean }
 *                 acceptedCEO: { type: boolean }
 *                 acceptedSalesman: { type: boolean }
 *   delete:
 *      summary: Deletes evaluation
 *      description: Deletes the evaluation for a specific salesman and year.
 *      tags: [Evaluation]
 *      parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year of the evaluation
 *      responses:
 *       200:
 *         description: Evaluation updated successfully
 * /api/evaluation/update/{salesmanId}/{year}:
 *   put:
 *     summary: Update evaluation
 *     description: Updates the evaluation for a specific salesman and year.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year of the evaluation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 fullname: { type: string }
 *                 salesmanId: { type: integer }
 *                 department: { type: string }
 *                 year: { type: string }
 *                 salesEvaluation:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       salesmanId: { type: integer }
 *                       productName: { type: string }
 *                       customer: { type: string }
 *                       customerRating: { type: integer }
 *                       items: { type: integer }
 *                       bonus: { type: integer }
 *                 salesTotalBonus: { type: integer }
 *                 socialEvaluation:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       salesmanId: { type: integer }
 *                       socialId: { type: integer }
 *                       description: { type: string }
 *                       targetValue: { type: integer }
 *                       actualValue: { type: integer }
 *                       year: { type: integer }
 *                       bonus: { type: integer }
 *                 socialTotalBonus: { type: integer }
 *                 totalBonus: { type: integer }
 *                 remark: { type: string }
 *                 acceptedHR: { type: boolean }
 *                 acceptedCEO: { type: boolean }
 *                 acceptedSalesman: { type: boolean }
 *     responses:
 *       200:
 *         description: Evaluation updated successfully
 * /api/evaluation/acceptHR/{salesmanId}/{year}:
 *   put:
 *     summary: HR acceptance of evaluation
 *     description: Marks the evaluation as accepted by HR for a specific salesman and year.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year of the evaluation
 *     responses:
 *       200:
 *         description: Evaluation accepted by HR
 * /api/evaluation/acceptCEO/{salesmanId}/{year}:
 *   put:
 *     summary: CEO acceptance of evaluation
 *     description: Marks the evaluation as accepted by the CEO for a specific salesman and year.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year of the evaluation
 *     responses:
 *       200:
 *         description: Evaluation accepted by CEO
 * /api/evaluation/acceptSalesman/{salesmanId}/{year}:
 *   put:
 *     summary: Salesman acceptance of evaluation
 *     description: Marks the evaluation as accepted by the salesman for a specific year.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year of the evaluation
 *     responses:
 *       200:
 *         description: Evaluation accepted by salesman
 */
// Evaluations
router.get('/evaluation/:salesmanId/:year', evaluationApi.getEvaluation);
router.delete('/evaluation/:salesmanId/:year', evaluationApi.deleteEvaluation);
router.put('/evaluation/update/:salesmanId/:year', evaluationApi.updateEvaluation);
router.put('/evaluation/acceptHR/:salesmanId/:year', evaluationApi.acceptHR);
router.put('/evaluation/acceptCEO/:salesmanId/:year', evaluationApi.acceptCEO);
router.put('/evaluation/acceptSalesman/:salesmanId/:year', evaluationApi.acceptSalesman);

/**
 * @openapi
 * /api/bonus:
 *   post:
 *     summary: Update all bonus salaries
 *     description: Updates bonus salaries for all salesmen in OrangeHRM.
 *     tags: [BonusSalary]
 *     responses:
 *       200:
 *         description: All bonus salaries updated successfully
 * /api/bonus/{salesmanId}:
 *   post:
 *     summary: Update bonus salary for a salesman
 *     description: Updates the bonus salary for a specific salesman in OrangeHRM.
 *     tags: [BonusSalary]
 *     parameters:
 *       - in: path
 *         name: salesmanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the salesman
 *     responses:
 *       200:
 *         description: Bonus salary updated successfully
 */
// Write BonusSalary to OrangeHRM
router.post('/bonus', salesmenApi.updateAllBonusSalarieToOrangeHRM);
router.post('/bonus/:salesmanId', salesmenApi.updateBonusSalarieToOrangeHRM);

module.exports = router;