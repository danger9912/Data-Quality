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
    async domainConfusion(req) {
      const lis = req.body;
    //  console.log("hil"+lis); 
      const statesOfIndia = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal"
    ];
    
    // Function to calculate Levenshtein distance
    function levenshteinDistance(a, b) {
        const matrix = [];
    
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
    
        // Increment along the first column of each row
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
    
        // Increment each column in the first row
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
    
        // Fill in the rest of the matrix
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1) // deletion
                    );
                }
            }
        }
    
        return matrix[b.length][a.length];
    }
    
    // Function to find the closest match from the list of valid states
    function findClosestState(state) {
      // console.log("*\n");
        let closestState = null;
        let minDistance = Infinity;
        const trimmedState = state.trim().toUpperCase(); // Trim and convert to uppercase
    
        for (const region of statesOfIndia) {
            const upperRegion = region.toUpperCase();
            const distance = levenshteinDistance(trimmedState, upperRegion);
            if (distance < minDistance) {
                minDistance = distance;
                closestState = region; // return the original casing
            }
        }
    
        return closestState;
    }
    
 
    const jsonString = JSON.stringify(lis);
    let statesString = jsonString.substring(1, jsonString.length - 1)
    statesString = statesString.replace(/"/g, '');
    const   statesArray = statesString.split(", ");
    console.log(statesArray)
    const correctedStates = statesArray.map(item => findClosestState(item));
    const combine = statesArray.map((item, index) => ({
      pred: statesArray[index].toUpperCase(),
      actual: correctedStates[index].toUpperCase(),
     
  }));


      
      return combine;
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