const stationCode = require('../controllers/stationCodeController');
const express = require('express');
const router = express.Router();

router.post('/selectedCols',stationCode.getallcols);
router.post('/insertlog',stationCode.insertData);
router.post('/getlogs',stationCode.getLogs);
router.post('/view',stationCode.viewFile);

// router.post('/comission-log', comissionController.createOmissionLogs);
// router.delete('/comission-log/:id', comissionController.deleteOmissionLogs);
// router.delete('/comission-log-DeleteAll',comissionController.deleteAllComissionLogs);

module.exports = router;