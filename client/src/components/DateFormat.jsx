import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX library
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { Modal, Button } from 'react-bootstrap';
import { Modal, Button, Table } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";

const YourComponent = () => {
  const [jsonData, setJsonData] = useState([]);
  const [jData, setJData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append("excelFile", selectedFile);
    formData.append("fileName", selectedFile.name); // Add file name to form data
    try {
      const response = await axios.post(
        "http://localhost:3001/api/generaldetails/dateformat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setJsonData(response.data.data);
      setAccuracy(response.data.accuracy);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/generaldetails/getdata"
        );
        setJData(response.data);
        // Process the response here
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "data");
    XLSX.writeFile(wb, "data.xlsx");
  };

  const handleeyedata = async (c) => {
    const data={
      file_name:c
    }
    // console.log(c);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/generaldetails/getfiledata", 
        data
      );
      setResponseData(response.data);
      console.log(response.data);
      // Process the response here
    } catch (error) {
      console.error("Error:", error);
    }
  }
useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/generaldetails/getdata"
        );
        setJData(response.data);
        // Process the response here
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
  const viewData = (c) => {
    handleeyedata(c);
    setShowModal(true);
  };

  return (
    <>
      <div style={{ padding: "40px" }}>
        <input
          className="form-control uploadBtnInput"
          id="formFile"
          style={{ height: "2.5%", width: "355px" }}
          onChange={handleFileChange}
          type="file"
          name="excelFile"
        />
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">JSON Data</h2>
          <p>Accuracy: {accuracy.toFixed(2)}%</p>
          {jsonData.length !== 0 && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              style={{ backgroundColor: "blue" }}
              onClick={downloadExcel}
            >
              Download Excel
            </button>
          )}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  {jsonData?.length > 0 &&
                    Object.keys(jsonData[0])?.map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2 bg-gray-200 border border-gray-400"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {jsonData?.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2 border border-gray-400">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* {jData} */}
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <div className="card" style={{ width: "85%" }}>
          <DataTable
            value={jData}
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
                  {/* <input
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
                    /> */}
                </>
              )}
            ></Column>
            <Column
              field="file_name"
              header="file_name"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="created_date"
              header="created_date"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="accuracy"
              header="Accuracy"
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
          {/* <button className="btn btn-primary dltButton" style={{width:"5rem"}} onClick={deleteLog} disabled={deletingLogs}>
              {deletingLogs ? <Spinner animation="border" size="sm" /> : "Delete"}
            </button> */}
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
              <Button variant="primary" onClick={downloadExcel}>
                Download Excel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default YourComponent;