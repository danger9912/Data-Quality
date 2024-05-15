const dateFormatContoller = require('../controllers/dateFormateController');
const express = require('express');
const router = express.Router();

router.post('/dateFormate', dateFormatContoller.checkDateFormat);


module.exports = router;