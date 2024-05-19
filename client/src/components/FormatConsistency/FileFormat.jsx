import React, { useState } from "react";
import { PickList } from "primereact/picklist";
import Table from 'react-bootstrap/Table';
import axios from "axios";


const FormatConsistency = () => {
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState("");
  const [fieldData, setFieldData] = useState([]);
  const [foreignKeyData, setForeignKeyData] = useState([]);
  const [primaryKey, setPrimaryKey] = useState();
  let sendField = [];
  let fileNames = [];

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axios.post("http://localhost:3001/api/generaldetails", formData);
      if (response.status === 201) {
        setSelectedFilename(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
      console.log("Error:", error);
    }
  };

  const fetchFieldNames = async () => {
    try {
      if (selectedFilename) {
        const response = await axios.post("http://localhost:3001/api/fieldnames", { filename: selectedFilename });
        setSource(response.data.field_names.map((fieldName) => ({ label: fieldName, value: fieldName })));
      } else {
        console.error("No filename selected.");
      }
    } catch (error) {
      console.error("Error fetching field names:", error);
    }
  };

  const sendFieldNames = async () => {
    try {
      if (selectedFilename) {
        target.forEach((e) => sendField.push(e.value));
        const response = await axios.post("http://localhost:3001/api/format/checkPK-format", {
          filename: selectedFilename,
          attributes: sendField,
        });
        setFieldData(response.data);
        const filteredKeys = Object.keys(response.data).filter(key => response.data[key] === true);
        setPrimaryKey(filteredKeys);
      } else {
        console.log("Please Select a file.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
  };

  const multiplehandleFileChange = async (event) => {
    const selectedFiles = event.target.files;
    for (let index = 0; index < selectedFiles.length; index++) {
      const formData = new FormData();
      formData.append("excelFile", selectedFiles[index]);
      try {
        const response = await axios.post("http://localhost:3001/api/generaldetails", formData);
        if (response.status === 201) {
          fileNames.push(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        }
        console.log("Error:", error);
      }
    }
  };

  const fetchForeignKeyValues = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/format/checkFK-format", {
        filename: selectedFilename,
        primary_key: primaryKey,
        files: fileNames
      });
      setForeignKeyData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
<>


        <h2 style={{marginLeft:"40px",marginTop:"40px"}}>File format Consistency</h2>
        <center>
          <h2 style={{marginTop:"10px"}}>Primary Key Constraint</h2>
          <input className="form-control uploadBtnInput" id="formFile" style={{ height: "2.5%", width: "355px",marginTop:"10px" }} onChange={handleFileChange} type="file" />
          <button type="button" className="btn btn-primary" onClick={fetchFieldNames} style={{marginTop:"10px"}}>Start Test</button>
          <div style={{ marginTop: "1%", width: "70%" }}>
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
          <button className="btn btn-primary mt-3" onClick={sendFieldNames} disabled={target.length === 0}>Check Validity</button>
        </center>
        <div className="container">
          <Table striped bordered hover style={{ width: "50rem" }}>
            <thead style={{ textAlign: "center" }}>
              <tr>
                <th>File Name</th>
                <th>Primary Key Validity</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              {Object.keys(fieldData).map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{fieldData[key].toString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <center>
          <h2>Foreign Key Constraint</h2>
          <input className="form-control uploadBtnInput" id="formFile" style={{ height: "2.5%", width: "355px",marginTop:"10px" }} onChange={multiplehandleFileChange} type="file" multiple />
          <button type="button" className="btn btn-primary" style={{marginTop:"10px"}} onClick={fetchForeignKeyValues}>Check Validity</button>
        </center>
        <div className="container">
          <Table striped bordered hover style={{ width: "50rem" }}>
            <thead style={{ textAlign: "center" }}>
              <tr>
                <th>File Name</th>
                <th>Foreign Key Validity</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              {foreignKeyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.filename.split('.')[0]}</td>
                  <td>{item.value.toString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
     </>
  );
};

export default FormatConsistency;
