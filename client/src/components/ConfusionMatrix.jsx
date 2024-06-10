import React from "react";

function ConfusionMatrix({ data }) {
  // Function to create confusion matrix
  const createConfusionMatrix = (data) => {
    let confusionMatrix = {};

    // Iterate through data array
    data.forEach((entry) => {
      let actual = entry.zone.toLowerCase();
      let predicted = entry.zone.toLowerCase();

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

    return confusionMatrix;
  };

  // Function to determine background color based on value
  const getBackgroundColor = (value) => {
    if (value === 0) return "white"; // Light red for 0
    if (value > 0 && value <= 2) return "#fff3cd"; // Light yellow for low values
    if (value > 2 && value <= 5) return "#d1ecf1"; // Light blue for moderate values
    if (value > 5 && value <= 10) return "#c3e6cb"; // Light green for higher values
    return "#a3dca4"; // Darker green for highest values
  };

  // Generate confusion matrix
  const confusionMatrix = createConfusionMatrix(data);

  // Render confusion matrix table
  return (
    <div style={{ margin: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Confusion Matrix</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #dddddd", padding: "8px" }}></th>
            {Object.keys(confusionMatrix).map((actualClass) => (
              <th
                key={actualClass}
                style={{ border: "1px solid #dddddd", padding: "8px" }}
              >
                {actualClass}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(confusionMatrix).map((actualClass) => (
            <tr key={actualClass}>
              <th style={{ border: "1px solid #dddddd", padding: "8px" }}>
                {actualClass}
              </th>
              {Object.keys(confusionMatrix).map((predictedClass) => (
                <td
                  key={predictedClass}
                  style={{
                    border: "1px solid #dddddd",
                    padding: "8px",
                    backgroundColor: getBackgroundColor(
                      confusionMatrix[actualClass][predictedClass] || 0
                    ),
                  }}
                >
                  {confusionMatrix[actualClass][predictedClass] || 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Example usage
export default ConfusionMatrix;
