const hrm = require('./adapters/hrm.js');
const odoo = require('./adapters/odoo.js');
const crm = require('./adapters/crm.js');
const employeeMapper = require('./employees-mapper-service.js');
const Salesman = require('../models/Salesman.js');
const SocialPerformance = require('../models/SocialPerformance.js');
const util = require('../utils/util.js');

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
                const exists = await db.collection('salesmen').findOne({ salesmanId: seniorSalesMan.salesmanId });
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
 * @returns {Salesman} The created salesman
 * @throws {Error} If there's an error during salesman creation
 */
exports.createSalesMan = async (db, salesmanData) => {
    try {
        const salesman = new Salesman(
            salesmanData.salesmanId,
            salesmanData.uid,
            salesmanData.employeeId,
            salesmanData.firstName,
            salesmanData.middleName,
            salesmanData.lastName,
            salesmanData.bonusSalary,
            salesmanData.jobTitle,
            salesmanData.department,
            salesmanData.gender
        );
        await db.collection('salesmen').insertOne(salesman.toJSON());
        return salesman;
    } catch (error) {
        throw new Error(`Error creating salesman: ${error.message}`);
    }
};

/**
 * Creates a new social performance record for a salesman in MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {Object} performanceRecordData - Data for the performance record.
 * @returns {SocialPerformance} The created performance record
 * @throws {Error} If there's an error during performance record creation
 */
exports.createSocialPerformanceRecord = async (db, socialPerformanceData) => {
    try {
        const socialPerformance = new SocialPerformance(
            socialPerformanceData.salesmanId,
            socialPerformanceData.socialId,
            socialPerformanceData.description,
            socialPerformanceData.targetValue,
            socialPerformanceData.actualValue,
            socialPerformanceData.year
        );
        await db.collection('socialperformance').insertOne(socialPerformance.toJSON());
        return socialPerformance;
    } catch (error) {
        throw new Error(`Error creating performance: ${error.message}`);
    }
};


exports.createSalesPerformanceRecord = async (db, performanceRecordData) => {
    //TODO: Implement this function
}


/**
 * Reads a salesman record by their ID from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - Salesman ID to query.
 * @returns {Salesman} - The salesman record or null if not found.
 */
exports.readSalesMan = async (db, salesmanId) => {
    try {
        const salesmanDoc = await db.collection('salesmen').findOne({ salesmanId: parseInt(salesmanId) });
        if (!salesmanDoc) return null;
        const salesman = new Salesman(
            salesmanDoc.salesmanId,
            salesmanDoc.uid,
            salesmanDoc.employeeId,
            salesmanDoc.firstName,
            salesmanDoc.middleName,
            salesmanDoc.lastName,
            salesmanDoc.bonusSalary,
            salesmanDoc.jobTitle,
            salesmanDoc.department,
            salesmanDoc.gender
        );
        return salesman;
    } catch (error) {
        throw new Error(`Error reading salesman: ${error.message}`);
    }
};

/**
 * Reads all salesman records from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @returns {Salesman<Array>} - Array of all salesman records.
 */
exports.readAllSalesMen = async (db) => {
    try {
        const salesmenDocs = await db.collection('salesmen').find({}).toArray();
        return salesmenDocs.map(doc => new Salesman(
            doc.salesmanId,
            doc.uid,
            doc.employeeId,
            doc.firstName,
            doc.middleName,
            doc.lastName,
            doc.bonusSalary,
            doc.jobTitle,
            doc.department,
            doc.gender
        ));
    } catch (error) {
        throw new Error(`Error reading all salesmen: ${error.message}`);
    }
};


/**
 * Reads social performance records for a salesman by their ID and optional year.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - Salesman ID to query.
 * @param {number} [year] - Optional year to filter the records.
 * @returns {SocialPerformance<Array>} - Array of matching social performance records.
 */
exports.readSocialPerformanceRecord = async (db, salesmanId, year) => {
    try {
        const query = { salesmanId: parseInt(salesmanId) };
        if (year) {
            query.year = parseInt(year); // Add the year to the query if it's provided
        }
        const performanceRecords = await db.collection('socialperformance').find(query).toArray();
        return performanceRecords.map(doc => new SocialPerformance(
            doc.salesmanId,
            doc.socialId,
            doc.description,
            doc.targetValue,
            doc.actualValue,
            doc.year
        ));
    } catch (error) {
        throw new Error(`Error reading social performance records: ${error.message}`);
    }
};

/**
 * Updates a salesman record in MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - Salesman ID to update.
 * @param {Object} salesmanData - Data to update in the salesman record.
 * @returns {Promise<Object>} - The result of the update operation.
 */
exports.updateSalesMan = async (db, salesmanId, salesmanData) => {
    try {
        const existingSalesman = await db.collection('salesmen').findOne({ salesmanId: parseInt(salesmanId) });
        
        if (!existingSalesman) {
            throw new Error(`SalesMan with salesmanId ${salesmanId} not found.`);
        }

        // Create new Salesman instance with existing data merged with updates
        const salesman = new Salesman(
            parseInt(salesmanId),
            salesmanData.hasOwnProperty('uid') ? salesmanData.uid : existingSalesman.uid,
            salesmanData.hasOwnProperty('employeeId') ? salesmanData.employeeId : existingSalesman.employeeId,
            salesmanData.hasOwnProperty('firstName') ? salesmanData.firstName : existingSalesman.firstName,
            salesmanData.hasOwnProperty('middleName') ? salesmanData.middleName : existingSalesman.middleName,
            salesmanData.hasOwnProperty('lastName') ? salesmanData.lastName : existingSalesman.lastName,
            salesmanData.hasOwnProperty('bonusSalary') ? salesmanData.bonusSalary : existingSalesman.bonusSalary,
            salesmanData.hasOwnProperty('jobTitle') ? salesmanData.jobTitle : existingSalesman.jobTitle,
            salesmanData.hasOwnProperty('department') ? salesmanData.department : existingSalesman.department,
            salesmanData.hasOwnProperty('gender') ? salesmanData.gender : existingSalesman.gender
        );

        const updateQuery = {
            $set: {
                salesmanId: salesman.salesmanId,
                uid: salesman.uid,
                employeeId: salesman.employeeId,
                firstName: salesman.firstName,
                middleName: salesman.middleName,
                lastName: salesman.lastName,
                bonusSalary: salesman.bonusSalary,
                jobTitle: salesman.jobTitle,
                department: salesman.department,
                gender: salesman.gender
            }
        };

        await db.collection('salesmen').updateOne(
            { salesmanId: parseInt(salesmanId) },
            updateQuery
        );

        return salesman;
    } catch (error) {
        throw new Error(`Error updating salesman: ${error.message}`);
    }
};

/**
 * Updates a social performance record in MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - Salesman ID to update.
 * @param {number} socialId - Social ID to update.
 * @param {Object} performanceData - Data to update in the performance record.
 * @returns {Promise<SocialPerformance>} - The updated performance record.
 * @throws {Error} If there's an error during the update operation.
 */
exports.updateSocialPerformanceRecord = async (db, salesmanId, socialId, performanceData) => {
    try {
        const existingRecord = await db.collection('socialperformance').findOne({ 
            salesmanId: parseInt(salesmanId),
            socialId: parseInt(socialId)
        });
        
        if (!existingRecord) {
            throw new Error(`Social performance record with salesmanId ${salesmanId} and socialId ${socialId} not found.`);
        }

        // Create new SocialPerformance instance with existing data merged with updates
        const socialPerformance = new SocialPerformance(
            parseInt(salesmanId),
            parseInt(socialId),
            performanceData.hasOwnProperty('description') ? performanceData.description : existingRecord.description,
            performanceData.hasOwnProperty('targetValue') ? performanceData.targetValue : existingRecord.targetValue,
            performanceData.hasOwnProperty('actualValue') ? performanceData.actualValue : existingRecord.actualValue,
            performanceData.hasOwnProperty('year') ? performanceData.year : existingRecord.year
        );

        await db.collection('performance').updateOne(
            { 
                salesmanId: parseInt(salesmanId),
                socialId: parseInt(socialId)
            },
            { $set: socialPerformance.toJSON() }
        );

        return socialPerformance;
    } catch (error) {
        throw new Error(`Error updating social performance record: ${error.message}`);
    }
};

/**
 * Deletes a salesman record from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - Salesman ID to delete.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
exports.deleteSalesMan = async (db, salesmanId) => {
    try {
        return await db.collection('salesmen').deleteOne({ salesmanId: parseInt(salesmanId) });
    } catch (error) {
        throw new Error(`Error deleting salesman: ${error.message}`);
    }
};

/**
 * Deletes social performance records for a salesman by their ID and optional year from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - Salesman ID whose records to delete.
 * @param {number} [year] - Optional year to filter the records.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
exports.deleteSocialPerformanceRecordByYear = async (db, salesmanId, year) => {
    try {
        const query = { salesmanId: parseInt(salesmanId) };
        if (year) {
            query.year = parseInt(year); // Add the year to the query if it's provided
        }
        return result = await db.collection('socialperformance').deleteMany(query);
    } catch (error) {
        throw new Error(`Error deleting social performance record: ${error.message}`);
    }
};

/**
 * Deletes a social performance record by salesmanId and socialId from MongoDB.
 * @param {Object} db - MongoDB database connection.
 * @param {number} salesmanId - Salesman ID whose record to delete.
 * @param {number} socialId - Social ID whose record to delete.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
exports.deleteSocialPerformanceRecordBySocialId = async (db, salesmanId, socialId) => {
    try {
        return result = await db.collection('socialperformance').deleteOne({ salesmanId: parseInt(salesmanId), socialId: parseInt(socialId) });
    } catch (error) {
        throw new Error(`Error deleting social performance record: ${error.message}`);
    }
};

/**
 * Retrieves and processes all senior salesmen accounts from OpenCRX.
 * @returns {Promise<Array<Object>>} Array of processed salesman objects ready for MongoDB insertion.
 * @throws {Error} If there's an error fetching or processing the accounts.
 */
exports.getAllSalesmenFromOpenCRX = async () => {
    try {
        const accounts = await crm.queryAllAccounts();
        
        // Filter accounts to get only Contact type accounts with Senior Salesman job title
        const salesmen = accounts.filter(account => 
            account['@type'] === 'org.opencrx.kernel.account1.Contact' &&
            account['jobTitle'] === 'Senior Salesman'
        );

        const processedSalesmen = salesmen.map(contact => {
            try {
                // Map OpenCRX gender codes to expected string values
                // OpenCRX: 1 = male, 2 = female, 0 = not specified
                const genderMap = {
                    1: 'male',
                    2: 'female',
                    0: null
                };
                
                return new Salesman(
                    contact['governmentId'] || null,
                    util.extractUID(contact['vcard']),
                    null, // employeeId - not available in OpenCRX
                    contact['firstName'] || '',
                    contact['middleName'] || '',
                    contact['lastName'] || '',
                    0, // bonusSalary - not available in OpenCRX
                    contact['jobTitle'] || '',
                    contact['department'] || '',
                    genderMap[contact['gender']] || null
                ).toJSON();
            } catch (error) {
                console.warn(`Skipping invalid salesman ${contact['fullName']}: ${error.message}`);
                return null;
            }
        }).filter(salesman => salesman !== null);
        
        return processedSalesmen;
    } catch (error) {
        console.error('Error getting all salesmen:', error);
        throw new Error('Failed to fetch salesmen: ' + error.message);
    }
}

/**
 * Fetches salesmen from OpenCRX and inserts new records into MongoDB.
 * Only inserts records that don't already exist (based on salesmanId).
 * Existing records are left unchanged.
 * @param {Object} db - MongoDB database connection.
 */
exports.updateSalesmenFromOpenCRX = async (db) => {
    const salesmen = await this.getAllSalesmenFromOpenCRX();
    try {
        for (let salesman of salesmen) {
            const existingSalesman = await db.collection('salesmen').findOne({ salesmanId: salesman.salesmanId });
            if (!existingSalesman) {
            await db.collection('salesmen').insertOne(salesman);
            }
        }
    } catch (error) {
        console.error('Failed to update salesmen:', error);
        throw error;
    }
}

/**
 * Retrieves the MongoDB _id for a salesman based on their OpenCRX UID
 * @param {Object} db - MongoDB database connection
 * @param {string} uid - The OpenCRX UID of the salesman
 * @returns {Promise<string|null>} The MongoDB _id if found, null otherwise
 */
exports.getSalesmanIdByUid = async (db, uid) => {
    if (!uid) return null;
    
    try {
        const salesman = await db.collection('salesmen').findOne({ uid: uid});
        return salesman ? salesman.salesmanId : null;
    } catch (error) {
        console.error('Error finding salesman by UID:', error);
        return null;
    }
};