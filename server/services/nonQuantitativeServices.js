const path = require("path");
const fs = require("fs");
const db = require("../database/connection");
const xlsx = require("xlsx");

const nonQuantitativeService = {
  async SelectedCodeAndName(filename, attributes) {
    try {
      let railwayData1;
      let railwayData;
      let resultObject;

      // Read the Excel file instead of JSON file
      const excelFilePath = path.join(
        __dirname,
        "..",
        "standard_data",
        "output1.xlsx"
      );
      const workbook = xlsx.readFile(excelFilePath);
      const sheetName = workbook.SheetNames[0];

      railwayData1 = xlsx.utils
        .sheet_to_json(workbook.Sheets[sheetName])
        .reduce((acc, row) => {
          acc[row["Station Code"].toUpperCase()] = row["Station Name"];
          return acc;
        }, {});
      // console.log(railwayData1);

      // ******************************************************************************************************
      const referenceData = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );

      // Create a dictionary to map station codes to their respective names and zones from the reference data
      railwayData = referenceData.reduce((acc, row) => {
        const stationCode = row["Station Code"].toUpperCase();
        acc[stationCode] = {
          name: row["Station Name"],
          zone: row["Zone"],
        };
        return acc;
      }, {});

      // console.log(railwayData);
      // ******************************************************************************************************

      const typ1 = attributes[0].value;
      const typ2 = attributes[1].value;
      // console.log(typ1);
      // console.log(typ2);

      // Read the file which we are uploading!!
      const filePath = path.join(__dirname, "..", "uploads", filename);
      const rawData = fs.readFileSync(filePath, "utf-8");
      const parsedData = JSON.parse(rawData);

      const orgCode = parsedData.map((item) => item[typ1]);
      const orgName = parsedData.map((item) => item[typ2]);

      var nullTyp1Count = 0;
      var nullTyp2Count = 0;

      const filteredData = parsedData.filter((item) => {
        const isTyp1Null = item[typ1] === "blank";
        const isTyp2Null = item[typ2] === "blank";
        // const notbymyside

        if (isTyp1Null) nullTyp1Count++;
        if (isTyp2Null) nullTyp2Count++;

        return !isTyp1Null && !isTyp2Null;
      });

      const typ1Values = filteredData.map((item) => item[typ1]);

      const pred = getRailwayNames(typ1Values);
      const actual = filteredData.map((item) => item[typ2]);

      const combine = filteredData.map((item, index) => {
        const stationCode = typ1Values[index];
        const zone = railwayData[stationCode]
          ? railwayData[stationCode].zone
          : "Unknown Zone";
        return {
          pred: pred[index],
          actual: actual[index],
          stationCode: stationCode,
          zone: zone,
        };
      });

      const orgcomb = parsedData.map((item, index) => ({
        code: orgCode[index],
        number: orgName[index],
      }));
      // console.log(combine);

      // Divide the stations according to the zones
      const zoneStations = referenceData.reduce((acc, row) => {
        const zone = row["Zone"];
        if (!acc[zone]) {
          acc[zone] = [];
        }
        acc[zone].push({
          code: row["Station Code"],
          name: row["Station Name"],
        });
        return acc;
      }, {});

      // console.log(zoneStations);

      // ***********************************************************************************

      resultObject = {
        data: combine,
        nullcount1: nullTyp1Count,
        nullcount2: nullTyp2Count,
        totallength: parsedData.length,
        originalData: orgcomb,
        zoneData: zoneStations,
      };
      return resultObject;

      function getRailwayNames(codes) {
        return codes.map((code) => {
          const upperCaseCode = code.toUpperCase();
          // console.log(upperCaseCode);
          return railwayData1[upperCaseCode] || "Invalid station code";
        });
      }
    } catch (error) {
      console.log("Yaarrrr error aa gayi: ", error);
      return undefined;
    }
  },

  async SelectedCode(filename, attributes) {
    try {
      const railwayZones = {
        CR: "Central Railway",
        ER: "Eastern Railway",
        ECR: "East Central Railway",
        ECOR: "East Coast Railway",
        NR: "Northern Railway",
        NCR: "North Central Railway",
        NER: "North Eastern Railway",
        NFR: "North Frontier Railway",
        NWR: "North Western Railway",
        SR: "Southern Railway",
        SCR: "South Central Railway",
        SER: "South Eastern Railway",
        SECR: "South East Central Railway",
        SWR: "South Western Railway",
        WR: "Western Railway",
        WCR: "West Central Railway",
        MRK: "Metro Railway, Kolkata",
        SCOR: "South Coast Railway",
      };

      function getRailwayZones(codes) {
        return codes.map((code) => {
          const upperCaseCode = code.toUpperCase();
          return railwayZones[upperCaseCode] || "Invalid station code";
        });
      }

      // Example usage:
      // const stationCodes = ["cr", "Er", "xyz", "NFR"];
      // Output: [ 'Central Railway', 'Eastern Railway', 'Invalid station code', 'North Frontier Railway' ]
      // console.log(filename);

      console.log("hi: " + attributes);
      // console.log(attributes[0]);
      const typ1 = attributes[0].value;
      console.log(typ1);
      const typ2 = attributes[1].value;
      // console.log("-------")
      const filePath = path.join(__dirname, "..", "uploads", filename);

      const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(rawData);

      const orgCode = data.map((item) => item[typ1]);
      const orgName = data.map((item) => item[typ2]);
      // const typ = attributes[0].value;

      // console.log(data);

      //     console.log(typ);
      //   console.log("gi" +data[2][typ]);
      // console.log(data[typ1]);
      var nullTyp1Count = 0;
      var nullTyp2Count = 0;

      const filteredData = data.filter((item) => {
        const isTyp1Null = item[typ1] === "blank" ||item[typ1] === "NULL" ||item[typ1] === "null"? true : false;
        const isTyp2Null = item[typ2] === "blank" ||item[typ2] === "NULL"||item[typ2] === "null"? true : false;

        if (isTyp1Null) nullTyp1Count++;
        if (isTyp2Null) nullTyp2Count++;

        return !isTyp1Null && !isTyp2Null;
      });

      const typ1Values = filteredData.map((item) => item[typ1]);

      const truth = getRailwayZones(typ1Values);
      const dataset = filteredData.map((item) => item[typ2]);

      const combine = filteredData.map((item, index) => ({
        pred: dataset[index],
        actual: truth[index],
        stationCode: typ1Values[index],
      }));
      const orgcomb = data.map((item, index) => ({
        code: orgCode[index],
        number: orgName[index],
      }));

    //   console.log(combine);
console.log(filteredData[136])
console.log(filteredData[134])
console.log(filteredData[135])
      return {
        data: combine,
        nullcount1: nullTyp1Count,
        nullcount2: nullTyp2Count,
        totallength: data.length,
        originalData: orgcomb,
      };
      // return "hwllo"
    } catch (err) {
      console.error("Error fetching logs:", err);
      throw new Error("Internal Server Error");
    }
  },

  //********************************************************************************************************

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
      const result = await db.query("SELECT * FROM stationcode");
      return result.rows;
    } catch (error) {
      console.error("Error creating log entry:", error);
      throw new Error("Internal Server Error");
    }
  },

  async viewFile(log) {
    console.log(log);
    try {
      const result = await db.query("SELECT * FROM stationcode");
      return result.rows;
    } catch (error) {
      console.error("Error creating log entry:", error);
      throw new Error("Internal Server Error");
    }
  },
};
module.exports = nonQuantitativeService;