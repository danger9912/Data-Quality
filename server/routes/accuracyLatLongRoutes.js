const accuracyLatLongController = require('../controllers/accuracyLatLongController');
const express = require('express');
const router = express.Router();

router.post('/getallcols',accuracyLatLongController.getallcols);
// router.post('/insertlog',accuracyNumberController.insertData);
// router.post('/getlogs',accuracyNumberController.getAccuracy_measure);
// router.post('/comission-log', comissionController.createOmissionLogs);
// router.delete('/comission-log/:id', comissionController.deleteOmissionLogs);
// router.delete('/comission-log-DeleteAll',comissionController.deleteAllComissionLogs);

module.exports = router;