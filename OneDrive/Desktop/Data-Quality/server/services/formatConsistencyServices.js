const db = require("../database/connection");
const checkPKFormatConsistency = require("../utils/checkPKFormatConsistency")
const checkFKFormatConsistency = require('../utils/checkFKFormatConsistency')

const formatServices = {
  async createFormat(formatData) {
    try {
      console.log(formatData);
      formatData.forEach(async (e) => {
        await db.query(
          "INSERT INTO format_consistency (file_format, max_size,file_size_type) VALUES ($1, $2, $3) RETURNING *",
          [e.name, e.size, e.file_size_type]
        );
      });
      const result = await db.query("SELECT * FROM format_consistency");
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error creating format:", error);
      throw new Error("Internal Server Error");
    }
  },

  async getFormats() {
    try {
      const result = await db.query("SELECT * FROM format_consistency");
      return result.rows;
    } catch (error) {
      console.error("Error fetching formats:", error);
      throw new Error("Internal Server Error");
    }
  },

  async deleteFormat(formatId) {
    try {
      await db.query("DELETE FROM format_consistency WHERE format_id = $1", [
        formatId,
      ]);
    } catch (error) {
      console.error("Error deleting format:", error);
      throw new Error("Internal Server Error");
    }
  },

  async deleteAllFormats(formatIds){
    try{
      if (!formatIds || formatIds.length === 0) {
        throw new Error("No format IDs provided for deletion");
      }
 
      const placeholders = formatIds.map((_, index) => `$${index + 1}`).join(', ');
    
      await db.query(`DELETE FROM format_consistency WHERE format_id IN (${placeholders})`, formatIds);
    }
    catch(error){
      console.error("Error deleting formats by IDs:", error);
      throw new Error("Internal Server Error");
    }
  },

  async updateMaxSize(formatId, newSize) {
    try {
      await db.query(
        "UPDATE format_consistency SET max_size = $1 WHERE format_id = $2",
        [newSize, formatId]
      );
    } catch (error) {
      console.error("Error updating max size:", error);
      throw new Error("Internal Server Error");
    }
  },

  async checkPrimaryKeyFormat(filename,attributes) {
    try{
const result =  checkPKFormatConsistency(filename,attributes)
return result;
    } catch (error) {
      console.error("Error occured", error);
      throw new Error("Internal Server Error");
    }
  },

  async checkForeignKeyFormat(filename,primary_key,files) {
    try{
      const result =  checkFKFormatConsistency(filename,primary_key,files)
      return result;
    } catch (error) {
      console.error("Error occured:", error);
      throw new Error("Internal Server Error");
    }
  }

};

module.exports = formatServices;
