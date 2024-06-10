import axios from "axios";
import React, { useState } from "react";
import CardDash from "./CardDash";
import "./GeneralDetails.css";

const GeneralDetails = () => {
  const [fileName, setFileName] = useState("");
  const [omissionRate, setOmissionRate] = useState(0);
  const [fileFormatAccepted, setFileFormatAccepted] = useState(false);
  const [defaultText, setDefaultText] = useState(false);
  const [errormessage, setErormessage] = useState(
    "Format accepted successfully !"
  );
  let childData;

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setDefaultText(true);

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/generaldetails",
        formData
      );

      if (response.status === 201) {
        console.log(response);
        setFileName(fileName);
        const arr = await fetchFieldNames(response.data);
        console.log(arr);
        const ans = await sendFieldNames(response.data, arr);
        console.log(ans);
        setOmissionRate(ans);
        setFileFormatAccepted(true);
        setErormessage("Format accepted successfully !");
      }
    } catch (error) {
      setFileFormatAccepted(false);
      if (error.response && error.response.status === 400) {
        setErormessage(error.response.data.message);
      }
      console.log("Error:", error);
    }
  };

  const fetchFieldNames = async (fname) => {
    try {
      if (fname) {
        const response = await axios.post(
          "http://localhost:3001/api/fieldnames",
          { filename: fname }
        );
        console.log(response);
        return response.data.field_names;
      } else {
        console.error("No filename selected.");
      }
    } catch (error) {
      console.error("Error fetching field names:", error);
    }
  };

  const sendFieldNames = async (fname, arr) => {
    try {
      if (fname) {
        const response = await axios.post(
          "http://localhost:3001/api/omission/omission-auto",
          {
            filename: fname,
            attributes: arr,
          }
        );
        return response.data.omissionRate;
      } else {
        console.log("Please Select a file.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <center>
          <div
            className="mt-3"
            style={{
              display: "flex",
              width: "fit-content",
              marginBottom: "1rem",
            }}
          >
            <input
              className="form-control uploadBtnInput"
              id="formFile"
              style={{ height: "2.5%" }}
              onChange={handleFileChange}
              onClick={() => {
                setOmissionRate(0);
                setFileFormatAccepted();
              }}
              type="file"
            />
          </div>
        </center>
      </div>
      <CardDash
        omissionRate={omissionRate}
        fileName={childData}
        fileFormatAccepted={fileFormatAccepted}
        defaultText={defaultText}
        errormessage={errormessage}
      />
    </>
  );
};

export default GeneralDetails;
