const domainMinMax = require('../utils/domainMinMax');
const calculateDomain = require('../utils/domainConAuto');
const errorCalculate = require('../utils/errorView');
const fileChangesError = require('../utils/fileChangesError');
const fs = require('fs').promises;
const path = require('path');
const db = require("../database/connection");

const domainConsistencyServices = {
    async domainConsistencyAuto(body) {
        const filename = body.filename
        const filePath = path.join(__dirname, '../uploads', filename);
        const data = await fs.readFile(filePath, 'utf8');
        const jsonArray = JSON.parse(data);
        const result = calculateDomain(body.rules, jsonArray);
        return result;
    },

    async domainConsistencyData(jsonArray,attribute,datatype) {
        try{       
        const result = domainMinMax(jsonArray,attribute,datatype)
        console.log(result)
        return result;
        
        } catch(err){

        }
    },

    async createNewDomainLog(logData, jsonArray) {
      const data = await errorCalculate(logData.rules, jsonArray);
      await fileChangesError(logData.filename, data);
        try {
          await db.query(
            "INSERT INTO  domain_logs (filename,tested_result,tested_date) VALUES ($1,$2,now())",
            [logData.filename, logData.domain_rate]
          );
        } catch (error) {
          console.error("Error creating log entry:", error);
          throw new Error("Internal Server Error");
        }
      },

      async getDomainLogs() {
        try {
          const result = await db.query("SELECT * FROM domain_logs");
          return result.rows;
        } catch (err) {
          console.error("Error fetching logs:", err);
          throw new Error("Internal Server Error");
        }
      },
};

module.exports = domainConsistencyServices;