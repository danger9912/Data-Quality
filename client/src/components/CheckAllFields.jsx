// import React from 'react'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { PickList } from "primereact/picklist";
import styled from 'styled-components';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

const SectionContainer = styled.div`
  // width: 19%;
  margin-right:15px;
`;

const DataContainer = styled.div`
  position: relative;
  margin-left:100px;
  margin-right:15px;
  margin-bottom:50px;
// :400px;

`;

const Dropdown = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  width:150px;
  margin-bottom:10px
`;

const Option = styled.option`
  padding: 10px;
  font-size: 16px;
 
  border-radius: 8px;
`;

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

const ErrorLabel = styled.div`
  background-color: #ff4d4d;
  color: white;
  padding: 10px;
  font-size: 15px;
  border-radius: 8px;
`;
const Lab = styled.div`
  background-color: red;
  color: black;
  padding: 10px;
  font-size: 15px;
  border-radius: 8px;
  margin-bottom:10px;
  margin-top:10px;
`;
const CheckAllFields = () => {
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [incorrect, setincorrect] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [Ref, setRef] = useState(false);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [data2, setData2] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dropdownValues, setDropdownValues] = useState([]);

  const handleReverseGeocoding = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
      const result = await response.json();

      if (result) {
        const { place_id, class: place_class, type, place_rank, addressType, railway, road, village, state, state_district, county, postcode, country, country_code } = result;

        const values = [
          { label: 'Place ID', value: place_id },
          { label: 'Class', value: place_class },
          { label: 'Type', value: type },
          { label: 'Place Rank', value: place_rank },
          { label: 'Address Type', value: addressType },
          { label: 'Railway Name', value: railway },
          { label: 'Road', value: road },
          { label: 'Village', value: village },
          { label: 'State', value: state },
          { label: 'District', value: state_district || county },
          { label: 'Postcode', value: postcode },
          { label: 'Country', value: country },
          { label: 'Country Code', value: country_code }
        ];

        setDropdownValues(values.filter(item => item.value)); // Filter out empty values
        console.log(result)
        setData2(result.address);
        setError('');
      } else {
        setError('Location not found.');
      }
    } catch (err) {
      setError('Error occurred while fetching location details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
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
      console.error("Error:", error);
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
  const attributeSelected = () => {
    fetchStationCode();
  }
  const fetchStationCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/state/check',
        {
          filename: selectedFilename,
          attributes: target,
        }
      )
      console.log(response.data)
      setData(response.data.data);


      setincorrect(parseFloat(((response.data.errorcount) / (response.data.validCount + (response.data.errorcount))) * 100).toFixed(3));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const onChange = (e) => {
    const { source, target } = e;
    if (target.length === 1) {
      setTarget(target);
    } else {
      setTarget(target.length > 1 ? [target[target.length - 1]] : []);
    }
  };

  return (
    <>
 
    <center>
        <input
          style={{
            height: "40px",
            width: "250px",
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

        <Button onClick={attributeSelected} style={{ marginBottom: "50px" }}>start Test</Button>
      </center>
      <div className="app">
      <header>
        <h1>Geolocation Finder</h1>
      </header>
      <main>
        <div className="coordinate-input">
          <h2>Enter Coordinates</h2>
          <input
            type="text"
            placeholder="Enter latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter longitude"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
          <button onClick={handleReverseGeocoding}>Find Location</button>
        </div>
        {loading && <div className="loader">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {data2 && (
          <div className="results">
            <h2>Location Information</h2>
            <p><strong>Country:</strong> {data2.country}</p>
            <p><strong>State:</strong> {data2.state}</p>
            {data2.state_district && <p><strong>State District:</strong> {data2.state_district}</p>}
            {data2.county && <p><strong>County:</strong> {data2.county}</p>}
            {data2.city && <p><strong>City:</strong> {data2.city}</p>}
            {data2.town && <p><strong>Town:</strong> {data2.town}</p>}
            {data2.village && <p><strong>Village:</strong> {data2.village}</p>}

            <div className="dropdowns">
              <label>
                Select Information:
                <select>
                  <option value="">Select</option>
                  {dropdownValues.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}: {item.value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}
      </main>
    </div>
      </>
  )
}

export default CheckAllFields