const express = require('express');
const  generalDetailsController = require('../controllers/generalDetailsControllers');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set the destination directory

router.post('/', upload.single('excelFile'), generalDetailsController.saveGeneralDetails);
router.post('/dateformat', upload.single('excelFile'), generalDetailsController.dateFormat);
router.post('/getfiledata', generalDetailsController.fetchfileDataFormat);
router.get('/getdata', generalDetailsController.fetchDataFormat);
module.exports = router;