const PincodeformateControllers = require('../controllers/PincodeformateController');
const express = require('express');
const router = express.Router();

router.post('/pincode-auto', PincodeformateControllers.pincodeAuto);
router.get('/pincode-log',PincodeformateControllers.getPincodeLogs);
router.post('/pincode-log', PincodeformateControllers.createPincodeLogs);
module.exports = router;