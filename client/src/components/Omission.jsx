import React, { useState, useEffect } from "react";
import { PickList } from "primereact/picklist";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import DownloadIcon from "@mui/icons-material/Download";
import "./Omission.css";
import { Modal, Button, Table, Spinner } from "react-bootstrap";

import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const Omission = () => {
  const omissionData = {
    file_name: "",
    field_names: "",
    omission_rate: "",
  };

  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState("");
  const [omissionRate, setOmissionRate] = useState(0);
  const [saveData, setSaveData] = useState([]);
  const [omission, setOmission] = useState(omissionData);
  const [showModal, setShowModal] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [downloadedFileName, setDownloadedFileName] = useState("");
  const [fetchingFieldNames, setFetchingFieldNames] = useState(false);
  const [sendingFieldNames, setSendingFieldNames] = useState(false);
  const [savingData, setSavingData] = useState(false);
  const [deletingLogs, setDeletingLogs] = useState(false);
  // const [downloadingData, setDownloadingData] = useState(false);

  let sendField = [];

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
    setOmissionRate(0);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();

    formData.append("excelFile", selectedFile);

    try {
      setFetchingFieldNames(true);
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
    } finally {
      setFetchingFieldNames(false);
    }
  };

  const fetchFieldNames = async () => {
    try {
      setFetchingFieldNames(true);
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
    } finally {
      setFetchingFieldNames(false);
    }
  };

  const sendFieldNames = async () => {
    try {
      setSendingFieldNames(true);
      if (selectedFilename) {
        target.forEach((e) => {
          sendField.push(e.value);
        });
        const response = await axios.post(
          "http://localhost:3001/api/omission/omission-auto",
          {
            filename: selectedFilename,
            attributes: sendField,
          }
        );

        console.log(response.data);
        setOmissionRate(response.data.omissionRate);

        const targetArr = [];
        target.forEach((e) => {
          targetArr.push(e.value);
        });

        setOmission((prevOmission) => ({
          ...prevOmission,
          field_names: targetArr,
          file_name: selectedFilename,
          omission_rate: response.data.omissionRate,
        }));

        // handleChange();
      } else {
        console.log("Please Select a file.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSendingFieldNames(false);
    }
    sendField = [];
  };

  const handleSave = async () => {
    try {
      setSavingData(true);
      console.log(omission);
      const response = await axios.post(
        "http://localhost:3001/api/omission/omission-log/",
        omission
      );
      console.log(response.data);
      fetchData();
      setTarget([]);
      setSource([]);
    } catch (err) {
      console.log(err);
    } finally {
      setSavingData(false);
    }
  };

  const fetchData = async () => {
    const response = await axios.get(
      "http://localhost:3001/api/omission/omission-log/"
    );
    console.log(response.data);
    setSaveData(response.data.reverse());
  };

  const viewData = async (filename) => {
    try {
      // setDownloadingData(true);
      const response = await axios.get(
        `http://localhost:3001/api/view/${filename}`
      );
      setResponseData(response.data.file_data);
      console.log(response.data.file_data);
      setDownloadedFileName(filename);
      setShowModal(true); // Show modal after receiving the response
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      // setDownloadingData(false);
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
    console.log(downloadedFileName.split(".")[0]);

    FileSaver.saveAs(blob, `${downloadedFileName.split(".")[0]}.xlsx`);
  };

  const deleteLog = async () => {
    console.log(selectedIds);
    try {
      setDeletingLogs(true);
      const response = await axios.delete(
        "http://localhost:3001/api/omission/omission-log-DeleteAll",
        { data: selectedIds }
      );
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error("Error deleting logs:", error);
    } finally {
      setDeletingLogs(false);
    }
  };

  return (
    <>
      <div>
        <h2>&nbsp;Omission</h2>
        <center>
          <input
            className="form-control uploadBtnInput"
            id="formFile"
            style={{ height: "2.5%", width: "355px" }}
            onChange={handleFileChange}
            onClick={() => {
              setOmissionRate(0);
            }}
            type="file"
          />
          <br />
          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchFieldNames}
            disabled={fetchingFieldNames}
          >
            {fetchingFieldNames ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Start Test"
            )}
          </button>
        </center>
        <div className="alert alert-primary text-center container">
          Formula for calculating omissions: (Count of Omitted Features / (Total
          number of features * Total number of records)) * 100
        </div>
        <br />

        <center>
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

          <button
            className="btn btn-primary mt-3"
            onClick={sendFieldNames}
            disabled={target.length === 0 || sendingFieldNames}
          >
            {sendingFieldNames ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Calculate ommission Rate"
            )}
          </button>
          <h4>Ommission Rate: {omissionRate.toFixed(2)}%</h4>

          <button
            className="btn btn-primary mb-2"
            onClick={handleSave}
            disabled={target.length === 0 || savingData}
          >
            {savingData ? <Spinner animation="border" size="sm" /> : "Save"}
          </button>
        </center>
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
                      checked={selectedIds.includes(rowData.omission_log_id)}
                      onChange={(e) => {
                        const { checked } = e.target;
                        if (checked) {
                          setSelectedIds((prevIds) => [
                            ...prevIds,
                            rowData.omission_log_id,
                          ]);
                        } else {
                          setSelectedIds((prevIds) =>
                            prevIds.filter(
                              (id) => id !== rowData.omission_log_id
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
                field="omission_rate"
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
            {/* <button>Save</button> */}
            <button
              className="btn btn-primary dltButton"
              style={{ width: "5rem" }}
              onClick={deleteLog}
              disabled={deletingLogs}
            >
              {deletingLogs ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Delete"
              )}
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
          <Button variant="primary" onClick={downloadTableData}>
            Download Excel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Omission;
