const hrm = require('./adapters/hrm.js');
const odoo = require('./adapters/odoo.js');
const employeeMapper = require('./employees-mapper-service.js');
const Salesman = require('../models/Salesman.js');
const SocialPerformance = require('../models/SocialPerformance.js');

/**
 * Queries all senior salesmen from OrangeHRM and Odoo systems, merges the data, and stores unique entries in MongoDB.
 * @param {Object} db - MongoDB database connection.
 */
exports.queryAllSeniorSalesMen = async (db)=> {
    try {
        const seniorSalesMenOrangeHrm = (await hrm.queryAllEmployees()).filter(employee => employee['jobTitle'] === 'Senior Salesman');
        const seniorSalesMenOdoo = (await odoo.getAllEmployees()).filter(employee => employee['job_title'] === 'Senior Salesperson');
        const mergedSalesMenList = await employeeMapper.mergeEmployeeRecords(seniorSalesMenOdoo, seniorSalesMenOrangeHrm);
        let addedCountHrm = 0;
        let addedCountOdoo = 0;
        for (let seniorSalesMan of mergedSalesMenList) {
            try {
                const exists = await db.collection('salesmen').findOne({ sid: seniorSalesMan.sid });
                if (!exists) {
                    await db.collection('salesmen').insertOne(seniorSalesMan);
                    if (seniorSalesMan.sourceSystem === 'orangehrm') addedCountHrm++;
                    if (seniorSalesMan.sourceSystem === 'odoo') addedCountOdoo++;
                }
            } catch (error) {
                console.error(`Error processing senior salesman ${seniorSalesMan.fullName}:`, error);
            }
        }
        console.log(`${addedCountHrm} new senior salesmen added from OrangeHRM and ${addedCountOdoo} from Odoo.`);
    } catch (error) {
        throw new Error(`Error querying salesmen from OrangeHRM and/or Odoo: ${error.message}`);
    }
};

/**
 * Creates a new salesman record in MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {Object} salesmanData - Data for the new salesman.
 * @returns {Promise<Object>} - The result of the insert operation.
 */
exports.createSalesMan = async (db, salesmanData) => {
    try {
        const salesman = new Salesman(
            salesmanData.sid,
            salesmanData.uid,
            salesmanData.firstName,
            salesmanData.middleName,
            salesmanData.lastName,
            salesmanData.bonusSalary,
            salesmanData.jobTitle,
            salesmanData.employeeId,
            salesmanData.gender
        );
        return await db.collection('salesmen').insertOne(salesman);
    } catch (error) {
        throw new Error(`Error creating salesman: ${error.message}`);
    }
};

/**
 * Creates a new social performance record for a salesman in MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {Object} performanceRecordData - Data for the performance record.
 * @returns {Promise<Object>} - The result of the insert operation.
 */
exports.createSocialPerformanceRecord = async (db, performanceRecordData) => {
    try {
        const performanceRecord = new SocialPerformance(
            performanceRecordData.sid,
            performanceRecordData.goalId,
            performanceRecordData.description,
            performanceRecordData.targetValue,
            performanceRecordData.actualValue,
            performanceRecordData.year
        );
        return await db.collection('performance').insertOne(performanceRecord);
    } catch (error) {
        throw new Error(`Error creating performance: ${error.message}`);
    }
};

/**
 * Reads a salesman record by their ID from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} sid - Salesman ID to query.
 * @returns {Promise<Object|null>} - The salesman record or null if not found.
 */
exports.readSalesMan = async (db, sid) => {
    try {
        return await db.collection('salesmen').findOne({ _sid: parseInt(sid) });
    } catch (error) {
        throw new Error(`Error reading salesman: ${error.message}`);
    }
};

/**
 * Reads all salesman records from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @returns {Promise<Array>} - Array of all salesman records.
 */
exports.readAllSalesMen = async (db) => {
    try {
        return await db.collection('salesmen').find({}).toArray();
    } catch (error) {
        throw new Error(`Error reading all salesmen: ${error.message}`);
    }
};


/**
 * Reads social performance records for a salesman by their ID and optional year.
 * @param {Object} db - MongoDB database connection.
 * @param {number} sid - Salesman ID to query.
 * @param {number} [year] - Optional year to filter the records.
 * @returns {Promise<Array>} - Array of matching social performance records.
 */
exports.readSocialPerformanceRecord = async (db, sid, year) => {
    try {
        const query = { _sid: parseInt(sid) };
        if (year) {
            query._year = parseInt(year); // Add the year to the query if it's provided
        }
        return performanceRecords = await db.collection('performance').find(query).toArray();
    } catch (error) {
        throw new Error(`Error reading social performance records: ${error.message}`);
    }
};

/**
 * Updates a salesman record in MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} sid - Salesman ID to update.
 * @param {Object} salesmanData - Data to update in the salesman record.
 * @returns {Promise<Object>} - The result of the update operation.
 */
exports.updateSalesMan = async (db, sid, salesmanData) => {
    try {
        const updateQuery = { $set: {} };

        if (salesmanData.uid) updateQuery.$set._uid = salesmanData.uid;
        if (salesmanData.firstName) updateQuery.$set._firstName = salesmanData.firstName;
        if (salesmanData.middleName) updateQuery.$set._middleName = salesmanData.middleName;
        if (salesmanData.lastName) updateQuery.$set._lastName = salesmanData.lastName;
        if (salesmanData.bonusSalary) updateQuery.$set._bonusSalary = salesmanData.bonusSalary;
        if (salesmanData.jobTitle) updateQuery.$set._jobTitle = salesmanData.jobTitle;
        if (salesmanData.employeeId) updateQuery.$set._employeeId = salesmanData.employeeId;
        if (salesmanData.gender) updateQuery.$set._gender = salesmanData.gender;

        updateQuery.$set._sid = parseInt(sid);

        const result = await db.collection('salesmen').updateOne(
            { _sid: parseInt(sid) },
            updateQuery
        );

        if (result.matchedCount === 0) {
            throw new Error(`SalesMan with sid ${sid} not found.`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error updating salesman: ${error.message}`);
    }
};

/**
 * Deletes a salesman record from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} sid - Salesman ID to delete.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
exports.deleteSalesMan = async (db, sid) => {
    try {
        return await db.collection('salesmen').deleteOne({ _sid: parseInt(sid) });
    } catch (error) {
        throw new Error(`Error deleting salesman: ${error.message}`);
    }
};


/**
 * Deletes social performance records for a salesman by their ID and optional year from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} sid - Salesman ID whose records to delete.
 * @param {number} [year] - Optional year to filter the records.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
exports.deleteSocialPerformanceRecord = async (db, sid, year) => {
    try {
        const query = { _sid: parseInt(sid) };
        if (year) {
            query._year = parseInt(year); // Add the year to the query if it's provided
        }
        return result = await db.collection('performance').deleteMany(query);
    } catch (error) {
        throw new Error(`Error deleting social performance record: ${error.message}`);
    }
};
