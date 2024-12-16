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
        const result = await SalesMenService.createSocialPerformanceRecord(req.app.get('db'), req.body, req.params.sid);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves details of a specific SalesMan by their ID (sid).
 *
 * @param {Object} req - The request object containing the SalesMan ID in the parameters.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.getSalesMan = async function (req, res) {
    try {
        const salesMan = await SalesMenService.readSalesMan(req.app.get('db'), req.params.sid);
        if (salesMan) {
            res.status(200).json(salesMan);
        } else {
            res.status(404).json({ message: "SalesMan not found" });
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
        //TODO
        //await exports.updateSalesMenList(req.app.get('db'));
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
        const performance = await SalesMenService.readSocialPerformanceRecord(req.app.get('db'), req.params.sid, req.query.year);

        // Check if the performance array is empty
        if (performance && performance.length > 0) {
            res.status(200).json(performance);
        } else {
            res.status(404).json({ message: "No social performance records found for this SalesMan" });
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
        const sid = req.params.sid;
        const result = await SalesMenService.updateSalesMan(req.app.get('db'), sid, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Deletes a specific SalesMan by their ID (sid).
 *
 * @param {Object} req - The request object containing the SalesMan ID in the parameters.
 * @param {Object} res - The response object to send the result or errors.
 */
exports.deleteSalesMan = async function (req, res){
    try {
        const result = await SalesMenService.deleteSalesMan(req.app.get('db'), req.params.sid);

        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `SalesMan with sid ${req.params.sid} not found.` });
        } else {
            res.status(200).json({ message: `SalesMan with sid ${req.params.sid} deleted successfully.` });
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
exports.deletePerformanceRecordsFromSalesMan = async function (req, res){
    try {
        const result = await SalesMenService.deleteSocialPerformanceRecord(req.app.get('db'), req.params.sid, req.query.year);

        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `Performance Records for the SalesMan with sid ${req.params.sid} not found.` });
        } else {
            res.status(200).json({ message: `Performance Records for the SalesMan with sid ${req.params.sid} deleted successfully.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
