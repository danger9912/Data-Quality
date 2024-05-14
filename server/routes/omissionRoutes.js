const omissionControllers = require('../controllers/omissionContoller');
const express = require('express');
const router = express.Router();

router.post('/omission-auto', omissionControllers.omissionAuto);
router.get('/omission-log',omissionControllers.getOmissionLogs);
router.post('/omission-log', omissionControllers.createOmissionLogs);
router.delete('/omission-log/:id', omissionControllers.deleteOmissionLogs);
router.delete('/omission-log-DeleteAll',omissionControllers.deleteAllOmissionLogs);
module.exports = router;