const SalesMenService = require('../services/salesmen-service');

/**
 * Updates the list of senior salesmen in the database.
 * This function retrieves all senior salesmen and ensures the list is up-to-date.
 *
 * @param {Object} db - The database connection object.
 */
exports.updateSalesMenList = async function (db) {
    await SalesMenService.queryAllSeniorSalesMen(db);
};

/**
 * Creates a new SalesMan entry in the database.
 *
 * @param {Object} req - The request object containing SalesMan data in the body.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.createSalesMan = async function (req, res) {
    try {
        const result = await SalesMenService.createSalesMan(req.app.get('db'), req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Creates a new social performance record for a specific SalesMan.
 *
 * @param {Object} req - The request object containing performance data in the body and SalesMan ID in the parameters.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.createPerformance = async function (req, res) {
    try {
        const result = await SalesMenService.createSocialPerformanceRecord(req.app.get('db'), req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves details of a specific SalesMan by their ID (salesmanId).
 *
 * @param {Object} req - The request object containing the SalesMan ID in the parameters.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.getSalesMan = async function (req, res) {
    try {
        const salesMan = await SalesMenService.readSalesMan(req.app.get('db'), req.params.salesmanId);
        if (salesMan) {
            res.status(200).json(salesMan);
        } else {
            res.status(404).json({ message: `SalesMan with salesmanId ${req.params.salesmanId} not found.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves a list of all SalesMen in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.getAllSalesMen = async function (req, res){
    try {
        const result = await SalesMenService.readAllSalesMen(req.app.get('db'));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves all social performance records for a specific SalesMan, optionally filtered by year.
 *
 * @param {Object} req - The request object containing the SalesMan ID in the parameters and year in the query.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.getPerformancesFromSalesMan = async function (req, res){
    try {
        const performance = await SalesMenService.readSocialPerformanceRecord(req.app.get('db'), req.params.salesmanId, req.query.year);

        // Check if the performance array is empty
        if (performance && performance.length > 0) {
            res.status(200).json(performance);
        } else {
            res.status(404).json({ message: `No social performance records found for the SalesMan with salesmanId ${req.params.salesmanId}.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Updates the details of a specific SalesMan.
 *
 * @param {Object} req - The request object containing SalesMan ID in the parameters and updated data in the body.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.updateSalesMan = async function (req, res){
    try {
        const salesmanId = req.params.salesmanId;
        const result = await SalesMenService.updateSalesMan(req.app.get('db'), salesmanId, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Updates a specific social performance record for a SalesMan.
 *
 * @param {Object} req - The request object containing SalesMan ID and socialId in the parameters and updated data in the body.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.updatePerformance = async function (req, res){
    try {
        const result = await SalesMenService.updateSocialPerformanceRecord(req.app.get('db'), req.params.salesmanId, req.params.socialId, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Deletes a specific SalesMan by their ID (salesmanId).
 *
 * @param {Object} req - The request object containing the SalesMan ID in the parameters.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.deleteSalesMan = async function (req, res){
    try {
        const result = await SalesMenService.deleteSalesMan(req.app.get('db'), req.params.salesmanId);

        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `SalesMan with salesmanId ${req.params.salesmanId} not found.` });
        } else {
            res.status(200).json({ message: `SalesMan with salesmanId ${req.params.salesmanId} deleted successfully.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Deletes all performance records of a specific SalesMan, optionally filtered by year.
 *
 * @param {Object} req - The request object containing the SalesMan ID in the parameters and year in the query.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.deletePerformanceRecordsFromSalesManByYear = async function (req, res){
    try {
        const result = await SalesMenService.deleteSocialPerformanceRecordByYear(req.app.get('db'), req.params.salesmanId, req.query.year);

        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `Performance Records for the SalesMan with salesmanId ${req.params.salesmanId} not found.` });
        } else {
            res.status(200).json({ message: `Performance Records for the SalesMan with salesmanId ${req.params.salesmanId} deleted successfully.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Deletes a specific social performance record by salesmanId and socialId.
 *
 * @param {Object} req - The request object containing the SalesMan ID and socialId in the parameters.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.deletePerformanceRecordsFromSalesManBySocialId = async function (req, res){
    try {
        const result = await SalesMenService.deleteSocialPerformanceRecordBySocialId(req.app.get('db'), req.params.salesmanId, req.params.socialId);
        
        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `Performance Record with socialId ${req.params.socialId} for SalesMan ${req.params.salesmanId} not found.` });
        } else {
            res.status(200).json({ message: `Performance Record with socialId ${req.params.socialId} for SalesMan ${req.params.salesmanId} deleted successfully.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.updateAllBonusSalarieToOrangeHRM = async function (req, res){
    try {
        const result = await SalesMenService.updateAllBonusSalarieToOrangeHRM(req.app.get('db'));
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBonusSalarieToOrangeHRM = async function (req, res){
    try {
        const salesmanId = req.params.salesmanId;
        const result = await SalesMenService.updateBonusSalarieToOrangeHRM(req.app.get('db'), salesmanId);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = exports;
