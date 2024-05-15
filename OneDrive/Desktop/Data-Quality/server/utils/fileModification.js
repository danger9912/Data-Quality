const fs = require('fs').promises;
const path = require('path');

const fileChanges = async (filename, attributes) => {
  try {
    const filePath = path.join(__dirname, '../uploads', filename);

    const data = await fs.readFile(filePath, 'utf8');
    const jsonArray = JSON.parse(data);

    const filteredArray = jsonArray.map(obj => {
      const filteredData = {};
      attributes.forEach(attribute => {
        // Check if the attribute value is "blank"
        if (obj.hasOwnProperty(attribute) && obj[attribute] === "blank") {
          filteredData[attribute] = null;
        } else {
          filteredData[attribute] = obj[attribute];
        }
      });
      return filteredData;
    });

    await fs.writeFile(filePath, JSON.stringify(filteredArray, null, 2), 'utf8');

    console.log(`File ${filename} updated successfully.`);
  } catch (error) {
    console.error(`Error updating file ${filename}: ${error.message}`);
  }
};

module.exports = fileChanges;
