const path = require("path");
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");

const omissionServices = {
  async omissionAuto(filename, attributes) {
    const filePath = path.join(__dirname, "..", "uploads", filename);
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);
    const result = countNull(data, attributes);
    return result;
  },

  async getOmissionLogs() {
    try {
      const result = await db.query("SELECT * FROM omission_logs");
      return result.rows;
    } catch (err) {
      console.error("Error fetching logs:", err);
      throw new Error("Internal Server Error");
    }
  },

  async createNewOmissionLog(logData) {
    await fileChanges(logData.file_name, logData.field_names);
    try {
      await db.query(
        "INSERT INTO  omission_logs (file_name,field_names,omission_rate,checked_on) VALUES ($1,$2,$3,now())",
        [logData.file_name, logData.field_names, logData.omission_rate]
      );
    } catch (error) {
      console.error("Error creating log entry:", error);
      throw new Error("Internal Server Error");
    }
  },

  async deleteExistingOmissionLog(id) {
    try {
      await db.query("DELETE FROM omission_logs WHERE omission_log_id = $1", [
        id,
      ]);
    } catch (error) {
      console.error("Error deleting log entry:", error);
      throw new Error("Internal Server Error");
    }
  },

  async deleteAllOmissionLogs(OmissionIds){
    try{
      if (!OmissionIds || OmissionIds.length === 0) {
        throw new Error("No Omission IDs provided for deletion");
      }
 
      const placeholders = OmissionIds.map((_, index) => `$${index + 1}`).join(', ');
    
      await db.query(`DELETE FROM omission_logs WHERE omission_log_id IN (${placeholders})`, OmissionIds);
    }
    catch(error){
      console.error("Error deleting Omission IDs:", error);
      throw new Error("Internal Server Error");
    }
  },


};

module.exports = omissionServices;
