const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFile = require("../controllers/PositionalAccControllers/uploadFile");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadFile.uploadLargeFile);

module.exports = router;
