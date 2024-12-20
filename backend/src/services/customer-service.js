const hrm = require('./adapters/hrm.js');
const odoo = require('./adapters/odoo.js');
const crm = require('./adapters/crm.js');
const Customer   = require('../models/Customer.js');
const util = require('../utils/util.js');

/**
 * Retrieves and processes all customers accounts from OpenCRX.
 * @returns {Promise<Array<Object>>} Array of processed customer objects ready for MongoDB insertion.
 * @throws {Error} If there's an error fetching or processing the accounts.
 */
exports.getAllCustomersFromOpenCRX = async () => {
    try {
        const accounts = await crm.queryAllAccounts();
        
        // Filter accounts by type
        const legalEntities = accounts.filter(account => 
            account['@type'] === 'org.opencrx.kernel.account1.LegalEntity'
        );

        let customerIdCounter = 1;
        const processedLegalEntities = legalEntities.map(entity => {
            try {
                return new Customer(
                    customerIdCounter++,
                    util.extractUID(entity['vcard']),
                    entity['fullName']?.trim() || '',
                    entity['accountRating'] || 0
                ).toJSON();
            } catch (error) {
                console.warn(`Skipping invalid customer ${entity['fullName']}: ${error.message}`);
                return null;
            }
        }).filter(customer => customer !== null);
        return processedLegalEntities;
    } catch (error) {
        console.error('Error getting all customers:', error);
        throw new Error('Failed to fetch customers: ' + error.message);
    }
}

/**
 * Fetches customers from OpenCRX and inserts new records into MongoDB.
 * Only inserts records that don't already exist (based on uid).
 * Existing records are left unchanged.
 * @param {Object} db - MongoDB database connection.
 */
exports.updateCustomersFromOpenCRX = async (db) => {
    const customers = await this.getAllCustomersFromOpenCRX(db);
    try {
        for (let customer of customers) {
            const existingCustomer = await db.collection('customers').findOne({ uid: customer.uid });
            if (!existingCustomer) {
                await db.collection('customers').insertOne(customer);
            }
        }
    } catch (error) {
        console.error('Failed to update customers:', error);
        throw error;
    }
}

/**
 * Retrieves the MongoDB _id for a customer based on their OpenCRX UID
 * @param {Object} db - MongoDB database connection
 * @param {string} uid - The OpenCRX UID of the customer
 * @returns {Promise<string|null>} The MongoDB _id if found, null otherwise
 */
exports.getCustomerIdByUid = async (db, uid) => {
    if (!uid) return null;
    
    try {
        const customer = await db.collection('customers').findOne(
            { uid }, 
            { projection: { customerId: 1 } }
        );
        return customer ? customer.customerId : null;
    } catch (error) {
        console.error('Error finding customer by UID:', error);
        return null;
    }
};

exports.readCustomer = async (db, customerId) => {
    return await db.collection('customers').findOne({ customerId });
};