const generalDetailsServices = require("../services/generalDetailsServices");
const checkFormatConsistency = require("../utils/checkFormatConsistency");
const checkCorruption = require("../utils/checkFileCorruption");
// const XLSX = require("xlsx");
const XLSX = require("xlsx");
const moment = require("moment");
const pool = require("../database/connection");



exports.saveGeneralDetails = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file was uploaded.");
    }
    const file = req.file;
    const fileSizeInBytes = file.size;
    const fileExtension = file.originalname.split(".").pop();
    const acceptable = await checkFormatConsistency(
      fileSizeInBytes,
      fileExtension,
      res,
      file
    );
    if (acceptable) {
      const corrupted = await checkCorruption(file);
      if (corrupted) {
        res.status(400).json({ message: "File is potentially corrupted" });
      } else {
        const result = await generalDetailsServices.handleData(
          file,
          file.originalname
        );
        res.status(201).json(result);
      }
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.fetchDataFormat = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM data_formate');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.dateFormat = async (req, res, next) => {
  try {
    // console.log(req.file.path);

    if (!req.file) {
      return res.status(400).json({ message: "Invalid file" });
    }


    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
    });

    const headers = jsonData[0];
    const data = jsonData.slice(0);
    const jsonObject = data.map((row) => {
      const obj = {};
      row.forEach((value, index) => {
        obj[headers[index]] = value;
      });
      return obj;
    });

    const filteredJsonObject = jsonObject.filter((obj) => {
      return Object.values(obj).some(
        (val) => val !== null && typeof val !== "object"
      );
    });

    const extractedDates = [];
    filteredJsonObject.forEach((obj) => {
      if (obj.Date != null) {
        extractedDates.push(obj.Date);
      }
    });

    function hasError(actualDate, changedDate) {
      return actualDate !== changedDate ? "1" : "0";
    }

    const jsonObjects = extractedDates.map((dateString) => {
      const actualDate = moment(
        dateString,
        [
          "DD-MM-YYYY",
          "DD-MMM",
          "DD/MM/YYYY",
          "DD/MM/YY",
          "DD/M/YY",
          "YYYY/MM/DD",
          "YYYY/DD/MM",
          "DD-MMMMM-YYYY",
          "DD-MM-YY",
          "D-M-YY",
          "D.M.YY",
          "DD MMMMM YYYY",
          "DD-MMM-YY",
          "DD-MM-YYYY HH:mm",
          "MMM-YY",
          "MM-DD-YYYY",
          "MM.DD.YYYY",
          "MMM-DD-YYYY",
          "YYYY-MM-DD HH:mm",
          "MM-DD-YY hh:mm",
          "YYYY-MM-DD H:mm",
          "YYYY-MM-DD",
          "YYYY.MM.DD",
        ],
        true
      );

      let formatUsed = "";
      if (actualDate.isValid()) {
        formatUsed = actualDate.creationData().format;
      } else {
        formatUsed = "invalid";
      }

      const formats = [
        "DD-MM-YYYY",
        "MMM-YY",
        "DD-MMM",
        "MM-DD-YYYY",
        "YYYY/MM/DD",
        "YYYY-MM-DD",
        "YYYY-DD-MM",
        "DD-YYYY-MM",
        "MM-YYYY-DD",
      ];

      const changedDates1 = actualDate.format("YYYY-MM-DD");
      const changedDates2 = actualDate.format("YYYY/MM/DD");

      const error1 = hasError(dateString, changedDates1);
      const error2 = hasError(dateString, changedDates2);

      let error;
      if (error1 == "1" && error2 == "1") {
        error = "1";
      } else {
        error = "0";
      }

      return {
        actual_date: dateString,
        format_used: formatUsed,
        'Tranformed_date(CCYY-MM-DD)': changedDates1,
        error: error,
      };
    });


    // add 
    // const client = await pool.connect();
    // try {
    //   await client.query('BEGIN');
    //   for (const obj of jsonObjects) {
    //     const query = {
    //       text: `INSERT INTO data_formate(actual_date, format_used, transformed_date, error) VALUES($1, $2, $3, $4)`,
    //       values: [obj.actual_date, obj.format_used, obj['Tranformed_date(CCYY-MM-DD)'], obj.error],
    //     };
    //     await client.query(query);
    //   }
    //   await client.query('COMMIT');
    // } catch (error) {
    //   await client.query('ROLLBACK');
    //   throw error;
    // } finally {
    //   client.release();
    // }


    const count = jsonObjects.filter((obj) => obj.error === "0").length;
    const t = jsonObjects.filter((obj) => obj.error === "1").length;
    const accuracy = (count / (count + t)) * 100;
    console.log("hi")
    res.json({ data: jsonObjects, accuracy });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};