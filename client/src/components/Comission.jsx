import React, { useState, useEffect } from "react";
import { PickList } from "primereact/picklist";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { Modal, Button, Table } from "react-bootstrap";

import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const Comission = () => {
  const comissionData = {
    file_name: "",
    field_names: "",
    comission_rate: "",
  };

  let childData;
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState("");
  const [total, setTotal] = useState(0);
  const [comissionRate, setComissionRate] = useState(0);
  const [saveData, setSaveData] = useState([]);
  const [comission, setComission] = useState(comissionData);
  const [showModal, setShowModal] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [downloadedFileName, setDownloadedFileName] = useState("");

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
      // alert("Format consistency requirement not matched!");
    }
  };

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
    setComissionRate(0);
  };



  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFieldNames = async () => {
    try {
      if (selectedFilename) {
        const response = await axios.post(
          "http://localhost:3001/api/fieldnames",
          { filename: selectedFilename }
        );
        setSource(
          response.data.field_names.map((fieldName) => ({
            label: fieldName,
            value: fieldName,
          }))
        );
        setTotal(response.data.field_names.length);
        console.log(response.data);
      } else {
        console.error("No filename selected.");
      }
    } catch (error) {
      console.error("Error fetching field names:", error);
    }
  };
  useEffect(() => {
    if (childData) {
      console.log("Child data updated:", childData);
      fetchFieldNames();
    }
  }, [childData, fetchFieldNames]);
  const sendFieldNames = () => {
    if (target.length > 0) {
      const comissionRate = ((total - target.length) / total) * 100;
      setComissionRate(comissionRate);
      console.log(comissionRate);

      const targetArr = [];
      target.forEach((e) => {
        targetArr.push(e.value);
      });

      setComission((prevComission) => ({
        ...prevComission,
        field_names: targetArr,
        file_name: selectedFilename,
        comission_rate: comissionRate.toFixed(2),
      }));
    }
  };

  const handleSave = async () => {
    try {
      console.log(comission);
      const response = await axios.post(
        "http://localhost:3001/api/comission/comission-log/",
        comission
      );
      console.log(response.data);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    const response = await axios.get(
      "http://localhost:3001/api/comission/comission-log/"
    );
    console.log(response.data);
    setSaveData(response.data.reverse());
  };

  const viewData = async (filename) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/view/${filename}`
      );
      setResponseData(response.data.file_data);
      console.log(response.data.file_data);
      setDownloadedFileName(filename);
      setShowModal(true); // Show modal after receiving the response
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadTableData = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Convert table data to worksheet
    const ws = XLSX.utils.json_to_sheet(responseData);
    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    // Generate Excel file buffer
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    // Convert buffer to blob
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    // Save file using FileSaver.js

    FileSaver.saveAs(blob, `${downloadedFileName.split(".")[0]}.xlsx`);
  };

  const deleteLog = async () => {
    console.log(selectedIds);
    try {
      const response = await axios.delete(
        "http://localhost:3001/api/comission/comission-log-DeleteAll",
        { data: selectedIds }
      );
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error("Error deleting logs:", error);
    }
  };

  return (
    <>
      <h2>&nbsp;Comission</h2>
      <center>
        <input
          className="form-control uploadBtnInput"
          id="formFile"
          style={{ height: "2.5%", width: "355px" }}
          onChange={handleFileChange}
          onClick={() => {
            setComissionRate(0);
          }}
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
      <div className="alert alert-primary text-center container">
        Formula for calculating Comissions: (Total Available Attribute Headings
        - Data Product Specification / Total Available Attribute Headings ) *
        100
      </div>
      <div>
        <center>
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

          <button
            className="btn btn-primary mt-3"
            onClick={sendFieldNames}
            disabled={target.length === 0}
          >
            Calculate Commission Rate
          </button>
          <h4>Commission Rate: {comissionRate.toFixed(2)}%</h4>
          <button
            className="btn btn-primary "
            // onClick={() => saveComissionData(comissionRate)}
            onClick={handleSave}
            disabled={target.length === 0}
          >
            Save
          </button>
        </center>
        <br />
        <div
          style={{ display: "flex", justifyContent: "center", height: "100%" }}
        >
          <div className="card" style={{ width: "85%" }}>
            <DataTable
              value={saveData}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "5rem" }}
            >
            
              <Column
                field=""
                style={{ width: "5%" }}
                body={(rowData) => (
                  <>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rowData.comission_log)}
                      onChange={(e) => {
                        const { checked } = e.target;
                        if (checked) {
                          setSelectedIds((prevIds) => [
                            ...prevIds,
                            rowData.comission_log,
                          ]);
                        } else {
                          setSelectedIds((prevIds) =>
                            prevIds.filter(
                              (id) => id !== rowData.comission_log
                            )
                          );
                        }
                      }}
                    />
                  </>
                )}
              ></Column>
              <Column
                field="file_name"
                header="Name of File"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="field_names"
                header="Field Names"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="checked_on"
                header="Tested Date"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="comission_rate"
                header="Test Result (%)"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="action"
                header="View/Download"
                body={(rowData) => (
                  <div className="btnCon">
                    <VisibilityIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => viewData(rowData.file_name)}
                    />
                  </div>
                )}
              />
            </DataTable>
            <button className="btn btn-primary dltButton" style={{ width: "5rem" }} onClick={deleteLog}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        fullscreen={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>View Data</Modal.Title>

          <div style={{ position: "absolute", right: "2.5rem", top: "20px" }}>
            <DownloadIcon
              onClick={downloadTableData}
              style={{ cursor: "pointer" }}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          {/* Table to display response data */}
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* <th>Leaf Color</th>
                <th>Soil Type</th> */}
                {responseData.length > 0 &&
                  Object.keys(responseData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {responseData.map((item, index) => (
                <tr key={index}>
                  {Object.keys(responseData[0]).map((key, i) => (
                    <td key={i}>{item[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Comission;
