const path = require("path");
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");
const XLSX = require('xlsx');
const axios = require('axios');
const checkAllFeildsServices = {

    async getlatlong(filename, attributes) {
        try {
            let coordinateData = [];
            console.log(filename);
            console.log(attributes);
            console.log(attributes[0]);
            console.log("-------");
            let I = 0;
            let W = 0;
            const filePath = path.join(__dirname, "..", "uploads", filename);
            const rawData = fs.readFileSync(filePath);
            const data = JSON.parse(rawData);
    
            const typ1 = attributes[0].value;
            const typ2 = attributes[1].value;
    
            function correctEncoding(str) {
                if (typeof str !== 'string') {
                    // console.error("Input is not a string.");
                    return str;
                }
    
                return str.replace(/Ã‚Â°/g, '°')
                    .replace(/Ã‚Â'/g, "'")
                    .replace(/Ã‚Â"/g, '"')
                    .replace(/Ã‚Â/g, '')
                    .replace(/Ã¢â‚¬Â²/g, "'")
                    .replace(/Ã¢â‚¬Â³/g, '"')
                    .replace(/, /g, ' ');
            }
    
            function dmsToDecimal(degrees, minutes, seconds, direction) {
                let decimal = degrees + minutes / 60 + seconds / 3600;
                if (direction === "S" || direction === "W") {
                    decimal = decimal * -1;
                }
                return Math.round(decimal * 10000) / 10000;
            }
    
            function parseDMS(input) {
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
    
            function isValidLatLongDMS(dmsLat, dmsLong) {
                let latDecimal = parseDMS(dmsLat);
                let longDecimal = parseDMS(dmsLong);
    
                if (latDecimal === null || longDecimal === null) {
                    return false;
                }
    
                if (latDecimal < -90 || latDecimal > 90) {
                    return false;
                }
    
                if (longDecimal < -180 || longDecimal > 180) {
                    return false;
                }
    
                return true;
            }
    
            function processCoordinates(data) {
                let latitudes = data.map(item => correctEncoding(item[typ1]));
                let longitudes = data.map(item => correctEncoding(item[typ2]));
    
                if (!latitudes || !longitudes) {
                    throw new Error("Latitude or longitude data is undefined.");
                }
                if (latitudes.length !== longitudes.length) {
                    throw new Error("Number of latitudes and longitudes must be equal.");
                }
    
                for (let i = 0; i < latitudes.length; i++) {
                    let lat = latitudes[i];
                    let long = longitudes[i];
                    let isValid;
                    let latDecimal = parseDMS(lat);
                    let longDecimal = parseDMS(long);
    
                    if (isValidLatLongDMS(lat, long)) {
                        isValid = true;
                        I++;
                    } else {
                        isValid = false;
                        W++;
                    }
    
                    coordinateData.push({
                        latitude: lat,
                        longitude: long,
                        latDecimal: isValid ? latDecimal : null,
                        longDecimal: isValid ? longDecimal : null,
                        isValid: isValid
                    });
                }
    
                return coordinateData;
            }
    
            let processedData = processCoordinates(data);
            return { data: processedData, validCount: I, errorcount: W };
    
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



module.exports = checkAllFeildsServices;

