import React, { useState } from "react";
import Dropdown from "./Dropdown";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./Omission.css";
import axios from "axios";

const Omission = () => {
  const [childData, setChildData] = useState();
  const [tableData, setTableData] = useState([]);
  const [overallOmission, setOverallOmission] = useState(0);
  const [hello, setHello] = useState(true);
  let arr = [];

  const handleChildData = (data) => {
    setChildData(data);
    console.log(childData);
  };

  const startTest = async () => {
    try {
      if (childData) {
        const response = await axios.post(
          "http://localhost:3001/api/omission/omission-auto",
          {
            filename: childData,
          }
        );
        console.log(Object.entries(response.data));
        setTableData(Object.entries(response.data));

        
      } else {
        console.log("Please Select a file.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Tabs
      defaultActiveKey="Auto Test"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="Auto Test" title="Auto Test">
        <Dropdown onChildData={handleChildData} />
        <br />
        <button className="btn btn-primary" type="button" onClick={startTest}>
          Start Test
        </button>
        <div className="alert alert-primary text-center container">
          Formula for calculating omissions: (Count of Omitted Features / (Total number of features * Total number of records)) * 100
        </div>
        <div>
          <table className="table table-striped container  ">
            <thead>
              <tr key={1}>
                <th scope="col" style={{ width: "50px" }}>
                  No.
                </th>
                <th scope="col" style={{ width: "80px" }}>
                  Dataset identification details
                </th>
                <th scope="col" style={{ width: "120px" }}>
                  omitted feature details
                </th>
                <th scope="col" style={{ width: "80px" }}>
                  Total Records
                </th>
                <th scope="col" style={{ width: "100px" }}>
                  count of omitted feature
                </th>
                <th scope="col" style={{ width: "50px" }}>
                  omission rate
                </th>
                <th scope="col" style={{ width: "80px" }}>
                  Remarks
                </th>
                
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => {
                if (row[0] === "totalNumOfRecords") return null;

                // Find the object in the array with the totalNumOfRecords property
                const totalRecordsObject = tableData.find(
                  (item) => item[0] === "totalNumOfRecords"
                );

                const i = ((row[1] / (totalRecordsObject[1] * 5)) * 100);
                arr.push(i);
                console.log(arr);

                const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const average = sum / arr.length;

                // console.log(average);

                if(hello){
                  setOverallOmission(average);
                  setHello(false);
                }

                console.log(overallOmission);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{childData}</td>
                    <td>{row[0]}</td>
                    <td>{totalRecordsObject ? totalRecordsObject[1] : null}</td>
                    <td>{row[1]}</td>
                    <td>
                      {i.toFixed(2)}%
                    </td>
                    <td>-</td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br />
          <h4 className="container text-center">Overall omission rate: {overallOmission.toFixed(2)}%</h4>
        </div>
      </Tab>
      <Tab eventKey="Manual Test" title="Manual Test">
        Tab content for Manual Test
      </Tab>
    </Tabs>
  );
};

export default Omission;
