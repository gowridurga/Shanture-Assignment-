const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/dashboard', analyticsController.getDashboardOverview);
router.post('/reports', analyticsController.generateReport);
router.get('/reports', analyticsController.getSavedReports);
router.get('/reports/:id', analyticsController.getReportById);

module.exports = router;

