const fs = require('fs').promises;
const path = require('path');
const temporalValidity = require('../utils/temporalValidity');

const temporalQualityServices = {
    async temporalVal(body){
        const filename = body.filename
        const filePath = path.join(__dirname, '../uploads', filename);
        const data = await fs.readFile(filePath, 'utf8');
        const jsonArray = JSON.parse(data);
        const result = temporalValidity(body.attributes, jsonArray);
        
        return result;
    },
};

module.exports = temporalQualityServices;