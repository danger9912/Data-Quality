const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");

const comissionServices = {

  async getComissionLogs() {
    try {
      const result = await db.query("SELECT * FROM comission_logs");
      return result.rows;
    } catch (err) {
      console.error("Error fetching logs:", err);
      throw new Error("Internal Server Error");
    }
  },

  async createNewComissionLog(logData) {
    await fileChanges(logData.file_name, logData.field_names);
    try {
      await db.query(
        "INSERT INTO comission_logs (file_name,field_names,comission_rate,checked_on) VALUES ($1,$2,$3,now())",
        [logData.file_name, logData.field_names, logData.comission_rate]
      );
    } catch (error) {
      console.error("Error creating log entry:", error);
      throw new Error("Internal Server Error");
    }
  },

  async deleteExistingComissionLog(id) {
    try {
      await db.query("DELETE FROM comission_logs WHERE omission_log_id = $1", [
        id,
      ]);
    } catch (error) {
      console.error("Error deleting log entry:", error);
      throw new Error("Internal Server Error");
    }
  },

  async deleteAllComissionLogs(ComissionIds){
    try{
      if (!ComissionIds || ComissionIds.length === 0) {
        throw new Error("No Comission IDs provided for deletion");
      }
 
      const placeholders = ComissionIds.map((_, index) => `$${index + 1}`).join(', ');
    
      await db.query(`DELETE FROM comission_logs WHERE comission_log IN (${placeholders})`, ComissionIds);
    }
    catch(error){
      console.error("Error deleting Omission IDs:", error);
      throw new Error("Internal Server Error");
    }
  },

};


module.exports = comissionServices;
