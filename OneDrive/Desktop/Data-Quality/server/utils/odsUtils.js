const xlsx = require('xlsx');

const odsToJson = (filePath) => {
    const workbook = xlsx.readFile(filePath, {bookType: 'ods'});
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, {
        defval: "blank",
        raw: true,
        rawNumbers: false,
    });
    console.log(jsonData);
    return jsonData;
};

module.exports = odsToJson;