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

  classes.forEach(cls => {
    columnTotals[cls] = 0;
    rowTotals[cls] = 0;
  });

  classes.forEach(actualClass => {
    classes.forEach(predictedClass => {
      const count = (confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0;
      rowTotals[actualClass] += count;
      columnTotals[predictedClass] += count;
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
  const kappa = totalSum > 0 ? (observedAgreement - expectedAgreement) / (1 - expectedAgreement) : 0;

  // Render confusion matrix table
  return (
    <div style={{ margin: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Confusion Matrix</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}></th>
            <th colSpan={classes.length} style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'center' }}>Predicted Class</th>
            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'center' }}>Total</th>
          </tr>
          <tr>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Actual Class ↓</th>
            {classes.map(actualClass => (
              <th key={actualClass} style={{ border: '1px solid #dddddd', padding: '8px' }}>{actualClass}</th>
            ))}
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(actualClass => {
            return (
              <tr key={actualClass}>
                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>{actualClass}</th>
                {classes.map(predictedClass => (
                  <td key={predictedClass} style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: getBackgroundColor((confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0, actualClass === predictedClass) }}>
                    {(confusionMatrix[actualClass] && confusionMatrix[actualClass][predictedClass]) || 0}
                  </td>
                ))}
                <td style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: '#d1ecf1' }}>{isNaN(rowTotals[actualClass]) ? 0 : rowTotals[actualClass]}</td>
              </tr>
            );
          })}
          <tr>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Total</th>
            {classes.map(predictedClass => (
              <td key={predictedClass} style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: '#d1ecf1' }}>
                {isNaN(columnTotals[predictedClass]) ? 0 : columnTotals[predictedClass] }
              </td>
            ))}
            <td style={{ border: '1px solid #dddddd', padding: '8px', backgroundColor: '#d1ecf1' }}>
              {totalSum}
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h3>Kappa Coefficient: {isNaN(kappa) ? 0 : kappa.toFixed(4)}</h3>
      </div>
    </div>
  );
}

export default ConfusionMatrix;
