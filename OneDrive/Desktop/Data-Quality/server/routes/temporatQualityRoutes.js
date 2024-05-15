const temporalQualityController = require('../controllers/temporalQualityController');
const express = require('express');
const router = express.Router();

router.post('/temporal-val', temporalQualityController.temporalVal)

module.exports = router;