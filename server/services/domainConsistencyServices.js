const domainMinMax = require('../utils/domainMinMax');
const calculateDomain = require('../utils/domainConAuto');
const errorCalculate = require('../utils/errorView');
const fileChangesError = require('../utils/fileChangesError');
const fs = require("fs").promises;
const fs1 = require("fs");
const path = require('path');
const db = require("../database/connection");

const domainConsistencyServices = {

  async domainConsistencyAuto(body) {
console.log(body)
    const filename = body.filename
    const filePath = path.join(__dirname, '../uploads', filename);
    const data = await fs.readFile(filePath, 'utf8');
    const jsonArray = JSON.parse(data);
    const result = calculateDomain(body.rules, jsonArray);
    return result;
  },
  async domainConfusionState(req) {
    console.log(req.body)
    const lis = req.body.rowData;
    const fil = req.body.selectedFilename;
    const target = req.body.target[0].label;
    console.log(fil)
    console.log(target)

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
    const statesArray = statesString.split(", ");
    console.log("******")
    // statesArray.forEach((i)=>{
    //   const filePath = path.join(__dirname, "..", "uploads", fil);

    //   const rawData = fs.readFileSync(filePath);
    //   const data = JSON.parse(rawData);

    //   const typ = target;
    //   var count =0 ;
    //   const filterDaata = data.map((item) => {
    //     const state = item[typ];
    //     if(state === i){
    //       count++;
    //     }
    //     return count;
    //   })
    //   console.log(filterDaata)


    // })
    console.log("******")
    const filePath = path.join(__dirname, "..", "uploads", fil);
    const rawData = fs1.readFileSync(filePath);
    const data = JSON.parse(rawData);
    const typ = target;  // Assuming 'target' is defined somewhere in your code
    const filterArray = statesArray.map(state => {
      let count = 0;
      data.forEach(item => {
        if (item[typ] === state) {
          count++;
        }
      });
      return { state, count };
    });
    console.log(filterArray);
    let repeatedStatesArray = [];
    filterArray.forEach(({ state, count }) => {
      for (let i = 0; i < count; i++) {
        repeatedStatesArray.push(state);
      }
    });
    console.log(repeatedStatesArray);

    console.log("******")



    const correctedStates = repeatedStatesArray.map(item => findClosestState(item));

    // console.log("co")
    // console.log(correctedStates[0])

    const combine = repeatedStatesArray.map((item, index) => ({
      pred: repeatedStatesArray[index].toUpperCase(),
      actual: correctedStates[index].toUpperCase(),

    }));


console.log(combine)
    return combine;

  },

  async domainRailwaysZones(req) {
    const lis = req.body.rowData;
    // console.log("he")
    console.log(req.body)
    // const lis = req.body.rowData;
    const fil = req.body.selectedFilename;
    const target = req.body.target[0].label;
    const railwayZones = [
      "Central Railway",
      "Eastern Railway",
      "East Central Railway",
      "East Coast Railway",
      "Northern Railway",
      "North Central Railway",
      "North Eastern Railway",
      "North Western Railway",
      "Southern Railway",
      "South Central Railway",
      "South Eastern Railway",
      "South East Central Railway",
      "South Western Railway",
      "Western Railway",
      "West Central Railway",
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

    // Function to find the closest match from the list of valid railway zones
    function findClosestZone(zone) {
      let closestZone = null;
      let minDistance = Infinity;
      const trimmedZone = zone.trim().toUpperCase(); // Trim and convert to uppercase

      for (const region of railwayZones) {
        const upperRegion = region.toUpperCase();
        const distance = levenshteinDistance(trimmedZone, upperRegion);
        if (distance < minDistance) {
          minDistance = distance;
          closestZone = region;
        }
      }

      return closestZone;
    }

    const jsonString = JSON.stringify(lis);
    let zonesString = jsonString.substring(1, jsonString.length - 1);
    zonesString = zonesString.replace(/"/g, '');
    const zonesArray = zonesString.split(", ");

    console.log("******")
    const filePath = path.join(__dirname, "..", "uploads", fil);
    const rawData = fs1.readFileSync(filePath);
    const data = JSON.parse(rawData);
    const typ = target;  // Assuming 'target' is defined somewhere in your code
    const filterArray = zonesArray.map(state => {
      let count = 0;
      data.forEach(item => {
        if (item[typ] === state) {
          count++;
        }
      });
      return { state, count };
    });
    console.log(filterArray);
    let repeatedStatesArray = [];
    filterArray.forEach(({ state, count }) => {
      for (let i = 0; i < count; i++) {
        repeatedStatesArray.push(state);
      }
    });
    console.log(repeatedStatesArray);

    console.log(zonesArray);
    const correctedZones = repeatedStatesArray.map(item => findClosestZone(item));
    const combine = repeatedStatesArray.map((item, index) => ({
      pred: repeatedStatesArray[index].toUpperCase(),
      actual: correctedZones[index].toUpperCase(),
    }));

    return combine;
  },


  async domainConsistencyData(jsonArray, attribute, datatype) {
    try {
      const result = domainMinMax(jsonArray, attribute, datatype)
      console.log(result)
      return result;

    } catch (err) {

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