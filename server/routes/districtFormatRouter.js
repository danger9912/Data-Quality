const districtFormatController = require('../controllers/districtFormatController');
const express = require('express');
const router = express.Router();

router.post('/check',districtFormatController.check);
// router.post('/insertlog',accuracyContoller.insertData);
// router.post('/getlogs',accuracyContoller.getAccuracy_measure);
// router.post('/comission-log', comissionController.createOmissionLogs);
// router.delete('/comission-log/:id', comissionController.deleteOmissionLogs);
// router.delete('/comission-log-DeleteAll',comissionController.deleteAllComissionLogs);

module.exports = router;