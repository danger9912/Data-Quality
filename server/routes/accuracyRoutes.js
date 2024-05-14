const accuracyContoller = require('../controllers/accuracyController');
const express = require('express');
const router = express.Router();

router.post('/getallcols',accuracyContoller.getallcols);
router.post('/insertlog',accuracyContoller.insertData);
router.post('/getlogs',accuracyContoller.getAccuracy_measure);
// router.post('/comission-log', comissionController.createOmissionLogs);
// router.delete('/comission-log/:id', comissionController.deleteOmissionLogs);
// router.delete('/comission-log-DeleteAll',comissionController.deleteAllComissionLogs);

module.exports = router;