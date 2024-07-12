const path = require("path");
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");
const XLSX = require('xlsx');
const axios = require('axios');

const latlongServices = {


  async SelectedCode(filename, attributes) {
    try {
      var coordinateData = [];
      console.log(filename);
      console.log(attributes);
      console.log(attributes[0]);
      console.log("-------");
      var I = 0;
      var W = 0;
      const filePath = path.join(__dirname, "..", "uploads", filename);
      const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(rawData);
      // console.log(data)
      const typ1 = attributes[0].value;
      const typ2 = attributes[1].value;
      // console.log(data[typ1])
      function correctEncoding(str) {
        // Check if str is a string
        if (typeof str !== 'string') {
          console.error("Input is not a string.");
          return str; // Return the input unchanged
        }

        return str.replace(/Ã‚Â°/g, '°')
          .replace(/Ã‚Â'/g, "'")
          .replace(/Ã‚Â"/g, '"')
          .replace(/Ã‚Â/g, '')
          .replace(/, /g, ' '); // Add 'g' flag to replace all occurrences
      }





      function isValidLatLongDMS(dmsLat, dmsLong) {
        function dmsToDecimal(degrees, minutes, seconds, direction) {
          let decimal = degrees + minutes / 60 + seconds / 3600;
          if (direction === "S" || direction === "W") {
            decimal = decimal * -1;
          }
          return decimal;
        }

        function parseDMS(input) {
          // Check if input is a string
          if (typeof input !== 'string') {
            return input;
          }

          let parts = input.match(/(\d+)[°](\d+)'(\d+\.?\d*)"?([NSEW])/);
          if (!parts) {
            return null;
          }
          let degrees = parseInt(parts[1], 10);
          let minutes = parseInt(parts[2], 10);
          let seconds = parseFloat(parts[3]);
          let direction = parts[4];

          return dmsToDecimal(degrees, minutes, seconds, direction);
        }

        let latDecimal = parseDMS(dmsLat);
        let longDecimal = parseDMS(dmsLong);

        if (latDecimal === null || longDecimal === null) {
          return false;
        }

        // Check if the latitude is between -90 and 90
        if (latDecimal < -90 || latDecimal > 90) {
          return false;
        }

        // Check if the longitude is between -180 and 180
        if (longDecimal < -180 || longDecimal > 180) {
          return false;
        }

        return true;
      }

      function processCoordinates(data) {
        let latitudes = (data.map(item => correctEncoding(item[typ1])));
        let longitudes = (data.map(item => correctEncoding(item[typ2])));


        if (!latitudes || !longitudes) {
          throw new Error("Latitude or longitude data is undefined.");
        }
        if (latitudes.length !== longitudes.length) {
          throw new Error("Number of latitudes and longitudes must be equal.");
        }



        for (let i = 0; i < latitudes.length; i++) {
          let lat = latitudes[i];
          let long = longitudes[i];
          var isValid;
          if (isValidLatLongDMS(lat, long) === true) {
            isValid = true;
            I++;
          }
          else {
            isValid = false;
            W++;
          }

          coordinateData.push({
            latitude: lat,
            longitude: long,
            isValid: isValid
          });
        }

        // console.log(coordinateData);
        return coordinateData
      }

      processCoordinates(data);
      return { data: coordinateData, validCount: I, errorcount: W };

    } catch (error) {
      console.error("Error in valid entry:", error);
      throw new Error("Internal Server Error");
    }
  },

  async createLog(logData) {
    try {
      await db.query(
        "INSERT INTO stationcode (filename, error_percentage,created_time) VALUES ($1, $2,$3)",
        [logData.filename, logData.error_percentage, logData.created_time]
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
module.exports = latlongServices;