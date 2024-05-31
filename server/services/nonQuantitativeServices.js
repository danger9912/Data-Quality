const path = require("path");
const fs = require("fs");
const countNull = require("../utils/countNull");
const db = require("../database/connection");
const fileChanges = require("../utils/fileModification");
const XLSX = require('xlsx');
const axios = require('axios');
const nonQuantitativeService = {

    async SelectedCode(filename, attributes) {

        try {
            const railwayZones = {
                "CR": "Central Railway",
                "ER": "Eastern Railway",
                "ECR": "East Central Railway",
                "ECOR": "East Coast Railway",
                "NR": "Northern Railway",
                "NCR": "North Central Railway",
                "NER": "North Eastern Railway",
                "NFR": "North Frontier Railway",
                "NWR": "North Western Railway",
                "SR": "Southern Railway",
                "SCR": "South Central Railway",
                "SER": "South Eastern Railway",
                "SECR": "South East Central Railway",
                "SWR": "South Western Railway",
                "WR": "Western Railway",
                "WCR": "West Central Railway",
                "MRK": "Metro Railway, Kolkata",
                "SCOR": "South Coast Railway"
            };

            function getRailwayZones(codes) {
                return codes.map(code => {
                    const upperCaseCode = code.toUpperCase();
                    return railwayZones[upperCaseCode] || "Invalid station code";
                });
            }

            // Example usage:
            // const stationCodes = ["cr", "Er", "xyz", "NFR"];

            // Output: [ 'Central Railway', 'Eastern Railway', 'Invalid station code', 'North Frontier Railway' ]

            // console.log(filename);


            console.log("hi:" + attributes);
            // console.log(attributes[0]);
            const typ1 = attributes[0].value
            console.log(typ1)
            const typ2 = attributes[1].value
            // console.log("-------")
            const filePath = path.join(__dirname, "..", "uploads", filename);

            const rawData = fs.readFileSync(filePath);
            const data = JSON.parse(rawData);

            const orgCode = data.map(item => item[typ1]);
            const orgName = data.map(item => item[typ2]);
            // const typ = attributes[0].value;


            // console.log(data);

            //     console.log(typ);
            //   console.log("gi" +data[2][typ]);
            // console.log(data[typ1]);
            var nullTyp1Count = 0;
            var nullTyp2Count = 0;

            const filteredData = data.filter(item => {
                
                const isTyp1Null = item[typ1] === 'blank' ? true : false;
                const isTyp2Null = item[typ2] === 'blank'? true :false;

                if (isTyp1Null) nullTyp1Count++;
                if (isTyp2Null) nullTyp2Count++;

                return !isTyp1Null && !isTyp2Null;
            });


            const typ1Values = filteredData.map(item => item[typ1]);

            const pred = getRailwayZones(typ1Values);
            const actual = filteredData.map(item => item[typ2])

            const combine = filteredData.map((item, index) => ({
                pred: pred[index],
                actual: actual[index],
                stationCode: typ1Values[index]
            }));
            const orgcomb = data.map((item, index) => ({
                code: orgCode[index],
                number: orgName[index],
                
            }));

            // console.log(getRailwayZones(typ1Values));
            // console.log(typ1Values);


            //       // Return the station codes as JSON
            // console.log("Hi"+stationCodes)

            // //   let originalDate;


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
            console.log(combine)

            return {data : combine , nullcount1  : nullTyp1Count , nullcount2:nullTyp2Count,totallength : data.length , originalData : orgcomb};
            // return "hwllo"
        } catch (err) {
            console.error("Error fetching logs:", err);
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
module.exports = nonQuantitativeService;