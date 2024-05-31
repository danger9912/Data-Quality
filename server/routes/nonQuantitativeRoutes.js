const nonQuantitativeController = require('../controllers/nonQuantitativeController');
const express = require('express');
const router = express.Router();

router.post('/check',nonQuantitativeController.check);
// router.post('/insertlog',accuracyContoller.insertData);
// router.post('/getlogs',accuracyContoller.getAccuracy_measure);
// router.post('/comission-log', comissionController.createOmissionLogs);
// router.delete('/comission-log/:id', comissionController.deleteOmissionLogs);
// router.delete('/comission-log-DeleteAll',comissionController.deleteAllComissionLogs);

module.exports = router;