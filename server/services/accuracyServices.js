const path = require("path");
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");
const XLSX = require('xlsx');

const accuracyServices = {
  
  async getcols(filename, attributes) {
      try {
          // console.log(filename);
          console.log("hi:" +attributes);
          console.log(attributes[0]);
          // console.log("-------")
          const filePath = path.join(__dirname, "..", "uploads", filename);
        
          const rawData = fs.readFileSync(filePath);
          const data = JSON.parse(rawData);
          // const result = countNull(data, attributes);
          // // return result;
          // console.log(result);
          // console.log(data)
          const typ = attributes[0].value;
          // console.log("tpy" +typ)
          // console.log(data[0]?.[typ]);

          function excelDateToYYYYMMDD(excelDate) {
            console.log(excelDate)
              const millisecondsInDay = 24 * 60 * 60 * 1000;
              const daysSinceExcelStart = excelDate - 1;
              const excelStartDate = new Date(1899, 11, 30); 
              const offsetDays = daysSinceExcelStart * millisecondsInDay;
              const date = new Date(excelStartDate.getTime() + offsetDays);
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              console.log(`${yyyy}-${mm}-${dd}`);
              return `${yyyy}-${mm}-${dd}`;
          }

        console.log("gi" +data[0][typ]);
        let originalDate;
          const combinedData = data.map(item => { 
            console.log(excelDateToYYYYMMDD(item[typ]));
            if (typeof item[typ] === 'number') {

             const k = excelDateToYYYYMMDD(item[typ]);
             console.log("kk" + k)
                originalDate =( typeof excelDateToYYYYMMDD(item[typ])) === 'string' ? k: 'Invalid Date';
            } else {
              // console.log(item[typ])
                originalDate = item[typ];
            }
        
            return {
                originalData: typeof item[typ] === 'number' ? item[typ] : "-",
                convertedData: originalDate
            };
        });
        

          console.log("Combined Data:", combinedData);

          return combinedData;
      } catch (err) {
          console.error("Error fetching logs:", err);
          throw new Error("Internal Server Error");
      }
  },
  async createNewAccuracyMeasurementLog(logData) {
    try {
      console.log(logData)
      await db.query(
        "INSERT INTO accuracy_measurement (confidence_level, good_percentage_s, notgood_percentage_s,file_name,created_date,low_bound,high_bound,good_percentage_r,notgood_percentage_r) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9)",
        [logData.confidence_level, logData.good_percentage_s, logData.notgood_percentage_s,logData.file_name,logData.created_date,logData.low_bound,logData.high_bound,logData.good_percentage_r, logData.notgood_percentage_r]
      );
      
    } catch (error) {
      console.error("Error creating log entry:", error);
      throw new Error("Internal Server Error");
    }
  },
  async getAccuracylogs() {
    try {
        const result = await db.query(
        "SELECT * FROM accuracy_measurement"
      );
      return result.rows;
      
    } catch (error) {
      console.error("Error creating log entry:", error);
      throw new Error("Internal Server Error");
    }
  }
  
};

module.exports = accuracyServices;



  