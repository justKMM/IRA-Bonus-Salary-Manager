const hrm = require('./adapters/hrm.js');
const odoo = require('./adapters/odoo.js');
// Query from other sources
// OrangeHRM + Odoo
exports.queryAllSeniorSalesMen = async (db)=> {
    try {
        const seniorSalesMenOrangeHrm = (await hrm.queryAllEmployees()).data.filter(employee => employee.jobTitle === 'Senior Salesman');
        // const seniorSalesMenOdoo = (await odoo.getAllEmployees()).data.filter(employee => employee.job_title === 'Senior Salesperson');
        let addedCount = 0;
        // From OrangeHRM
        for (const seniorSalesMan of seniorSalesMenOrangeHrm) {
            try {
                const exists = await db.collection('salesmen').findOne({ employeeId: seniorSalesMan.employeeId });
                if (!exists) {
                    await db.collection('salesmen').insertOne(seniorSalesMan);
                    addedCount++;
                }
            } catch (error) {
                console.error(`Error processing senior salesman ${seniorSalesMan.fullName}:`, error);
            }
        }
        console.log(`${addedCount} new senior salesmen added from OrangeHRM.`);
    } catch (error) {
        throw new Error(`Error querying salesmen from OrangeHRM: ${error.message}`);
    }
};

// Query from MongoDB
// C - Create
exports.createSalesMan = async (db, salesMan) => {
    try {
        return await db.collection('salesmen').insertOne(salesMan);
    } catch (error) {
        throw new Error(`Error creating salesman: ${error.message}`);
    }
};

exports.createSocialPerformanceRecord = async (db, performanceRecord, sid) => {
    try {
        return await db.collection('salesmen').updateOne(
            { sid: sid },
            { $push: { socialPerformanceRecords: performanceRecord } }
        );
    } catch (error) {
        throw new Error(`Error creating social performance record: ${error.message}`);
    }
};

// R - Read
exports.readSalesMan = async (db, sid) => {
    try {
        return await db.collection('salesmen').findOne({ sid: sid });
    } catch (error) {
        throw new Error(`Error reading salesman: ${error.message}`);
    }
};

exports.readAllSalesMen = async (db) => {
    try {
        return await db.collection('salesmen').find({}).toArray();
    } catch (error) {
        throw new Error(`Error reading all salesmen: ${error.message}`);
    }
};

exports.readSocialPerformanceRecord = async (db, sid) => {
    try {
        const salesMan = await db.collection('salesmen').findOne(
            { sid: sid },
            { projection: { socialPerformanceRecords: 1 } }
        );
        return salesMan ? salesMan.socialPerformanceRecords : null;
    } catch (error) {
        throw new Error(`Error reading social performance records: ${error.message}`);
    }
};

exports.readSocialPerformanceRecordByYear = async (db, sid, year) => {
    try {
        const salesMan = await db.collection('salesmen').findOne(
            { 
                sid: sid,
                "socialPerformanceRecords.year": year 
            },
            { projection: { "socialPerformanceRecords.$": 1 } }
        );
        return salesMan?.socialPerformanceRecords[0] || null;
    } catch (error) {
        throw new Error(`Error reading social performance record by year: ${error.message}`);
    }
};

// U - Update
exports.updateSalesMan = async (db, sid, salesMan) => {
    try {
        return await db.collection('salesmen').updateOne(
            { sid: sid },
            { $set: salesMan }
        );
    } catch (error) {
        throw new Error(`Error updating salesman: ${error.message}`);
    }
};

// D - Delete
exports.deleteSalesMan = async (db, sid) => {
    try {
        return await db.collection('salesmen').deleteOne({ sid: sid });
    } catch (error) {
        throw new Error(`Error deleting salesman: ${error.message}`);
    }
};

exports.deleteSocialPerformanceRecord = async (db, sid, year) => {
    try {
        return await db.collection('salesmen').updateOne(
            { sid: sid },
            { 
                $pull: { 
                    socialPerformanceRecords: { year: year } 
                }
            }
        );
    } catch (error) {
        throw new Error(`Error deleting social performance record: ${error.message}`);
    }
};

exports.deleteAllSocialPerformanceRecords = async (db, sid) => {
    try {
        return await db.collection('salesmen').updateOne(
            { sid: sid },
            { $set: { socialPerformanceRecords: [] } }
        );
    } catch (error) {
        throw new Error(`Error deleting all social performance records: ${error.message}`);
    }
};