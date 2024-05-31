const path = require("path");
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");
const XLSX = require('xlsx');

const accuracyServices = {

    
async  getcols(filename, attributes) {
    try {
        // Assuming these are the attributes in your data
        console.log("hi:" + attributes);

        const typ1 = attributes[0].value;
        const typ2 = attributes[1].value;

        const filePath = path.join(__dirname, "..", "uploads", filename);

        const rawData = fs.readFileSync(filePath);
        const data = JSON.parse(rawData);

        // Function to correct encoding issues in DMS string
        function correctDMSString(dmsString) {
            if (typeof dmsString !== 'string') {
                console.error("Input is not a string.");
                return dmsString; // Return the input unchanged
            }
            return dmsString.replace(/Ã‚Â°/g, "°").replace(/â€™/g, "'").replace(/â€œ/g, '"').replace(/â€"/g, '"');
        }

        // Function to convert DMS to decimal degrees
        function convertDMSToDecimal(degrees, minutes, seconds, direction) {
            // Convert DMS to decimal degrees
            let decimalDegree = degrees + (minutes / 60) + (seconds / 3600);

            // If the direction is South or West, make the decimal degree negative
            if (direction === 'S' || direction === 'W') {
                decimalDegree = -decimalDegree;
            }

            return decimalDegree;
        }

        // Function to parse and convert DMS string to decimal degrees
        function parseDMS(dmsString) {
            const dmsRegex = /(\d+)°(\d+)'([\d.]+)"([NSEW])/;
            const matches = dmsRegex.exec(dmsString);

            if (matches) {
                const degrees = parseInt(matches[1], 10);
                const minutes = parseInt(matches[2], 10);
                const seconds = parseFloat(matches[3]);
                const direction = matches[4];

                return convertDMSToDecimal(degrees, minutes, seconds, direction);
            } else {
                throw new Error("Invalid DMS format");
            }
        }

        // Main function to correct and convert DMS to decimal degrees
        function correctAndConvertDMS(dmsString) {
            const correctedDMS = correctDMSString(dmsString);
            return parseDMS(correctedDMS);
        }

        // Function to process a list of DMS data
        function processDMSData(data, typ1, typ2) {
            return data.map(entry => {
                console.log(entry);
                const latDMS = entry[typ1];
                const longDMS = entry[typ2];
                console.log(typ1);
                try {
                    const latitude = parseFloat(correctAndConvertDMS(latDMS).toFixed(4));
                    const longitude = parseFloat(correctAndConvertDMS(longDMS).toFixed(4));
                    console.log("lat+ " + latitude);
                    console.log("long+ " + longitude);

                    const isValidLatitude = latitude >= -90 && latitude <= 90;
                    const isValidLongitude = longitude >= -180 && longitude <= 180;

                    return {
                        latitude,
                        longitude,
                        isValid: isValidLatitude && isValidLongitude
                    };
                } catch (error) {
                    console.error(`Error processing entry ${latDMS}, ${longDMS}: ${error.message}`);
                    return {
                        latitude: latDMS,
                        longitude: longDMS,
                        isValid: false
                    };
                }
            });
        }

        // Process the data from the file
        const convertedData = processDMSData(data, typ1, typ2);

        console.log(convertedData);
        return convertedData;
    } catch (error) {
        console.error("Error:", error.message);
    }
},
    // Output:
    // [
    //     { latitude: 26.722808333333334, longitude: 77.00201222222223 },
    //     { latitude: 28.649675, longitude: 77.22329444444444 }
    // ]


    // **************
    // const result = countNull(data, attributes);
    // // return result;
    // console.log(result);
    // console.log(data)
    // const typ = attributes[0].value;
    // // console.log("tpy" +typ)
    // // console.log(data[0]?.[typ]);

    // // console.log("gi" +data[0][typ]);
    // let originalDate;
    // let valid;
    // const combinedData = data.map(item => {
    //     // console.log(excelDateToYYYYMMDD(item[typ]));
    //     if (typeof item[typ] === 'number') {

    //         //  const k = excelDateToYYYYMMDD(item[typ]);
    //         //  console.log("kk" + k)
    //         originalDate = item[typ];
    //         valid = "valid";
    //     } else {
    //         // console.log(item[typ])
    //         originalDate = item[typ];
    //         valid = "Invalid";
    //     }

    //     return {
    //         originalData: item[typ],
    //         convertedData: valid
    //     };
    // });



    async createNewAccuracyMeasurementLog(logData) {
        try {
            console.log(logData)
            await db.query(
                "INSERT INTO accuracynumber (confidence_level, good_percentage_s, notgood_percentage_s,file_name,created_date,low_bound,high_bound,good_percentage_r,notgood_percentage_r) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9)",
                [logData.confidence_level, logData.good_percentage_s, logData.notgood_percentage_s, logData.file_name, logData.created_date, logData.low_bound, logData.high_bound, logData.good_percentage_r, logData.notgood_percentage_r]
            );

        } catch (error) {
            console.error("Error creating log entry:", error);
            throw new Error("Internal Server Error");
        }
    },
    async getAccuracylogs() {
        try {
            const result = await db.query(
                "SELECT * FROM accuracynumber"
            );
            return result.rows;

        } catch (error) {
            console.error("Error creating log entry:", error);
            throw new Error("Internal Server Error");
        }
    }

};

module.exports = accuracyServices;



