const temporalQualityController = require('../controllers/temporalQualityController');
const express = require('express');
const router = express.Router();

router.post('/temporal-val', temporalQualityController.temporalVal)
router.post('/tempoconist', temporalQualityController.tempoConistency)
router.post('/tempoValidity', temporalQualityController.tempoValidity)
router.post('/tempoStartEnd', temporalQualityController.tempoStartend)


module.exports = router;