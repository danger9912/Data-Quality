const fs = require("fs").promises;
const csv = require("csvtojson");
const xlsx = require('xlsx');

const checkFileCorruption = async (file) => {
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  try {
    switch (fileExtension) {
      case "xlsx":
        xlsx.readFile(file.path);
        break;
      case "ods":
        xlsx.readFile(file.path, { bookType: 'ods' });
        break;
      case "csv":
        xlsx.readFile(file.path, { bookType: 'csv' });
        break;
      case "xls":
        xlsx.readFile(file.path);
        break;
    }

    console.log("File is not corrupted");
    return false;
  } catch (error) {
    console.error("File is potentially corrupted:", error);

    // Unlink (delete) the file
    try {
      await fs.unlink(file.path);
      console.log("File deleted due to corruption:", file.path);
    } catch (unlinkError) {
      console.error("Error deleting file:", unlinkError);
    }

    return true;
  }
};

module.exports = checkFileCorruption;
