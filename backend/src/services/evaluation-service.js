const Evaluation = require('../models/Evaluation');
const SalesPerformance = require('../models/SalesPerformance');
const SocialPerformance = require('../models/SocialPerformance');
const SalesmanService = require('../services/salesmen-service');
const SalesOrderService = require('../services/salesorder-service');

async function generateEvaluation(db, salesmanId, year) {
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
            console.log(`No social performance records found for salesman ${salesmanId} in year ${year}`);
            return [];
        }

        return socialPerformances;
    } catch (error) {
        console.error('Error generating social performance:', error);
        throw new Error(`Failed to generate social performance: ${error.message}`);
    }
}

async function generateSalesPerformance(db, salesmanId, year) {
    try {
        // Fetch all sales orders for the salesman in the given year
        const salesOrders = await SalesOrderService.getSalesmanOrders(db, salesmanId, year);
        
        if (!salesOrders || salesOrders.length === 0) {
            console.log(`No sales orders found for salesman ${salesmanId} in year ${year}`);
            return [];
        }

        // Create a SalesPerformance for each position in each sales order
        const salesPerformances = salesOrders.flatMap(order => {
            // Each order has positions array
            return order.positions.map(position => {
                return new SalesPerformance(
                    salesmanId,
                    position.productName,
                    order.customerName,
                    'poor', // Using 'poor' as default ranking as requested
                    position.amount // Using the amount field from the position
                );
            });
        });

        return salesPerformances;
    } catch (error) {
        console.error('Error generating sales performance:', error);
        throw new Error(`Failed to generate sales performance: ${error.message}`);
    }
}

module.exports = {
  generateEvaluation
};