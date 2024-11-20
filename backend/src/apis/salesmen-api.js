const SalesMenService = require('../services/salesmen-service');

// C - Create
exports.createSalesMan = async function (req, res) {
    try {
        const result = await SalesMenService.createSalesMan(req.app.get('db'), req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPerformance = async function (req, res) {
    try {
        const result = await SalesMenService.createSocialPerformanceRecord(req.app.get('db'), req.body, req.params.sid);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// R - Read
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

exports.getAllSalesMen = async function (req, res){
    try {
        const result = await SalesMenService.readAllSalesMen(req.app.get('db'));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPerformancesFromSalesMan = async function (req, res){
    try {
        const result = await SalesMenService.readSocialPerformanceRecord(req.app.get('db'), req.params.sid);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPerformanceFromSalesManByYear = async function (req, res){
    try {
        const result = await SalesMenService.readSocialPerformanceRecordByYear(req.app.get('db'), req.params.sid, req.params.year);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// U - Update
exports.updateSalesMan = async function (req, res){
    try {
        const sid = req.params.sid;
        const result = await SalesMenService.updateSalesMan(req.app.get('db'), sid, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// D - Delete
exports.deleteSalesMan = async function (req, res){
    try {
        const result = await SalesMenService.deleteSalesMan(req.app.get('db'), req.params.sid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePerformanceRecordFromSalesManByYear = async function (req, res){
    try {
        await SalesMenService.deleteSocialPerformanceRecord(req.app.get('db'), req.params.sid, req.params.year);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePerformanceRecordsFromSalesMan = async function (req, res){
    try {
        await SalesMenService.deleteAllSocialPerformanceRecords(req.app.get('db'), req.params.sid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;