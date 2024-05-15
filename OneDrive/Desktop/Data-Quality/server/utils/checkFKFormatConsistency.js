const fs = require('fs');
const path = require('path');

const checkFKFormatConsistency = async (filename,primary_key,files) => {

    try{
        const primary_key_values = readPrimaryKeyValues(filename, primary_key);
        const foreign_key_results = checkForeignKeys(primary_key_values, files);
        return (foreign_key_results);

    } catch (error) {
        console.error('Error checking foreign keys:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


function readPrimaryKeyValues(filename, primary_key){
    try {
        const filePath = path.join(__dirname, '../uploads', filename);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);
        return jsonData.map(obj => obj[primary_key]);
    } catch (err) {
        console.error(`Error reading or parsing file ${filename}: ${err.message}`);
        return [];
    }
}

function checkForeignKeys(primary_key_values, files) {
    const results = [];
    files.forEach(file => {
        let hasForeignKey = false;
        try {
            const filePath = path.join(__dirname, '../uploads', file);
            const fileData = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(fileData);
            for (const obj of jsonData) {
                for (const fieldvalue of Object.values(obj)) {
                    if (primary_key_values.includes(Number(fieldvalue))) {
                        hasForeignKey = true;
                        break;
                    }
                }
                if (hasForeignKey) break;
            }
        }
        catch (err) {
            console.error(`Error reading or parsing file ${file}: ${err.message}`);
        }
        results.push({filename:file,value:hasForeignKey});
    });
    console.log(results)

    return results;
}

}

module.exports = checkFKFormatConsistency;