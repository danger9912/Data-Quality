const comissionController = require('../controllers/comissionController');
const express = require('express');
const router = express.Router();

router.get('/comission-log',comissionController.getOmissionLogs);
router.post('/comission-log', comissionController.createOmissionLogs);
router.delete('/comission-log/:id', comissionController.deleteOmissionLogs);
router.delete('/comission-log-DeleteAll',comissionController.deleteAllComissionLogs);

module.exports = router;