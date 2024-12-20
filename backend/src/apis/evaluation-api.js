const EvaluationService = require('../services/evaluation-service');

exports.getEvaluation = async function (req, res) {
    try {
        const salesmanId = parseInt(req.params.salesmanId);
        const year = parseInt(req.params.year);
        
        let evaluation = await EvaluationService.readEvaluation(req.app.get('db'), salesmanId, year.toString());
        
        if (!evaluation) {
            const generatedEvaluation = await EvaluationService.generateEvaluation(req.app.get('db'), salesmanId, year.toString());
            evaluation = await EvaluationService.createEvaluation(req.app.get('db'), generatedEvaluation);
        }
        
        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEvaluation = async function (req, res) {
    try {
        const salesmanId = parseInt(req.params.salesmanId);
        const year = parseInt(req.params.year);
        const evaluationData = req.body;
        await EvaluationService.updateEvaluation(req.app.get('db'), salesmanId, year.toString(), evaluationData);
        res.status(200).json({ message: 'Evaluation updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};