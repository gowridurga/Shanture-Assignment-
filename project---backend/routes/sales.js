const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.get('/', saleController.getAllSales);
router.get('/stats', saleController.getSalesStats);
router.get('/:id', saleController.getSaleById);
router.post('/', saleController.createSale);
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

module.exports = router;
