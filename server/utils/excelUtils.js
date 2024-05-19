const xlsx = require('xlsx');

const excelToJson = (filePath) => {
    console.log("hi")
    console.log(filePath)
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, {
        defval: "blank",
    });
    
    
    return jsonData;
};

module.exports = excelToJson;