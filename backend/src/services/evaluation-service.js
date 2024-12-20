const Evaluation = require('../models/Evaluation');
const SalesPerformance = require('../models/SalesPerformance');
const SocialPerformance = require('../models/SocialPerformance');
const SalesmanService = require('../services/salesmen-service');
const SalesOrderService = require('../services/salesorder-service');
const CustomerService = require('./customer-service');

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
    const salesPerformanceData = await generateSalesPerformance(db,salesmanId, year);
    evaluation.salesEvaluation = salesPerformanceData;

    // Generate social performance evaluations
    const socialPerformanceData = await generateSocialPerformance(db, salesmanId, year);
    evaluation.socialEvaluation = socialPerformanceData;

    return evaluation;
  } catch (error) {
    throw new Error(`Failed to generate evaluation: ${error.message}`);
  }
}

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

async function generateSocialPerformance(db, salesmanId, year) {
    try {
        const socialPerformances = await SalesmanService.readSocialPerformanceRecord(db, salesmanId, year);
        
        if (!socialPerformances || socialPerformances.length === 0) {
            return [];
        }

        // Transform the social performances to remove underscores
        return socialPerformances.map(performance => ({
            salesmanId: performance._salesmanId,
            socialId: performance._socialId,
            description: performance._description,
            targetValue: performance._targetValue,
            actualValue: performance._actualValue,
            year: performance._year
        }));

    } catch (error) {
        console.error('Error generating social performance:', error);
        throw new Error(`Failed to generate social performance: ${error.message}`);
    }
}

function calculateBonus(customerRating, quantity, pricePerUnit) {
    let bonus = (pricePerUnit * quantity) * 0.05;

    // Bonus multiplier based on customer rating (0-3)
    const ratingMultiplier = {
        0: 1.0,  // Okay rating
        1: 1.5,  // Good rating
        2: 2.0,  // Very good rating
        3: 3.0   // Excellent rating
    }

    // Calculate total bonus and round up to next multiple of 10
    bonus = Math.ceil((bonus * ratingMultiplier[customerRating]) / 10) * 10;

    return bonus;
}

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
                const bonus = calculateBonus(customer.rating, position.quantity, position.pricePerUnit);
                return {
                    salesmanId: salesmanId,
                    productName: position.product.name,
                    customer: order.name,
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
        evaluation.acceptedCEO = evaluationData.acceptedCEO || false;
        evaluation.acceptedSalesman = evaluationData.acceptedSalesman || false;

        return evaluation;
    } catch (error) {
        console.error('Error reading evaluation:', error);
        throw new Error(`Failed to read evaluation: ${error.message}`);
    }
}

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
        evaluation.acceptedCEO = evaluationData.acceptedCEO || false;
        evaluation.acceptedSalesman = evaluationData.acceptedSalesman || false;

        await db.collection('evaluation').insertOne(evaluation.toJSON());
        return evaluation;
    } catch (error) {
        throw new Error(`Error creating evaluation: ${error.message}`);
    }
}

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