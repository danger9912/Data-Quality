const fs = require('fs').promises;
const db = require("../database/connection");

const convertFileSizeToBytes = (size, fileSizeType) => {
  switch (fileSizeType.toLowerCase()) {
    case 'bits':
      return size / 8;
    case 'bytes':
      return size;
    case 'kb':
      return size * 1024;
    case 'mb':
      return size * 1024 * 1024;
    case 'gb':
      return size * 1024 * 1024 * 1024;
    default:
      throw new Error('Unsupported file size type');
  }
};

const checkFormatConsistency = async (sizeInBytes, extension, res, file) => {
  try {
    const result = await db.query("SELECT * FROM format_consistency WHERE file_format = $1", [extension.toUpperCase()]);
    if (result.rows.length === 0) {
      console.log("File format not supported.");
      await fs.unlink(file.path).catch(error => console.error('Error deleting file:', error));
      res.status(400).json({message : "File format not supported"});
      return false;
    }

    const entry = result.rows[0];
    const maxSizeInBytes = convertFileSizeToBytes(entry.max_size, entry.file_size_type);

    if (sizeInBytes > maxSizeInBytes) {
      console.log("File size exceeded limit.");
      await fs.unlink(file.path).catch(error => console.error('Error deleting file:', error));
      res.status(400).json({message : "File size limit exceed"});
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking format consistency:", error);
    res.status(500).json("Internal Server Error");
    await fs.unlink(file.path).catch(unlinkError => console.error('Error deleting file:', unlinkError));
    return false;
  }
};

module.exports = checkFormatConsistency;
