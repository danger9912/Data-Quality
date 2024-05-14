const fs = require('fs').promises;
const path = require('path');

const replaceBlankWithNull = (data) => {
  return data.map(obj => {
    const replacedObj = {};
    Object.keys(obj).forEach(key => {
      replacedObj[key] = obj[key] === 'blank' ? null : obj[key];
    });
    return replacedObj;
  });
};

const fileChanges = async (filename, data) => {
  try {
    const filePath = path.join(__dirname, '../uploads', filename);

    const newData = replaceBlankWithNull(data);

    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8');

    console.log(`File ${filename} updated successfully.`);
  } catch (error) {
    console.error(`Error updating file ${filename}: ${error.message}`);
  }
};

module.exports = fileChanges;
