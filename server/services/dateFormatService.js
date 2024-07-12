const path = require("path");
const xlsx = require('xlsx');
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");

const dateFormatServices = {
  async checkDateFormat(filename, attributes) {
    console.log("hi")
    const filePath = path.join(__dirname, "..", "uploads", filename);
    const workbook = xlsx.readFile(filePath);

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
console.log(sheet)
// Convert sheet to JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);

    // const data = JSON.parse(rawData);
    return jsonData;
    // const result = countNull(data, attributes);
    // return result;
  }
};
module.exports = dateFormatServices;