const path = require("path");
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");
const XLSX = require('xlsx');
const axios = require('axios');
const unionTerrServices = {
  
    async SelectedCode(filename, attributes) {
      const unionTerritories = [
        "ANDAMAN AND NICOBAR ISLANDS",
        "CHANDIGARH",
        "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
        "LAKSHADWEEP",
        "DELHI",
        "PUDUCHERRY",
        "LADAKH",
        "JAMMU AND KASHMIR"
    ];
        try {
            // console.log(filename);
           

            console.log("hi:" +attributes);
            // console.log(attributes[0]);
            // console.log("-------")
            const filePath = path.join(__dirname, "..", "uploads", filename);
          
            const rawData = fs.readFileSync(filePath);
            const data = JSON.parse(rawData);
           
            const typ = attributes[0].value;
           
  
            console.log(data);
            console.log(typ);
          console.log("gi" +data[2][typ]);
          
         
        //       // Return the station codes as JSON
        // console.log("Hi"+stationCodes)
          
        // //   let originalDate;

        let I =0;
        let W =0;
        const combinedData = data.map(item => {
            const state = item[typ];
            
            var valid = "valid";

            if(unionTerritories.includes( item[typ].toUpperCase()) === true ){
                 valid  = "valid";
                 I++;
            }
            else{
                valid  = "Invalid";
                 W++;
            }
            // const vaild = stationCodes.includes(item[typ]) ? "Valid" : "NotValid";
            return { state, valid };
            // return stationCodes.includes(item[typ]);
        });
        
          const comb = {data : combinedData, errorcount : W,validCount :I}
        console.log(comb);
        
            return comb;
        } catch (err) {
            console.error("Error fetching logs:", err);
            throw new Error("Internal Server Error");
        }
    },
    async createLog(logData) {
      try {
        await db.query(
          "INSERT INTO stationcode (filename, error_percentage,created_time) VALUES ($1, $2,$3)",
          [logData.filename, logData.error_percentage,logData.created_time]
        );
        
      } catch (error) {
        console.error("Error creating log entry:", error);
        throw new Error("Internal Server Error");
      }
    },
    async getlogs() {
      try {
          const result = await db.query(
          "SELECT * FROM stationcode"
        );
        return result.rows;
        
      } catch (error) {
        console.error("Error creating log entry:", error);
        throw new Error("Internal Server Error");
      }
    },
    
    async viewFile(log) {
        console.log(log)
      try {
          const result = await db.query(
          "SELECT * FROM stationcode"
        );
        return result.rows;
        
      } catch (error) {
        console.error("Error creating log entry:", error);
        throw new Error("Internal Server Error");
      }
    }
  };
  module.exports = unionTerrServices;