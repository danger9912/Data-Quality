import React, { useEffect, useState } from 'react';

import axios from "axios";

import { Button } from "react-bootstrap";

import { PickList } from "primereact/picklist";

import styled from 'styled-components';

import ConfusionMatrix from '../../ConfusionMatrix';
import RelativeMissclassification from '../../MisClassificationMatrix';




const TableWrapper = styled.div`

  max-height: 450px;

  overflow-y: auto;

  width: 500px;

  height: 550px;

  border: 1px solid #ccc;

  border-radius: 10px;

`;




const MainContainer = styled.div`

  display: flex;

`;




const DataContainer = styled.div`

  position: relative;

  margin: 100px 15px 50px 100px;

`;




const Dropdown = styled.select`

  padding: 10px;

  font-size: 16px;

  border-radius: 8px;

  width: 150px;

  margin-bottom: 10px;

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

  border-radius: 8px;

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

  background-color: red;

  color: black;

  padding: 10px;

  font-size: 15px;

  border-radius: 8px;

  margin-bottom: 10px;

  margin-top: 10px;

`;




const NonQuantitative = () => {

    const [source, setSource] = useState([]);

    const [target, setTarget] = useState([]);

    const [selectedFilename, setSelectedFilename] = useState("");

    const [data, setData] = useState([]);

    const [originalData, setOriginalData] = useState([]);

    const [confusionMatrix, setConfusionMatrix] = useState([]);

    // const [data, setData] = useState([]);

    const [incorrect, setIncorrect] = useState('');




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

                const response = await axios.post("http://localhost:3001/api/fieldnames", { filename: selectedFilename });

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

            const response = await axios.post('http://localhost:3001/api/nonquantitative/check', {

                filename: selectedFilename,

                attributes: target,

            });

            setData(response.data.data);

            setIncorrect(parseFloat(((response.data.nullcount1) / response.data.totallength) * 100).toFixed(3));

            setOriginalData(response.data.originalData)

            setConfusionMatrix(response.data.data);

            // generateConfusionMatrix(response.data.data);

            const filteredData = response.data.data.filter(item => item.pred != null && item.actual != null);

            setConfusionMatrix(filteredData);

            // console.log(response?.data?.data?.length)

        } catch (error) {

            console.error('Error fetching data:', error);

        }

    };

    const generateConfusionMatrix = (data) => {

        const labels = Array.from(new Set(data.map(item => item.actual).concat(data.map(item => item.pred))));

        const labelIndex = {};

        labels.forEach((label, index) => {

            labelIndex[label] = index;

        });




        const matrix = Array(labels.length).fill(0).map(() => Array(labels.length).fill(0));




        data.forEach(item => {

            const actualIndex = labelIndex[item.actual];

            const predIndex = labelIndex[item.pred];

            matrix[actualIndex][predIndex]++;

        });




        setConfusionMatrix(matrix);



    };

    // useEffect(()=>{

    //   console.log(d)

    // },[])




    const onChange = (e) => {

        const { target } = e;

        setTarget(target.slice(-2));

    };




    return (

        <div>

            <h2 style={{marginBottom:"10px"}}> RailwaysZones Non - Quantitative</h2>

            <center>

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

                <div style={{ marginTop: "1%", width: "70%", display: "flex", flexDirection: "row", alignItems: "flex-start" }}>

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

                <Button onClick={fetchStationCode} style={{ marginBottom: "50px" }}>Start Test</Button>

            </center>

            {data.length !== 0 && (

                <MainContainer>




                    <div style={{ display: "flex" }}>

                        <DataContainer>

                            <div style={{ display: "flex" }}>

                                <h4>Data Table</h4>

                            </div>

                            <Lab>

                                <strong>Null Percentage: </strong>{incorrect}%<br></br>

                            </Lab>

                            <TableWrapper>

                                <Table1>

                                    <thead>

                                        <tr>

                                            <TableHeader>Sr No.</TableHeader>

                                            <TableHeader>railway code</TableHeader>

                                            <TableHeader>railwayName</TableHeader>



                                        </tr>

                                    </thead>

                                    <tbody>

                                        {originalData.map((item, index) => (

                                            <TableBodyRow key={index}>

                                                <TableCell>{index + 1}</TableCell>

                                                <TableCell>{item?.code}</TableCell>

                                                <TableCell>{item?.number}</TableCell>



                                            </TableBodyRow>

                                        ))}

                                    </tbody>

                                </Table1>

                            </TableWrapper>

                        </DataContainer>

                        <DataContainer>

                            <div style={{ display: "flex" }}>

                                <h4>Filter Table</h4>

                            </div>



                            <TableWrapper>

                                <Table1>

                                    <thead>

                                        <tr>

                                            <TableHeader>Sr No.</TableHeader>

                                            <TableHeader>Station Code</TableHeader>

                                            <TableHeader>Dataset value</TableHeader>

                                            <TableHeader>Truth value</TableHeader>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {data.map((item, index) => (

                                            <TableBodyRow key={index}>

                                                <TableCell>{index + 1}</TableCell>

                                                <TableCell>{item?.stationCode}</TableCell>

                                                <TableCell>{item?.pred}</TableCell>

                                                <TableCell>{item?.actual}</TableCell>

                                            </TableBodyRow>

                                        ))}

                                    </tbody>

                                </Table1>

                            </TableWrapper>

                        </DataContainer>

                    </div>






                </MainContainer>

            )}

<div style={{width:"100%"}}>
            <RelativeMissclassification data={confusionMatrix}></RelativeMissclassification>
            </div>
        </div>

    );

};




export default NonQuantitative;