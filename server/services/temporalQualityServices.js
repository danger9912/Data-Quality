const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const moment = require('moment');
const temporalValidity = require('../utils/temporalValidity');

const convertNumberToDate = (num) => {
  if (typeof num !== 'number') {
    return 'Invalid Date';
  }

  const startDate = new Date(1900, 0, 1);
  const excelEpochAdjustment = 1;

  const convertedDate = new Date(startDate.getTime() + (num - excelEpochAdjustment) * 24 * 60 * 60 * 1000);

  if (isNaN(convertedDate.getTime())) {
    return 'Invalid Date';
  }

  return convertedDate.toISOString().split('T')[0];
};

const isAmbiguousDate = (dateStr) => {
  const parts = dateStr.split('-');
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  return month <= 12 && day <= 12;
};

const processDates = async (filename, attributes) => {
  try {
    const filePath = path.join(__dirname, "..", "uploads", filename);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);
    const typ = attributes[0].value;

    const filterData = data.map((item) => {
      const value = item[typ];
      if (typeof value === 'number') {
        return convertNumberToDate(value);
      } else {
        return 'Invalid Date';
      }
    });

    const invalidDates = filterData.filter(date => date === 'Invalid Date');
    const validDates = filterData.filter(date => date !== 'Invalid Date');

    const ambiguousDates = validDates.filter(date => isAmbiguousDate(date));
    const nonAmbiguousDates = validDates.filter(date => !isAmbiguousDate(date));

    const totalDates = filterData.length;
    const invalidCount = invalidDates.length;
    const ambiguousCount = ambiguousDates.length;
    const validCount = nonAmbiguousDates.length;

    const invalidPercentage = (invalidCount / totalDates) * 100;
    const ambiguousPercentage = (ambiguousCount / validDates.length) * 100;

    return {
      validCount,
      totalDates,
      invalidCount,
      ambiguousCount,
      invalidPercentage: invalidPercentage.toFixed(2),
      ambiguousPercentage: ambiguousPercentage.toFixed(2),
      filterDates: nonAmbiguousDates,
      invalidDates,
      ambiguousDates
    };

  } catch (error) {
    console.error('Error processing dates:', error);
    throw error;
  }
};
const temporalQualityServices = {
  
    async temporalVal(body) {
        const filename = body.filename
        const filePath = path.join(__dirname, '../uploads', filename);
        const data = await fs.readFile(filePath, 'utf8');
        const jsonArray = JSON.parse(data);
        const result = temporalValidity(body.attributes, jsonArray);

        return result;
    },
    
    async  tempoConistency(filename, attributes) {
      const convertNumberToDate = (num) => {
        if (typeof num !== 'number') {
          return 'Invalid Date';
        }
      
        // Excel's date system starts on January 1, 1900, and considers 1900 as a leap year
        const startDate = new Date(1900, 0, 1);
        const excelEpochAdjustment = 1; // Adjust for Excel's incorrect leap year
      
        const convertedDate = new Date(startDate.getTime() + (num - excelEpochAdjustment) * 24 * 60 * 60 * 1000);
      
        if (isNaN(convertedDate.getTime())) {
          return 'Invalid Date';
        }
      
        return convertedDate.toISOString().split('T')[0];
      };
      
      // Helper function to check if a date is ambiguous
      const isAmbiguousDate = (dateStr) => {
        const parts = dateStr.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
      
        return month <= 12 && day <= 12;
      };
      
        try {
          // Construct the file path
          const filePath = path.join(__dirname, "..", "uploads", filename);
      
          // Read and parse the JSON file
          const rawData = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(rawData);
          
          // Get the attribute type
          const typ = attributes[0].value;
      
       
    // Filter and convert date data based on the attribute
    const filterData = data.map((item) => {
      const value = item[typ];
      if (typeof value === 'number') {
        return convertNumberToDate(value);
      } else {
        return 'Invalid Date';
      }
    });

    // Remove invalid dates
    const invalidDates = filterData.filter(date => date === 'Invalid Date');
    const validDates = filterData.filter(date => date !== 'Invalid Date');

    // Identify ambiguous dates
    const ambiguousDates = validDates.filter(date => isAmbiguousDate(date));
    const nonAmbiguousDates = validDates.filter(date => !isAmbiguousDate(date));

    // Calculate the percentage of invalid and ambiguous dates
    const totalDates = filterData.length;
    const invalidCount = invalidDates.length;
    const ambiguousCount = ambiguousDates.length;
    const invalidPercentage = (invalidCount / totalDates) * 100;
    const ambiguousPercentage = (ambiguousCount / validDates.length) * 100;

    console.log('Filtered Dates:', nonAmbiguousDates);
    console.log('Ambiguous Dates:', ambiguousDates);
    console.log(`Invalid Date Percentage: ${invalidPercentage.toFixed(2)}%`);
    console.log(`Ambiguous Date Percentage: ${ambiguousPercentage.toFixed(2)}%`);
    return {
      validDates:validDates.length,
      totalDates : totalDates,
      invalidCount : invalidCount,
      ambiguousCount : ambiguousCount,
      invalidPercentage : invalidPercentage,
      ambiguousPercentage:ambiguousPercentage,
      filterDates : nonAmbiguousDates,
    }

          // Helper function to check if a date is valid
           } catch (error) {
          console.error('Error processing dates:', error);
          throw error;
        }
      },
    async temporalVal(body) {
        const filename = body.filename
        const filePath = path.join(__dirname, '../uploads', filename);
        const data = await fs.readFile(filePath, 'utf8');
        const jsonArray = JSON.parse(data);
        const result = temporalValidity(body.attributes, jsonArray);

        return result;
    },
    
      async tempoValidity (filename, attributes) {
      try {
        return await processDates(filename, attributes);
      } catch (error) {
        console.error('Error in tempoValidity function:', error);
        throw error;
      }
    },
      async tempoStartend (filename, attributes) {
      try {
        // Construct the file path
        const filePath = path.join(__dirname, "..", "uploads", filename);
      
        // Read and parse the JSON file
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);
        
        // Get the attribute type
        const typ1 = attributes[0].value;
        const typ2 = attributes[1].value;
        const filter1 = data.map((item) => item[typ1]);
        const filter2 = data.map((item) => item[typ2]);



        
        
        const combinedDates = filter1.map((date1, index) => {
            const date2 = filter2[index];
            return {
                date1: date1,
                date2: date2
            };
        });
        const combinedDates2 = data.map((item, index) => {
            const date2 = filter2[index];
            const isvalid2 = typeof date2 === 'number' ? convertNumberToDate(date2) :false
            const isnotamb2 = isvalid2 === false ? false : !isAmbiguousDate(isvalid2)
            const date1 =  filter1[index];
            const isvalid1 = typeof date2 === 'number' ? convertNumberToDate(date2) :false
            const isnotamb1 = isvalid1 === false ? false : !isAmbiguousDate(isvalid1)
            const valid = isnotamb1 &&  isnotamb2 ?  date1 < date2 ? "true" : "false" : "false"
            return {
                date1: convertNumberToDate(date1) === 'Invalid Date' ? date1 :convertNumberToDate(date1),
                date2: convertNumberToDate(date2) === 'Invalid Date' ? date2 :convertNumberToDate(date2), 
                valid: valid
            };
        });
        
        let count = 0;

        const hel = combinedDates2.map(({ date1, date2, valid }) => {
            if (valid === 'true') {
                count++;
            }
        });
        count = count/data.length
        count  = count *100;
console.log({combinedDates2,count})

      //   const validCombinedDates = combinedDates.filter(({ date1, date2 }) => {
          

      // });

    //   const validCombinedDates = combinedDates
    // .filter(({ date1, date2 }) => typeof date1 === 'number' && typeof date2 === 'number')
    // .map(({ date1, date2 }) => {
    //     return {
    //         date1,
    //         date2,
    //         isValid: date1 < date2
    //     };
    // });
    //     console.log(validCombinedDates);
        
        // console.log(filter1)
        // console.log(filter2)

        return {combinedDates2,count};
        

      } catch (error) {
        console.error('Error in tempoValidity function:', error);
        throw error;
      }
    },


};

module.exports = temporalQualityServices;