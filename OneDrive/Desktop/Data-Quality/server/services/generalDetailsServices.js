const path = require('path');
const fs = require('fs/promises');
const excelToJson = require('../utils/excelUtils');
const odsToJson = require('../utils/odsUtils');
const csvToJson = require('../utils/csvUtils');


const generalDetailsServices = {
    async handleData(excelF, oriFN) {
        try {
            // JSON converting code here
            
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
console.log({timestamp});
            const uPath = excelF.path;
            let jsO;

            const extention = oriFN.split('.')[1];
            switch (extention) {
                case 'xlsx':
                    jsO = excelToJson(uPath);
                    break;
                case 'xls':
                    jsO = excelToJson(uPath);
                    break;
                case 'csv':
                    jsO = await csvToJson(uPath);
                    break;
                case 'ods':
                    jsO = odsToJson(uPath);
                    break;
            }

            // File saving code here
            const newFN = `${timestamp}_${oriFN.split('.')[0]}.json`;
            const fPath = path.join(__dirname, '..', 'uploads', newFN);

            await fs.writeFile(fPath, JSON.stringify(jsO, null, 2));
            await fs.unlink(uPath);
            return newFN;
        } catch (err) {
            throw new Error(err);
        }
    }
};


module.exports = generalDetailsServices;
