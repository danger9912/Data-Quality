const countNull = (data,attributes) => {
  const counts = {};
  const handleNullValues = (val) => {
    if (valuesToCount.includes(val)) {
      return (valuesToCount.findIndex(e => e === val) + 1);
    }
    else {
      return false;
    }
  }

  const valuesToCount = [
    "null",
    "NA",
    "-",
    ".",
    "Not Applicable",
    "NULL",
    "blank",
    "N/A",
    "N.A.",
    "Not Available",
    "Not Provided",
    "$",
    "`",
    "~",
    "!",
    "@",
    "#",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+","=",
    "/",
    "<",
    ">",
    "?"
  ];

  let totalRows = 0;
  let rowsWithValuesToCount = 0;

  data.forEach((entry) => {
    Object.keys(entry).forEach((column) => {
      if(attributes.includes(column)){
      if (!counts[column]) {
        counts[column] = Object.fromEntries(valuesToCount.map((val)=>[val,0]));
      }
      const value = handleNullValues(entry[column]);
      if (value) {
        counts[column][valuesToCount[value - 1]] ++;
        rowsWithValuesToCount++;
      }     
    }
    });
    totalRows++;
  });

  counts['cols'] = attributes.length;
  counts['rows'] = data.length;
  counts['omissionRate'] = Number(((rowsWithValuesToCount/(attributes.length * data.length)) * 100).toFixed(2));
  return counts;
};
module.exports = countNull;
