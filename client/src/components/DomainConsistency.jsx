import React, { useState, useEffect } from "react";
import { PickList } from "primereact/picklist";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import DownloadIcon from "@mui/icons-material/Download";
// import * as XLSX from "xlsx";
// import * as FileSaver from "file-saver";
// import { Modal, Button, Table, Spinner } from "react-bootstrap";
import { Table } from "react-bootstrap";
import ErrorModal from "./ErrorModal";
import "./Omission.css";

const DomainConsistency = () => {
  const [selectedFilename, setSelectedFilename] = useState("");
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [ranges, setRanges] = useState([]);
  const [rangesNotModify, setRangesNotModify] = useState([]);
  const [dummyLists, setDummyLists] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [domainRate, setDomainRate] = useState(0);
  const [totalrow, setTotalRow] = useState([]);
  const [domain, setDomain] = useState([]);
  const [domainData, setDomainData] = useState({});
  // const [selectedIds, setSelectedIds] = useState([]);
  const [saveData, setSaveData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [downloadedFileName, setDownloadedFileName] = useState("");

  const handleFileChange = async (event) => {
    console.log(event.target.files)
    const selectedFile = event.target.files[0];
    console.log(selectedFile)
    // setFormData({excelFile : selectedFile})
    const formData = new FormData();

    formData.append("excelFile", selectedFile);

    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
  }

    try {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    //  setSelectedFilename(formData)
      const response = await axios.post(
        "http://localhost:3001/api/generaldetails",
        formData
      );
      console.log(response.data);
      if (response.status === 201) {
        setSelectedFilename(response.data);
      }
      setSource([]);
      setTarget([]);
      setRanges([]);
      setRangesNotModify([]);
      setDummyLists([]);
      setSelectedValues([]);
      setRowData([]);
      setDomainRate(0);
      setTotalRow([]);
      setDomain([]);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
      console.log("Error:", error);
    }
  };

  const fetchFieldNames = async () => {
    setSource([]);
    setTarget([]);
    setRanges([]);
    setRangesNotModify([]);
    setDummyLists([]);
    setSelectedValues([]);
    setRowData([]);
    setDomainRate(0);
    setTotalRow([]);
    setDomain([]);
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
        const initialData = new Array(fieldNames.length).fill({
          range: { min: 0, max: 0 },
          selectedValues: {},
          dummyList: [],
        });
        setRanges(initialData);
        setRangesNotModify(initialData);
        setSelectedValues(initialData);
        setDummyLists(initialData);
        setRowData([]);
      } else {
        console.error("No filename selected.");
      }
    } catch (error) {
      console.error("Error fetching field names:", error);
    }
  };

  const onChange = (e) => {
    setSource(e.source);
    setTarget(e.target);
    const initialData = new Array(e.target.length).fill({
      range: { min: 0, max: 0 },
      selectedValues: {},
      dummyList: [],
    });
    setRanges(initialData);
    setRangesNotModify(initialData);
    setSelectedValues(initialData);
    setDummyLists(initialData);
    setRowData([]);
  };

  const handleDropdownChange = async (event, item, index) => {
    const { value: dataType } = event.target;

    try {
      const response = await axios.post(
        "http://localhost:3001/api/domainconsistency/domain-data",
        {
          filename: selectedFilename,
          attribute: item.value,
          datatype: dataType,
        }
      );

      const updatedRanges = [...ranges];
      updatedRanges[index] = {
        ...updatedRanges[index],
        range: {
          dataType,
          min: response.data.min,
          max: response.data.max,
        },
      };
      setRanges(updatedRanges);
      setRangesNotModify(updatedRanges);

      if (dataType === "list") {
        const updatedDummyLists = [...dummyLists];
        updatedDummyLists[index] = response.data;
        setDummyLists(updatedDummyLists);
      } else {
        const updatedSelectedValues = [...selectedValues];
        updatedSelectedValues[index] = { selectedValues: {} };
        setSelectedValues(updatedSelectedValues);

        // Update rowData (column 4) with min/max values
        const updatedRowData = [...rowData];
        updatedRowData[
          index
        ] = `Min: ${response.data.min}, Max: ${response.data.max}`;
        setRowData(updatedRowData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = (event, rowIndex, optionIndex) => {
    const { checked } = event.target;
    const updatedSelectedValues = [...selectedValues];
    const updatedRowData = [...rowData];

    updatedSelectedValues[rowIndex] = {
      ...updatedSelectedValues[rowIndex],
      selectedValues: {
        ...updatedSelectedValues[rowIndex].selectedValues,
        [optionIndex]: checked ? dummyLists[rowIndex][optionIndex] : "",
      },
    };

    const selectedOptions = updatedSelectedValues[rowIndex].selectedValues;
    const selectedValuesArray = Object.values(selectedOptions).filter(Boolean);
    updatedRowData[rowIndex] = selectedValuesArray.join(", ");

    setSelectedValues(updatedSelectedValues);
    setRowData(updatedRowData);
  };

  const handleInputValueChange = (event, rowIndex, valueType) => {
    const { value } = event.target;
    const floatValue = parseFloat(value); // Parse the value as a float

    // Check if the parsed value is a valid float
    if (!isNaN(floatValue)) {
      const updatedRowData = [...rowData];
      const updatedRanges = [...ranges];
      updatedRanges[rowIndex] = {
        ...updatedRanges[rowIndex],
        range: {
          ...updatedRanges[rowIndex].range,
          [valueType]: floatValue, // Assign the parsed float value
        },
      };
      setRanges(updatedRanges);

      updatedRowData[
        rowIndex
      ] = `Min: ${updatedRanges[rowIndex].range.min}, Max: ${updatedRanges[rowIndex].range.max}`;
      setRowData(updatedRowData);
    } else {
      // If the parsed value is NaN, set the corresponding min/max to 0
      const updatedRanges = [...ranges];
      updatedRanges[rowIndex] = {
        ...updatedRanges[rowIndex],
        range: {
          ...updatedRanges[rowIndex].range,
          [valueType]: 0,
        },
      };
      setRanges(updatedRanges);
      // setRangesNotModify(updatedRanges);

      const updatedRowData = [...rowData];
      updatedRowData[rowIndex] = `Min: 0, Max: 0`;
      setRowData(updatedRowData);
    }
  };

  const handleCalculateRate = async () => {
    const rules = target.map((item, index) => {
      const rule = {
        attribute: item.label,
        datatype: ranges[index]?.range?.dataType || "",
      };

      if (rule.datatype === "list") {
        rule.values = [];
        if (selectedValues[index] && selectedValues[index].selectedValues) {
          for (const [optionIndex, selected] of Object.entries(
            selectedValues[index].selectedValues
          )) {
            if (selected) {
              rule.values.push(dummyLists[index]?.[optionIndex] || "");
            }
          }
        }
      } else {
        rule.values = {
          min: ranges[index]?.range?.min || 0,
          max: ranges[index]?.range?.max || 0,
        };
      }

      return rule;
    });

    const rawData = {
      filename: selectedFilename,
      rules: rules,
    };

    console.log(JSON.stringify(rawData, null, 2));

    try {
      const res = await axios.post(
        "http://localhost:3001/api/domainconsistency/domain-auto",
        rawData
      );

      console.log(res.data);
      setDomainRate(res.data.result.domainConsistency);
      setTotalRow(res.data.result.totalChecks);
      setDomain(res.data.result.outDomain);

      console.log({ domain });
      console.log({ domainRate });

      setDomainData({
        ...rawData,
        domain_rate: res.data.result.domainConsistency,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    console.log(domainData);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/domainconsistency/domain-log",
        domainData
      );
      console.log(response.data);
      fetchData();
      setSource([]);
      setTarget([]);
      setRanges([]);
      setRangesNotModify([]);
      setDummyLists([]);
      setSelectedValues([]);
      setRowData([]);
      setDomainRate(0);
      setTotalRow([]);
      setDomain([]);
      setSelectedFilename("");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    const response = await axios.get(
      "http://localhost:3001/api/domainconsistency/domain-log"
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
    } finally {
    }
  };

  // const downloadTableData = () => {
  //   // Create a new workbook
  //   const wb = XLSX.utils.book_new();
  //   // Convert table data to worksheet
  //   const ws = XLSX.utils.json_to_sheet(responseData);
  //   // Add worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, "Data");
  //   // Generate Excel file buffer
  //   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   // Convert buffer to blob
  //   const blob = new Blob([wbout], { type: "application/octet-stream" });
  //   // Save file using FileSaver.js
  //   console.log(downloadedFileName.split(".")[0]);

  //   FileSaver.saveAs(blob, `${downloadedFileName.split(".")[0]}.xlsx`);
  // };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h2>&nbsp;Domain Consistency</h2>
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
          <div className="container">
            <Table striped bordered>
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>Attributes</th>
                  <th style={{ width: "25%" }}>Data type</th>
                  <th style={{ width: "25%" }}>Range in data</th>
                  <th style={{ width: "12.5%" }}>Required range</th>
                  <th style={{ width: "12.5%" }}>Selected range</th>
                  <th style={{ width: "12.5%" }}>
                    Total attributes (not omitted)
                  </th>
                  <th style={{ width: "12.5%" }}>Domain inconsistency</th>
                </tr>
              </thead>
              <tbody>
                {target.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{item.label}</td>
                    <td>
                      <select
                        defaultValue=""
                        onChange={(event) =>
                          handleDropdownChange(event, item, rowIndex)
                        }
                      >
                        <option value="">Select</option>
                        <option value="integer">Integer</option>
                        <option value="decimal">Decimal</option>
                        {/* <option value="boolean">Boolean</option> */}
                        <option value="list">List</option>
                        <option value="string">String</option>
                      </select>
                    </td>
                    <td>
                      {ranges[rowIndex] && ranges[rowIndex].range.dataType && (
                        <>
                          {ranges[rowIndex].range.dataType === "list" ? (
                            dummyLists[rowIndex]?.map((option, optionIndex) => (
                              <div key={optionIndex}>
                                <label
                                  htmlFor={`checkbox-${rowIndex}-${optionIndex}`}
                                  style={{ marginLeft: "5px" }}
                                >
                                  {option}
                                </label>
                              </div>
                            ))
                          ) : (
                            <>
                              <span>
                                Min : {rangesNotModify[rowIndex].range.min}
                              </span>
                              &nbsp;&nbsp;&nbsp;
                              <span>
                                Max : {rangesNotModify[rowIndex].range.max}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "column",
                        minHeight: "10vh",
                        gap: "8px",
                      }}
                    >
                      {ranges[rowIndex] && ranges[rowIndex].range.dataType && (
                        <>
                          {ranges[rowIndex].range.dataType === "list" ? (
                            dummyLists[rowIndex]?.map((option, optionIndex) => (
                              <div key={optionIndex}>
                                <input
                                  type="checkbox"
                                  id={`checkbox-${rowIndex}-${optionIndex}`}
                                  name={`checkbox-${rowIndex}-${optionIndex}`}
                                  value={option}
                                  checked={
                                    selectedValues[rowIndex]?.selectedValues[
                                      optionIndex
                                    ] || false
                                  }
                                  onChange={(event) =>
                                    handleCheckboxChange(
                                      event,
                                      rowIndex,
                                      optionIndex
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`checkbox-${rowIndex}-${optionIndex}`}
                                  style={{ marginLeft: "5px" }}
                                >
                                  {option}
                                </label>
                              </div>
                            ))
                          ) : (
                            <>
                              <span>
                                Min :{" "}
                                <input
                                  type="number" // Change the input type to number
                                  step="any" // Allow any decimal value
                                  style={{ width: "5rem" }}
                                  placeholder="Min value"
                                  value={ranges[rowIndex].range.min}
                                  onChange={(event) =>
                                    handleInputValueChange(
                                      event,
                                      rowIndex,
                                      "min"
                                    )
                                  }
                                />
                              </span>
                              <span>
                                Max :{" "}
                                <input
                                  type="number" // Change the input type to number
                                  step="any" // Allow any decimal value
                                  style={{ width: "5rem" }}
                                  placeholder="Max value"
                                  value={ranges[rowIndex].range.max}
                                  onChange={(event) =>
                                    handleInputValueChange(
                                      event,
                                      rowIndex,
                                      "max"
                                    )
                                  }
                                />
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </td>

                    <td>{rowData[rowIndex]}</td>
                    <td>
                      {totalrow.map((obj, index) => {
                        const matchingItem = Object.entries(obj).find(
                          ([key, value]) => key === item.label
                        );
                        return matchingItem ? matchingItem[1] : null;
                      })}
                    </td>
                    <td>
                      {domain.map((obj, index) => {
                        const matchingItem = Object.entries(obj).find(
                          ([key, value]) => key === item.label
                        );
                        return matchingItem ? matchingItem[1] : null;
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleCalculateRate}>
              Calculate domain error rate
            </button>
            <h4>Domain error rate: {domainRate}%</h4>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
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
          {/* <Column
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
              ></Column> */}
          <Column
            field="filename"
            header="Name of File"
            style={{ width: "25%" }}
          ></Column>

          <Column
            field="tested_date"
            header="Tested Date"
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="tested_result"
            header="Test Result (%)"
            style={{ width: "15%" }}
          ></Column>
          <Column
            field="action"
            header="View File"
            style={{ width: "10%"}}
            body={(rowData) => (
              <div className="btnCon">
                <VisibilityIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => viewData(rowData.filename)}
                />
              </div>
            )}
          />
        </DataTable>
        </div>
        </div>
      </div>

      <ErrorModal
        show={showModal}
        onHide={() => setShowModal(false)}
        fullscreen={true}
        data={responseData}
        filename={downloadedFileName}
      />
    </>
  );
};

export default DomainConsistency;
