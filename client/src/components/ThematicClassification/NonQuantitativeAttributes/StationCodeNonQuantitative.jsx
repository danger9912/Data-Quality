import axios from "axios";
import { PickList } from "primereact/picklist";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import RelativeMissclassification from "../../MisClassificationMatrix";
import "./NonQuantitative.css";
import styled from 'styled-components';
const TableWrapper = styled.div`
  max-height: 450px; /* Set the height you want for the scrollable area */
  overflow-y: auto;
  width:500px;
  height:550px;
  border: 1px solid #ccc; /* Add border to TableWrapper */
  border-radius: 10px;
`;
const MainContainer = styled.div`
  display: flex;
  // margin-left: 30px;
 
`;

// const SectionContainer = styled.div`
//   // width: 19%;
//   margin-right:15px;
// `;

const DataContainer = styled.div`
  position: relative;
  margin-left:100px;
  margin-right:15px;
  margin-bottom:50px;
// :400px;

`;

// const Dropdown = styled.select`
//   padding: 10px;
//   font-size: 16px;
//   border-radius: 8px;
//   width:150px;
//   margin-bottom:10px
// `;

// const Option = styled.option`
//   padding: 10px;
//   font-size: 16px;
 
//   border-radius: 8px;
// `;

const Table1 = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc; 
  border-radius:8px;
 

`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  font-weight: bold;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  text-align: left;
`;

const TableBodyRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #ddd;
  }
`;

// const ErrorLabel = styled.div`
//   background-color: #ff4d4d;
//   color: white;
//   padding: 10px;
//   font-size: 15px;
//   border-radius: 8px;
// `;
const Lab = styled.div`
  background-color: red;
  color: black;
  padding: 10px;
  font-size: 15px;
  border-radius: 8px;
  margin-bottom:10px;
  margin-top:10px;
`;


const NonQuantitative = () => {
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState("");
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [confusionMatrix, setConfusionMatrix] = useState([]);
  const [incorrect, setIncorrect] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/generaldetails",
        formData
      );
      if (response.status === 201) {
        setSelectedFilename(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
      console.error("Error:", error);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFilename("");
    setSource([]);
    setTarget([]);
    setData([]);
    setOriginalData([]);
    setConfusionMatrix([]);
    setIncorrect("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchFieldNames = async () => {
    try {
      if (selectedFilename) {
        const response = await axios.post(
          "http://localhost:3001/api/fieldnames",
          { filename: selectedFilename }
        );
        const fieldNames = response.data.field_names.map((fieldName) => ({
          label: fieldName,
          value: fieldName,
        }));
        setSource(fieldNames);
      } else {
        console.error("No filename selected.");
      }
    } catch (error) {
      console.error("Error fetching field names:", error);
    }
  };

  const fetchStationCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/nonquantitative/check",
        {
          filename: selectedFilename,
          attributes: target,
        }
      );
      setData(response.data.data);
      setIncorrect(
        parseFloat(
          (response.data.nullcount1 / response.data.totallength) * 100
        ).toFixed(3)
      );
      setOriginalData(response.data.originalData);
      setConfusionMatrix(response.data.data);
      const filteredData = response.data.data.filter(
        (item) => item.pred != null && item.actual != null
      );
      setConfusionMatrix(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchStationCodeandName = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/nonquantitative/check1",
        {
          filename: selectedFilename,
          attributes: target,
        }
      );

      if (response.data) {
        console.log("API Response:", response.data);

        if (Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          console.error("Data is not an array:", response.data.data);
        }

        setIncorrect(
          parseFloat(
            (response.data.nullcount1 / response.data.totallength) * 100
          ).toFixed(3)
        );
        setOriginalData(response.data.originalData);

        console.log(response.data.data[0].zone);

        // setConfusionMatrix(response.data.data);
        generateConfusionMatrix(response.data.data);
        const filteredData = response.data.data.filter(
          (item) => item.zone != null && item.zone != null
        );
        console.log(filteredData);
        setConfusionMatrix(filteredData);
      } else {
        console.error("API response undefined");
      }
    } catch (error) {
      console.error("Ye Dekha error aaya:", error);
    }
  };

  const generateConfusionMatrix = (data) => {
    // const labels = Array.from(
    //   new Set(
    //     data.map((item) => item.zone).concat(data.map((item) => item.zone))
    //   )
    // );
    // const labelIndex = {};
    // labels.forEach((label, index) => {
    //   labelIndex[label] = index;
    // });

    // const matrix = Array(labels.length)
    //   .fill(0)
    //   .map(() => Array(labels.length).fill(0));

    // data.forEach((item) => {
    //   const actualIndex = labelIndex[item.zone];
    //   const predIndex = labelIndex[item.zone];
    //   matrix[actualIndex][predIndex]++;
    // });

    // setConfusionMatrix(matrix);

    const generateConfusionMatrix = (data) => {
      // Extract unique zones
      const zones = Array.from(new Set(data.map((item) => item.zone)));

      // Initialize confusion matrix
      const matrix = Array(zones.length)
        .fill(0)
        .map(() => Array(zones.length).fill(0));

      // Populate confusion matrix
      data.forEach((item) => {
        const actualIndex = zones.indexOf(item.zone);
        matrix[actualIndex][actualIndex]++;
      });

      // Set confusion matrix state
      setConfusionMatrix(matrix);
    };
  };

  const onChange = (e) => {
    const { target } = e;
    setTarget(target.slice(-2));
  };

  return (
    <div>
      <h2 className="Heading">Station Code Non-Quantitative</h2>
      <center>
        <div className="input-container">
          <input
            className="file-input"
            onChange={handleFileChange}
            type="file"
            name="excelFile"
            ref={fileInputRef}
          />
          <Button
            onClick={handleRemoveFile}
            style={{
              backgroundColor: "red",
              color: "white",
              marginLeft: "20px",
            }}
          >
            Remove File
          </Button>
        </div>
        <div>
          <Button
            onClick={fetchFieldNames}
            style={{ marginRight: "10px", marginTop: "1rem" }}
          >
            Read Dataset
          </Button>
        </div>
        <div
          style={{
            marginTop: "1%",
            width: "70%",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1", marginRight: "10px" }}>
            <PickList
              source={source}
              target={target}
              itemTemplate={(item) => item.label}
              sourceHeader="Available Attribute Headings"
              targetHeader="Data Product Specification"
              showSourceControls={false}
              showTargetControls={false}
              sourceStyle={{ height: "300px" }}
              targetStyle={{ height: "300px" }}
              onChange={onChange}
            />
          </div>
        </div>
        <Button
          onClick={fetchStationCodeandName}
          style={{ marginBottom: "50px" }}
        >
          Start Test
        </Button>
      </center>
      {data.length !== 0 && (
        <div className="main-container">
          <div className="data-container">
            {/* ******************************************************************************* */}

            <div style={{ display: "flex" }}>
              <h4>Data Table</h4>
            </div>

            {/* ******************************************************************************* */}
            <div className="table-wrapper">
              <table className="table1">
                <thead>
                  <tr>
                    <th className="table-header">Sr No.</th>
                    <th className="table-header">railway code</th>
                    <th className="table-header">railwayName</th>
                  </tr>
                </thead>
                <tbody>
                  {originalData.map((item, index) => (
                    <tr className="table-body-row" key={index}>
                      <td className="table-cell">{index + 1}</td>
                      <td className="table-cell">{item?.code}</td>
                      <td className="table-cell">{item?.number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ******************************************************************************* */}

            <div className="lab">
              <strong>Null Percentage: </strong>
              {incorrect}%<br></br>
            </div>
            {/* ******************************************************************************* */}
          </div>
          <div className="data-container">
            <div style={{ display: "flex" }}>
              <h4>Filter Table</h4>
            </div>
            <div className="table-wrapper">
              <table className="table1">
                <thead>
                  <tr>
                    <TableHeader>Sr No.</TableHeader>
                    <TableHeader>Station Code</TableHeader>
                    <TableHeader>Dataset Class</TableHeader>
                    <TableHeader>True Class</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr className="table-body-row" key={index}>
                      <td className="table-cell">{index + 1}</td>
                      <td className="table-cell">{item?.stationCode}</td>
                      <td className="table-cell">{item?.pred}</td>
                      <td className="table-cell">{item?.actual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="confusion-matrix-container">
      <RelativeMissclassification data={confusionMatrix}></RelativeMissclassification>
    </div>
    
    </div>
  );
};

export default NonQuantitative;
