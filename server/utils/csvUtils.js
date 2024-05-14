const csvtojson = require('csvtojson');
const fs = require('fs/promises');

const preprocessCsv = async (filePath) => {
    try {
        const csvContent = await fs.readFile(filePath, 'utf-8');
        const processedCsvContent = csvContent.replace(/,,/g, ',blank,');
        await fs.writeFile(filePath, processedCsvContent);
    } catch (error) {
        throw new Error(`Error preprocessing CSV: ${error.message}`);
    }
};

const csvToJson = async (filePath) => {
    try {
        await preprocessCsv(filePath);

        const jsonArray = await csvtojson({
            flatKeys: true,
            checkType: true,
            ignoreEmpty: false,
        }).fromFile(filePath);

        return jsonArray;
    } catch (err) {
        throw new Error(`Error converting CSV to JSON: ${err.message}`);
    }
};

module.exports = csvToJson;
