import React, { useState, useEffect } from "react";
import { PickList } from "primereact/picklist";
import axios from "axios";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import DropDown from "./DropDown";

const TableWrapper = styled.div`
  max-height: 450px;
  overflow-y: auto;
  width: 50%;
  border: 1px solid #000;
  border-radius: 10px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DataContainer = styled.div`
  margin: 20px;
  width: 50%;
  max-width: 800px;
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

const Lab = styled.div`
  background-color: lightgreen;
  color: black;
  padding: 15px;
  font-size: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  margin-top: 20px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Table = styled.table`
  width: 50%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const TemporalConsistency = () => {
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState("");
  const [data, setData] = useState({
    validCount: 0,
    ambiguousCount: 0,
    invalidCount: 0,
    validPercentage: 0,
    ambiguousPercentage: 0,
    invalidPercentage: 0,
    filterDates: [],
  });

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
        "http://localhost:3001/api/temporalquality/tempoconist",
        {
          filename: selectedFilename,
          attributes: target,
        }
      );
      console.log(response.data);
      const {
        validCount,
        ambiguousCount,
        invalidCount,
        totalDates,
        filterDates,
      } = response.data.result;

      const validPercentage = ((validCount / totalDates) * 100).toFixed(2);
      const ambiguousPercentage = ((ambiguousCount / totalDates) * 100).toFixed(
        2
      );
      const invalidPercentage = ((invalidCount / totalDates) * 100).toFixed(2);

      setData({
        validCount,
        ambiguousCount,
        invalidCount,
        validPercentage,
        ambiguousPercentage,
        invalidPercentage,
        filterDates,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onChange = (e) => {
    const { source, target } = e;

    // Check if exactly one item is selected in the target list
    if (target.length === 1) {
      setTarget(target);
    } else {
      // If not exactly one item is selected, keep only the last selected item
      setTarget(target.length > 1 ? [target[target.length - 1]] : []);
    }
  };

  const filterDates = (condition, date1, date2) => {
    const parsedDate1 = new Date(date1);
    const parsedDate2 = date2 ? new Date(date2) : null;

    let filteredDates = [];

    switch (condition) {
      case 'greater_than':
        filteredDates = data.filterDates.filter(
          (date) => new Date(date) > parsedDate1
        );
        break;
      case 'lesser_than':
        filteredDates = data.filterDates.filter(
          (date) => new Date(date) < parsedDate1
        );
        break;
      case 'between_include':
        filteredDates = data.filterDates.filter(
          (date) => new Date(date) >= parsedDate1 && new Date(date) <= parsedDate2
        );
        break;
      case 'between_exclude':
        filteredDates = data.filterDates.filter(
          (date) => new Date(date) > parsedDate1 && new Date(date) < parsedDate2
        );
        break;
      case 'and':
      case 'or':
      case 'xor':
        // Add your custom logic for 'and', 'or', 'xor' if needed
        break;
      default:
        filteredDates = data.filterDates;
    }

    setData((prevData) => ({
      ...prevData,
      filterDates: filteredDates,
    }));
  };

  return (
    <MainContainer>
      <h3 style={{ marginTop: "10px", marginBottom: "10px" }}>
        Temporal Validity
      </h3>

      <input
        style={{
          height: "50px",
          width: "300px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "8px",
          fontSize: "16px",
        }}
        onChange={handleFileChange}
        type="file"
        name="excelFile"
      />
      <br />
      <br />
      <Button onClick={fetchFieldNames}>Read Dataset</Button>

      <DataContainer>
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
      </DataContainer>

      <Button onClick={fetchStationCode} style={{ marginBottom: "90px" }}>
        Start Test
      </Button>
      <Button onClick={fetchStationCode} variant="danger" style={{width:"200px" ,marginLeft:"550px"}} >
      Reset
    </Button>
      {data?.filterDates.length !== 0 && (
        <TableWrapper>
          <center>
            <Lab>
              <strong>ambiguousPercentage :</strong> {data.ambiguousPercentage}%
              <br />
              <strong>invalid percentage :</strong> {data.invalidPercentage}%
            </Lab>
          </center>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "24px",
            }}
          >
            Filtered Dates
          </h2>
          <center>
            <Table>
              <thead style={{ backgroundColor: "#f2f2f2" }}>
                <tr>
                  <TableHeader>Index</TableHeader>
                  <TableHeader>Date(YYYY-MM-DD)</TableHeader>
                </tr>
              </thead>
              <tbody>
                {data.filterDates.map((date, index) => (
                  <TableBodyRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{date}</TableCell>
                  </TableBodyRow>
                ))}
              </tbody>
            </Table>
          </center>
        </TableWrapper>
      )}
      <DropDown onFilter={filterDates} />
    </MainContainer>
  );
};

export default TemporalConsistency;
