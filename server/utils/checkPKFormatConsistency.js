const fs = require('fs').promises;
const path = require('path');

const valuesToCount = [ 
    "null",
    "NA",
    "-",
    ".",
    "Not Applicable",
    "NULL",
    "blank",
    "N/A",
    "N.A.",
    "Not Available",
    "Not Provided",
    "$",
    "`",
    "~",
    "!",
    "@",
    "#",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+","=",
    "/",
    "<",
    ">",
    "?"
  ];

const checkPKFormatConsistency = async (filename,attributes) => {

    const filePath = path.join(__dirname, '../uploads', filename);

    try{
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        const primaryKeyAnalysis = analyzeAttributesForPrimaryKey(jsonData,attributes);
       return (primaryKeyAnalysis);
    } catch(err) {
        console.error('Error parsing JSON:', err);
            // res.status(500).json({ error: 'Internal Server Error' });
            return { error: 'Internal Server Error' }
    }
}

function analyzeAttributesForPrimaryKey(jsonData,attributes) {
    const primaryKeyAnalysis = {};

    // Loop through each object in the array
    for (const attribute of attributes) {
        primaryKeyAnalysis[attribute] = isAttributeUnique(jsonData, attribute);
    }

    return primaryKeyAnalysis;
}

function isAttributeUnique(jsonData, attribute) {
    const valueSet = new Set();
    for (const record of jsonData) {
        const value = record[attribute];

        if(valuesToCount.includes(value))
        return false;

        if (valueSet.has(value)) {
            return false; // Not unique
        }
        valueSet.add(record[attribute]);
    }
    return true; // Unique
}


module.exports = checkPKFormatConsistency;