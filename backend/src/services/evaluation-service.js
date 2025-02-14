const Evaluation = require('../models/Evaluation');
const SalesPerformance = require('../models/SalesPerformance');
const SocialPerformance = require('../models/SocialPerformance');
const SalesmanService = require('../services/salesmen-service');
const SalesOrderService = require('../services/salesorder-service');
const CustomerService = require('./customer-service');

/**
 * Generates an evaluation for a specific salesman for a given year.
 * Combines sales performance and social performance evaluations into a comprehensive evaluation object.
 * 
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The salesmanId of the salesman for whom the evaluation is being generated.
 * @param {number} year - The year for which the evaluation is generated.
 * @returns {Promise<Object>} - A promise that resolves to the generated evaluation object.
 * @throws {Error} - If the salesman is not found or there is an issue generating the evaluation.
 */
exports.generateEvaluation = async function (db, salesmanId, year) {
    try {
        // Fetch salesman details from database (implement this based on your data layer)
        const salesmanDetails = await fetchSalesmanDetails(db, salesmanId);
        if (!salesmanDetails) {
            throw new Error('Salesman not found');
        }

        // Create new evaluation instance
        const evaluation = new Evaluation(
            salesmanDetails.fullname,
            salesmanId,
            salesmanDetails.department,
            year,
            null
        );

        // Generate sales performance evaluations
        const salesPerformanceData = await generateSalesPerformance(db, salesmanId, year);
        evaluation.salesEvaluation = salesPerformanceData;

        // Generate social performance evaluations
        const socialPerformanceData = await generateSocialPerformance(db, salesmanId, year);
        evaluation.socialEvaluation = socialPerformanceData;

        return evaluation;
    } catch (error) {
        throw new Error(`Failed to generate evaluation: ${error.message}`);
    }
}

/**
 * Fetches details for a specific salesman by their ID.
 * 
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman to fetch details for.
 * @returns {Promise<Object|null>} - The fetched details
 * @throws {Error} - If fetching salesman details fails.
 */
async function fetchSalesmanDetails(db, salesmanId) {
    try {
        const salesman = await SalesmanService.readSalesMan(db, salesmanId);
        if (!salesman) {
            throw new Error(`Salesman with ID ${salesmanId} not found`);
        }
        return {
            fullname: `${salesman.firstName} ${salesman.middleName ? salesman.middleName + ' ' : ''}${salesman.lastName}`.trim(),
            department: salesman.department
        };
    } catch (error) {
        console.error(`Failed to fetch salesman details: ${error.message}`);
        return null;
    }
}

/**
 * Generates social performance records for a specific salesman in a given year.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman.
 * @param {number} year - The year for which to generate the social performance records.
 * @returns {Promise<Array>} - The transformed list of social performance records.
 * @throws {Error} - If an error occurs during the process.
 */
async function generateSocialPerformance(db, salesmanId, year) {
    try {
        const socialPerformances = await SalesmanService.readSocialPerformanceRecord(db, salesmanId, year);

        if (!socialPerformances || socialPerformances.length === 0) {
            return [];
        }

        return socialPerformances.map(performance => new SocialPerformance(
            performance._salesmanId,
            performance._socialId,
            performance._description,
            performance._targetValue,
            performance._actualValue,
            performance._year
        ).toJSON());

    } catch (error) {
        console.error('Error generating social performance:', error);
        throw new Error(`Failed to generate social performance: ${error.message}`);
    }
}

/**
 * Calculates the bonus based on customer rating, quantity, and price per unit.
 * @param {number} customerRating - The customer rating (0-3), where 0 is okay and 3 is excellent.
 * @param {number} quantity - The number of units sold.
 * @param {number} pricePerUnit - The price per unit of the product.
 * @returns {number} - The calculated bonus rounded up to the next multiple of 10.
 */
function calculateSalesBonus(customerRating, quantity, pricePerUnit) {
    let bonus = (pricePerUnit * quantity) * 0.05;

    // Bonus multiplier based on customer rating (0-3)
    const ratingMultiplier = {
        0: 1.0,  // Okay rating
        1: 1.5,  // Good rating
        2: 2.0,  // Very good rating
        3: 3.0   // Excellent rating
    }

    // Calculate bonus and round up to next multiple of 10
    bonus = Math.ceil((bonus * ratingMultiplier[customerRating]) / 10) * 10;

    return bonus;
}

/**
 * Generates sales performance records for a specific salesman in a given year.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman.
 * @param {number} year - The year for which to generate the sales performance records.
 * @returns {Promise<Array>} - The list of generated sales performance records.
 * @throws {Error} - If an error occurs during the process.
 */
async function generateSalesPerformance(db, salesmanId, year) {
    try {
        const salesOrders = await SalesOrderService.getSalesmanOrders(db, salesmanId, year);

        if (!salesOrders || salesOrders.length === 0) {
            console.log(`No sales orders found for salesman ${salesmanId} in year ${year}`);
            return [];
        }

        const salesPerformances = [];
        for (const order of salesOrders) {
            const customer = await CustomerService.readCustomer(db, order.customerId);

            const orderPerformances = order.positions.map(position => {
                const bonus = calculateSalesBonus(customer.rating, position.quantity, position.pricePerUnit);
                return {
                    salesmanId: salesmanId,
                    productName: position.product.name,
                    customer: customer.name,
                    customerRating: customer.rating,
                    items: position.quantity,
                    bonus: bonus
                };
            });

            salesPerformances.push(...orderPerformances);
        }

        return salesPerformances;
    } catch (error) {
        console.error('Error generating sales performance:', error);
        throw new Error(`Failed to generate sales performance: ${error.message}`);
    }
}

/**
 * Reads an evaluation record for a specific salesman and year from the database.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman.
 * @param {number} year - The year of the evaluation.
 * @returns {Promise<Evaluation|null>} - The evaluation instance, or null if no evaluation is found.
 * @throws {Error} - If an error occurs during the process.
 */
exports.readEvaluation = async function (db, salesmanId, year) {
    try {
        const evaluationData = await db.collection('evaluation').findOne({
            salesmanId: salesmanId,
            year: year
        });

        if (!evaluationData) {
            return null;
        }

        // Create new Evaluation instance from the database data
        const evaluation = new Evaluation(
            evaluationData.fullname,
            evaluationData.salesmanId,
            evaluationData.department,
            evaluationData.year,
            evaluationData.remark
        );

        // Set the arrays
        evaluation.salesEvaluation = evaluationData.salesEvaluation || [];
        evaluation.socialEvaluation = evaluationData.socialEvaluation || [];

        // Set the boolean flags
        evaluation.acceptedHR = evaluationData.acceptedHR || false;
        evaluation.acceptedCEO = evaluationData.acceptedCEO || false;
        evaluation.acceptedSalesman = evaluationData.acceptedSalesman || false;

        return evaluation;
    } catch (error) {
        console.error('Error reading evaluation:', error);
        throw new Error(`Failed to read evaluation: ${error.message}`);
    }
}

/**
 * Creates a new evaluation record in the database for a specific salesman.
 * @param {Object} db - MongoDB database connection.
 * @param {Object} evaluationData - The data for the evaluation to be created.
 * @returns {Promise<Evaluation>} - The created evaluation instance.
 * @throws {Error} - If an error occurs during the creation process.
 */
exports.createEvaluation = async function (db, evaluationData) {
    try {
        const evaluation = new Evaluation(
            evaluationData.fullname,
            evaluationData.salesmanId,
            evaluationData.department,
            evaluationData.year,
            evaluationData.remark
        );

        // Set optional arrays
        if (evaluationData.salesEvaluation) {
            evaluation.salesEvaluation = evaluationData.salesEvaluation;
        }
        if (evaluationData.socialEvaluation) {
            evaluation.socialEvaluation = evaluationData.socialEvaluation;
        }

        // Set boolean flags
        evaluation.acceptedHR = evaluationData.acceptedHR || false;
        evaluation.acceptedCEO = evaluationData.acceptedCEO || false;
        evaluation.acceptedSalesman = evaluationData.acceptedSalesman || false;

        await db.collection('evaluation').insertOne(evaluation.toJSON());
        return evaluation;
    } catch (error) {
        throw new Error(`Error creating evaluation: ${error.message}`);
    }
}

/**
 * Updates an existing evaluation record in the database for a specific salesman.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman whose evaluation is to be updated.
 * @param {number} year - The year of the evaluation to be updated.
 * @param {Object} evaluationData - The data to update in the evaluation.
 * @returns {Promise<Evaluation>} - The updated evaluation instance.
 * @throws {Error} - If an error occurs during the update process or if the evaluation is not found.
 */
exports.updateEvaluation = async function (db, salesmanId, year, evaluationData) {
    try {
        // First fetch the existing evaluation
        const existingEvaluation = await db.collection('evaluation').findOne({
            salesmanId: salesmanId,
            year: year
        });

        if (!existingEvaluation) {
            throw new Error(`Evaluation for salesman ${salesmanId} in year ${year} not found.`);
        }

        // Create new Evaluation instance with existing data merged with updates
        const evaluation = new Evaluation(
            evaluationData.hasOwnProperty('fullname') ? evaluationData.fullname : existingEvaluation.fullname,
            salesmanId,
            evaluationData.hasOwnProperty('department') ? evaluationData.department : existingEvaluation.department,
            year,
            evaluationData.hasOwnProperty('remark') ? evaluationData.remark : existingEvaluation.remark
        );

        // Set arrays only if provided, otherwise keep existing
        evaluation.salesEvaluation = evaluationData.hasOwnProperty('salesEvaluation')
            ? evaluationData.salesEvaluation
            : existingEvaluation.salesEvaluation || [];

        evaluation.socialEvaluation = evaluationData.hasOwnProperty('socialEvaluation')
            ? evaluationData.socialEvaluation
            : existingEvaluation.socialEvaluation || [];

        // Set boolean flags only if provided, otherwise keep existing
        evaluation.acceptedHR = evaluationData.hasOwnProperty('acceptedHR')
            ? evaluationData.acceptedHR
            : existingEvaluation.acceptedHR || false;

        evaluation.acceptedCEO = evaluationData.hasOwnProperty('acceptedCEO')
            ? evaluationData.acceptedCEO
            : existingEvaluation.acceptedCEO || false;

        evaluation.acceptedSalesman = evaluationData.hasOwnProperty('acceptedSalesman')
            ? evaluationData.acceptedSalesman
            : existingEvaluation.acceptedSalesman || false;

        // Update using the toJSON method
        await db.collection('evaluation').updateOne(
            { salesmanId: salesmanId, year: year },
            { $set: evaluation.toJSON() }
        );

        return evaluation;
    } catch (error) {
        throw new Error(`Error updating evaluation: ${error.message}`);
    }
}

/**
 * Delete an evaluation record for a specific salesman and year from the database.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman.
 * @param {number} year - The year of the evaluation.
 * @returns {Promise<Evaluation|null>} - The evaluation instance, or null if no evaluation is found.
 * @throws {Error} - If an error occurs during the process.
 */
exports.deleteEvaluation = async function (db, salesmanId, year) {
    try {
        await db.collection('evaluation').deleteOne({
            salesmanId: salesmanId,
            year: year
        });
    } catch (error) {
        console.error('Error deleting evaluation:', error);
        throw new Error(`Failed to delete evaluation: ${error.message}`);
    }
}

/**
 * Marks the evaluation as accepted by HR for a specific salesman and year.
 * If all evaluation acceptance flags are true, adds a bonus salary for the salesman.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman whose evaluation is to be accepted by HR.
 * @param {number} year - The year of the evaluation to be accepted.
 * @returns {Promise<Evaluation>} - The updated evaluation instance after HR's acceptance.
 * @throws {Error} - If an error occurs during the process or if the evaluation is not found.
 */
exports.acceptHR = async function (db, salesmanId, year) {
    try {
        const result = await db.collection('evaluation').updateOne(
            { salesmanId: salesmanId, year: year },
            { $set: { acceptedHR: true } }
        );

        if (result.matchedCount === 0) {
            throw new Error(`Evaluation for salesman ${salesmanId} in year ${year} not found.`);
        }

        const evaluation = await exports.readEvaluation(db, salesmanId, year);

        // Check if all flags are true
        if (evaluation.acceptedHR && evaluation.acceptedCEO && evaluation.acceptedSalesman) {
            await SalesmanService.addBonusSalary(db, salesmanId, year, evaluation.totalBonus);
            SalesmanService.updateBonusSalarieToOrangeHRM(db, salesmanId);
        }

        return evaluation;
    } catch (error) {
        throw new Error(`Error accepting evaluation by HR: ${error.message}`);
    }
}

/**
 * Marks the evaluation as accepted by the CEO for a specific salesman and year.
 * If all evaluation acceptance flags are true, adds a bonus salary for the salesman.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman whose evaluation is to be accepted by the CEO.
 * @param {number} year - The year of the evaluation to be accepted.
 * @returns {Promise<Evaluation>} - The updated evaluation instance after CEO's acceptance.
 * @throws {Error} - If an error occurs during the process or if the evaluation is not found.
 */
exports.acceptCEO = async function (db, salesmanId, year) {
    try {
        const result = await db.collection('evaluation').updateOne(
            { salesmanId: salesmanId, year: year },
            { $set: { acceptedCEO: true } }
        );

        if (result.matchedCount === 0) {
            throw new Error(`Evaluation for salesman ${salesmanId} in year ${year} not found.`);
        }

        const evaluation = await exports.readEvaluation(db, salesmanId, year);

        // Check if all flags are true
        if (evaluation.acceptedHR && evaluation.acceptedCEO && evaluation.acceptedSalesman) {
            await SalesmanService.addBonusSalary(db, salesmanId, year, evaluation.totalBonus);
            SalesmanService.updateBonusSalarieToOrangeHRM(db, salesmanId);
        }

        return evaluation;
    } catch (error) {
        throw new Error(`Error accepting evaluation by CEO: ${error.message}`);
    }
}

/**
 * Marks the evaluation as accepted by the salesman for a specific year.
 * If all evaluation acceptance flags are true, adds a bonus salary for the salesman.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - The ID of the salesman whose evaluation is to be accepted.
 * @param {number} year - The year of the evaluation to be accepted.
 * @returns {Promise<Evaluation>} - The updated evaluation instance after the salesman's acceptance.
 * @throws {Error} - If an error occurs during the process or if the evaluation is not found.
 */
exports.acceptSalesman = async function (db, salesmanId, year) {
    try {
        const result = await db.collection('evaluation').updateOne(
            { salesmanId: salesmanId, year: year },
            { $set: { acceptedSalesman: true } }
        );

        if (result.matchedCount === 0) {
            throw new Error(`Evaluation for salesman ${salesmanId} in year ${year} not found.`);
        }

        const evaluation = await exports.readEvaluation(db, salesmanId, year);

        // Check if all flags are true
        if (evaluation.acceptedHR && evaluation.acceptedCEO && evaluation.acceptedSalesman) {
            await SalesmanService.addBonusSalary(db, salesmanId, year, evaluation.totalBonus);
            SalesmanService.updateBonusSalarieToOrangeHRM(db, salesmanId);
        }

        return evaluation;
    } catch (error) {
        throw new Error(`Error accepting evaluation by salesman: ${error.message}`);
    }
}