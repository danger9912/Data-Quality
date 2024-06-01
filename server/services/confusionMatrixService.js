const path = require("path");
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");
const XLSX = require('xlsx');
const axios = require('axios');
const stateFormateServices = {
  
    async SelectedCode(body) {
    
        try {
            // console.log(filename);
           
          console.log(body)
            // console.log("hi:" +attributes);
         
            const filePath = path.join(__dirname, "..", "uploads", body.filename);
          
            const rawData = fs.readFileSync(filePath);
            const data = JSON.parse(rawData);
           
            const typ = body.attributes[0].value;
           
  
            const filePath2 = path.join(__dirname, "..", "uploads", body.filename2);
          
            const rawData2 = fs.readFileSync(filePath2);
            const data2 = JSON.parse(rawData2);
           
            const typ2 = body.attributes2[0].value;

            const truthFiltered = data2.filter(item => item[typ2] !== 'blank');
            const predFiltered = data.filter(item => item[typ] !== 'blank');
            
            // Assuming data and data2 have a corresponding structure and order
            const combined = [];
            let total = 0;
            let er =0;
            for (let i = 0; i < truthFiltered.length; i++) {
              if (predFiltered[i] && predFiltered[i][typ] !== 'NA') {
                combined.push({
                  actual: truthFiltered[i][typ2],
                  pred: predFiltered[i][typ]
                });
              }
              else
              er++;
            total++;
            }
            
            // If the items don't have a one-to-one correspondence by index
            // and you want to match them by some identifier, you would need to adapt this
            
        // let I =0;
        // let W =0;
        
        // const combinedData = data.map(item => {
        //     const state = item[typ];
            
        //     var valid = "valid";

        //     if(states.includes( item[typ].toUpperCase()) === true ){
        //          valid  = "valid";
        //          I++;
        //     }
        //     else{
        //         valid  = "Invalid";
        //          W++;
        //     }
        //     // const vaild = stationCodes.includes(item[typ]) ? "Valid" : "NotValid";
        //     return { state, valid };
        //     // return stationCodes.includes(item[typ]);
        // });
        
        //   const comb = {data : combinedData, errorcount : W,validCount :I}
        // console.log(comb);
            
        
            return {combine : combined , err : er,total:total};
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
  module.exports = stateFormateServices;