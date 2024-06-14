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
import RelativeMissclassification from '../MisClassificationMatrix';

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

const UserDefined = () => {
    const [source, setSource] = useState([]);
    const [source2, setSource2] = useState([]);
    const [target, setTarget] = useState([]);
    const [target2, setTarget2] = useState([]);
    const [selectedFilename, setSelectedFilename] = useState("");
    const [selectedFilename2, setSelectedFilename2] = useState("");
    const [data, setData] = useState([] );
    const [incorrect, setincorrect] = useState("");
    const [conf , setConf] =useState([])

    const [Ref, setRef] = useState(false);
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
    const handleFileChange2 = async (event) => {
        const selectedFile = event.target.files[0];
        const formData = new FormData();
        formData.append("excelFile", selectedFile);

        try {
            const response = await axios.post("http://localhost:3001/api/generaldetails", formData);
            if (response.status === 201) {
                setSelectedFilename2(response.data);
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

    const fetchFieldNames2 = async () => {
        try {

            if (selectedFilename2) {
                console.log(selectedFilename2);
                const response = await axios.post(
                    "http://localhost:3001/api/fieldnames",
                    { filename: selectedFilename2 }
                );
                console.log(response.data.field_names);
                const fieldNames = response.data.field_names.map((fieldName) => ({
                    label: fieldName,
                    value: fieldName,
                }));
                setSource2(fieldNames);
            } else {
                console.error("No filename selected.");
            }
        } catch (error) {
            console.error("Error fetching field names:", error);
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
    const onChange2 = (e) => {
        // console.log(e)
        const { source, target } = e;
        if (target?.length === 1) {
            setTarget2(target);
        } else {
            setTarget2(target?.length > 1 ? [target[target?.length - 1]] : []);
        }
    };
    const ComparingValues=async () =>{
        
            try {
              const response = await axios.post('http://localhost:3001/api/confusionmatrix/check',
                {
                  filename: selectedFilename,
                  filename2: selectedFilename2,
                  attributes: target,
                  attributes2:target2
                }
              )
              console.log(response.data)
              const filteredData = response.data.combine.filter(item => item.pred != null && item.actual != null);
              setConf(filteredData);
              setData(filteredData);
          
          
              setincorrect(parseFloat(((response?.data?.err) / response?.data?.total) * 100).toFixed(3));
            } catch (error) {
              console.error('Error fetching data:', error);
            
          };

    }
    return (
        <div>
            <div style={{ display: "flex", marginTop: "20px" }}>
                <center style={{ marginLeft: "10%" }}>
                <h5>Test Data set</h5>
                    <input
                        style={{
                            height: "40px",
                            width: "250px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "8px",
                            fontSize: "16px",
                            marginBottom: "10px"
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
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginBottom: "10px"
                        }}
                    >
                        <div style={{ flex: "1", marginRight: "0px", marginTop: "20px" }}>
                            <PickList
                                source={source}
                                target={target}
                                itemTemplate={(item) => item.label}
                                sourceHeader="Available Attribute heading"
                                targetHeader="Data Product Specification"
                                showSourceControls={false}
                                showTargetControls={false}
                                sourceStyle={{ height: "300px" }}
                                targetStyle={{ height: "330px" }}
                                onChange={onChange}
                            />
                        </div>
                    </div>


                </center>
                <center style={{ marginLeft: "5%" }}>
                <h5>Truth Data set</h5>
                    <input
                       style={{

                        height: "50px",
              
                        width: "300px",
              
                        border: "1px solid #ccc",
              
                        borderRadius: "5px",
              
                        padding: "8px",
              
                        fontSize: "16px",
              
                    }}
                        onChange={handleFileChange2}
                        type="file"
                        name="excelFile"
                    />
                    <br />
                    <br />
                    <Button onClick={fetchFieldNames2}>Read Dataset</Button>

                    <div
                        style={{
                            marginTop: "1%",
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginBottom: "10px"
                        }}
                    >
                        <div style={{ flex: "1", marginRight: "10px", marginTop: "20px" }}>
                            <PickList
                                source={source2}
                                target={target2}
                                itemTemplate={(item) => item.label}
                                sourceHeader="Available Attribute heading"
                                targetHeader="Data Product Specification"
                                showSourceControls={false}
                                showTargetControls={false}
                                sourceStyle={{ height: "300px" }}
                                targetStyle={{ height: "330px" }}
                                onChange={onChange2}
                            />
                        </div>
                    </div>

                </center>
            </div>
            <center>

                <Button onClick={ComparingValues} style={{ marginBottom: "50px" }}>start Test</Button>
            </center>
            <DataContainer>
            <div style={{ display: "flex" }}>
              <h4>Filter Table</h4>
            </div>
            <Lab style={{width:"400px"}}>
              <strong>Null Percentage: </strong>{incorrect}%<br></br>
            </Lab>
           
            <TableWrapper>
              <Table1>
                <thead>
                  <tr>
                    <TableHeader>Sr No.</TableHeader>
                    {/* <TableHeader>Station Code</TableHeader> */}
                    <TableHeader>Predicted value</TableHeader>
                    <TableHeader>Actual value</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <TableBodyRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      {/* <TableCell>{item?.stationCode}</TableCell> */}
                      <TableCell>{item?.pred}</TableCell>
                      <TableCell>{item?.actual}</TableCell>
                    </TableBodyRow>
                  ))}
                </tbody>
              </Table1>
            </TableWrapper>
          </DataContainer>

          <RelativeMissclassification  data = {conf}></RelativeMissclassification> 

        </div>
    )
}

export default UserDefined