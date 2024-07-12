import React from "react";

const ConfusionMatrix = ({ data }) => {
  // Function to create confusion matrix
  const createConfusionMatrix = (data) => {
    let confusionMatrix = {};
    let classes = new Set();

    // Iterate through data array
    data.forEach(entry => {
      let actual = entry.actual;
      let predicted = entry.pred;

      // Add classes to the set
      classes.add(actual);
      classes.add(predicted);

      // If actual class not present in confusion matrix, create it
      if (!confusionMatrix[actual]) {
        confusionMatrix[actual] = {};
      }

      // If predicted class not present in actual class, create it
      if (!confusionMatrix[actual][predicted]) {
        confusionMatrix[actual][predicted] = 0;
      }

      // Increment count for actual and predicted class pair
      confusionMatrix[actual][predicted]++;
    });

    return { confusionMatrix, classes: Array.from(classes) };
  };

  // Function to determine background color based on value and position
  const getBackgroundColor = (value, isDiagonal) => {
    if (isDiagonal) {
      return '#c3e6cb'; // Light green for diagonal cells
    } else {
      return value > 0 ? '#f8d7da' : 'white'; // Light red for values greater than 0, white otherwise
    }
  };

  // Generate confusion matrix
  const { confusionMatrix, classes } = createConfusionMatrix(data);

  // Calculate column totals and row totals
  const columnTotals = {};
  const rowTotals = {};
  let totalSum = 0;
  classes.forEach(predictedClass => {
    columnTotals[predictedClass] = 0;
    classes.forEach(actualClass => {
      const count = (confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0;
      columnTotals[predictedClass] += count;
      rowTotals[actualClass] = (rowTotals[actualClass] || 0) + count;
      totalSum += count;
    });
  });

  // Calculate Observed Agreement (Po)
  let observedAgreement = 0;
  classes.forEach(cls => {
    observedAgreement += (confusionMatrix[cls] && confusionMatrix[cls][cls]) || 0;
  });
  observedAgreement /= totalSum;

  // Calculate Expected Agreement (Pe)
  let expectedAgreement = 0;
  classes.forEach(cls => {
    expectedAgreement += (rowTotals[cls] * columnTotals[cls]) / totalSum;
  });
  expectedAgreement /= totalSum;

  // Calculate Kappa Coefficient
  const kappa = (observedAgreement - expectedAgreement) / (1 - expectedAgreement);

  // Calculate relative misclassification matrix
  const relativeMisclassificationMatrix = {};
  classes.forEach(actualClass => {
    relativeMisclassificationMatrix[actualClass] = {};
    classes.forEach(predictedClass => {
      const count = (confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0;
      relativeMisclassificationMatrix[actualClass][predictedClass] = count / rowTotals[actualClass];
    });
  });

  // Calculate number of incorrect attribute values, rate of correct attributes, and rate of incorrect values
  let incorrectAttributes = 0;
  let correctAttributes = 0;
  classes.forEach(actualClass => {
    classes.forEach(predictedClass => {
      if (actualClass === predictedClass) {
        correctAttributes += (confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0;
      } else {
        incorrectAttributes += (confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0;
      }
    });
  });

  const totalAttributes = correctAttributes + incorrectAttributes;
  const correctRate = (correctAttributes / totalAttributes) * 100;
  const incorrectRate = (incorrectAttributes / totalAttributes) * 100;

  // Render confusion matrix and relative misclassification matrix
  return (
    <div style={{ margin: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Confusion Matrix</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}></th>
            <th colSpan={classes.length} style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'center' }}>Dataset Class</th>
            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'center' }}>Total</th>
          </tr>
          <tr>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>True Class ↓</th>
            {classes.map(actualClass => (
              <th key={actualClass} style={{ border: '1px solid #dddddd', padding: '8px' }}>{actualClass}</th>
            ))}
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(actualClass => {
            const rowTotal = classes.reduce((sum, predictedClass) => sum + ((confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0), 0);
            return (
              <tr key={actualClass}>
                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>{actualClass}</th>
                {classes.map(predictedClass => (
                  <td key={predictedClass} style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: getBackgroundColor((confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0, actualClass === predictedClass) }}>
                    {(confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0}
                  </td>
                ))}
                <td style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: '#d1ecf1' }}>{rowTotal}</td>
              </tr>
            );
          })}
          <tr>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Total</th>
            {classes.map(predictedClass => (
              <td key={predictedClass} style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: '#d1ecf1' }}>
                {columnTotals[predictedClass]}
              </td>
            ))}
            <td style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: '#d1ecf1' }}>
              {totalSum}
            </td>
          </tr>
        </tbody>
      </table>
      <center>
      <div style={{
    marginTop: "20px",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    width: "700px",
    borderRadius: "10px",
    backgroundColor: "#e0f7e9",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
  }}>
        <h3>Kappa Coefficient: {kappa.toFixed(4)}</h3>
        <h3>Number of Incorrect Attributes: {incorrectAttributes}</h3>
        <h3>Rate of Correct Attributes: {correctRate.toFixed(2)}%</h3>
        <h3>Rate of Incorrect Values: {incorrectRate.toFixed(2)}%</h3>
      </div>
      </center>
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Relative Misclassification Matrix</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}></th>
            <th colSpan={classes.length} style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'center' }}>Dataset Class</th>
          </tr>
          <tr>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>True Class ↓</th>
            {classes.map(actualClass => (
              <th key={actualClass} style={{ border: '1px solid #dddddd', padding: '8px' }}>{actualClass }</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classes.map(actualClass => (
            <tr key={actualClass}>
              <th style={{ border: '1px solid #dddddd', padding: '8px' }}>{actualClass}</th>
              {classes.map(predictedClass => (
                <td key={predictedClass} style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: getBackgroundColor(relativeMisclassificationMatrix[actualClass][predictedClass], actualClass === predictedClass) }}>
                  {isNaN(relativeMisclassificationMatrix[actualClass][predictedClass].toFixed(2)) ? '0.00 ' : relativeMisclassificationMatrix[actualClass][predictedClass].toFixed(2) }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConfusionMatrix;
