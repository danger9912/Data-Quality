const dateFormatContoller = require('../controllers/dateFormatContoller');
const express = require('express');
const router = express.Router();

router.post('/dateFormate', dateFormatContoller.checkDateFormat);


module.exports=router;