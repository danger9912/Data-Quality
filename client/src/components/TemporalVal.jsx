import React, { useState } from "react";
import { PickList } from "primereact/picklist";
import axios from "axios";

const TemporalVal = () => {
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState(""); 
  let sendField = [];

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();

    formData.append("excelFile", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/generaldetails",
        formData
      );
      console.log(response.data);
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
        console.log(selectedFilename);
        const response = await axios.post(
          "http://localhost:3001/api/fieldnames",
          { filename: selectedFilename }
        );
        console.log(response.data.field_names);
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

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
  };

  

  const sendFieldNames = async () => {
    try {
      
      if (selectedFilename) {
        target.forEach((e) => {
          sendField.push(e.value);
        });
        const response = await axios.post(
          "http://localhost:3001/api/temporalquality/temporal-val",
          {
            filename: selectedFilename,
            attributes: sendField,
          }
        );

        console.log(response.data);
         
          

        const targetArr = [];
        target.forEach((e) => {
          targetArr.push(e.value);
        });

      } else {
        console.log("Please Select a file.");
      }
    } catch (err) {
      console.log(err);
    } 
    sendField = [];
  };


  return (
    <>
      <br />
      <center>
        <input
          className="form-control uploadBtnInput"
          id="formFile"
          style={{ height: "2.5%", width: "355px" }}
          onChange={handleFileChange}
          type="file"
        />
        <br />
        <button
          type="button"
          className="btn btn-primary"
          onClick={fetchFieldNames}
        >
          Start Test
        </button>
      </center>
      <center>
        <div style={{ marginTop: "2%", width: "70%" }}>
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
        <button
          className="btn btn-primary mt-3"
          onClick={sendFieldNames}
          disabled={target.length === 0}
        >
          Check
        </button>
        <h1> Date </h1>
      </center>
    </>
  );
};

export default TemporalVal;
