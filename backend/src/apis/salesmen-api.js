const SalesMenService = require('../services/salesmen-service');
const salesMenService = new SalesMenService();

// C - Create
exports.createSalesMan = async function (req, res) {
    try {
        const result = await salesMenService.createSalesMan(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPerformance = async function (req, res) {
    try {
        const result = await salesMenService.createSocialPerformanceRecord(req.body, req.params.sid);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// R - Read
exports.getSalesMan = async function (req, res) {
    try {
        const salesMan = await salesMenService.readSalesMan(req.params.sid);
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
        const result = await salesMenService.readAllSalesMen();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPerformancesFromSalesMan = async function (req, res){
    try {
        const result = await salesMenService.readSocialPerformanceRecord(req.params.sid);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPerformanceFromSalesManByYear = async function (req, res){
    try {
        const result = await salesMenService.readSocialPerformanceRecordByYear(req.params.sid, req.params.year);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// U - Update
exports.updateSalesMan = async function (req, res){
    try {
        const sid = req.params.sid;
        const result = await salesMenService.updateSalesMan(sid, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// D - Delete
exports.deleteSalesMan = async function (req, res){
    try {
        const result = await salesMenService.deleteSalesMan(req.params.sid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePerformanceRecordFromSalesManByYear = async function (req, res){
    try {
        await salesMenService.deleteSocialPerformanceRecord(req.params.sid, req.params.year);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePerformanceRecordsFromSalesMan = async function (req, res){
    try {
        await salesMenService.deleteAllSocialPerformanceRecords(req.params.sid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;