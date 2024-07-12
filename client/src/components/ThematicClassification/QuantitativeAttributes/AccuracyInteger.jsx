import React, { useState, useEffect } from 'react';
import axios from "axios";
import styled from 'styled-components';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from 'sweetalert2';
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { PickList } from "primereact/picklist";

const TableWrapper = styled.div`
  max-height: 450px; /* Set the height you want for the scrollable area */
  overflow-y: auto;
  width:260px;
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
  
  margin-right:15px;

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
  background-color: #98FB98;
  color: black;
  padding: 10px;
  font-size: 15px;
  border-radius: 8px;
  margin-bottom:10px;
  margin-top:10px;
`;

const Button1 = styled.button`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 8px;
`;
const AccuracyTime = () => {
  const [selectedFilename, setSelectedFilename] = useState("");
  const [data, setData] = useState([]);
  const [errorPercentage, setErrorPercentage] = useState(0);
  const [selectedErrorOption, setSelectedErrorOption] = useState("20");
  const [filteredData, setFilteredData] = useState([]);
  const [randData, setRandData] = useState([]);
  const [notRandData, setNotRandData] = useState([]);
  const [confidenceLevel, setConfidenceLevel] = useState('0.50');
  const [limits, setLimits] = useState([]);
  const [good, setGood] = useState(0);
  const [bad, setBad] = useState(0);
  const [tableData, setTableData] =useState([]);
  const [downloadedFileName, setDownloadedFileName] = useState("");
  const [downloadingData, setDownloadingData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [mean,setMean] =useState("");
  const [source, setSource] = useState([]);
  const [ target,setTarget] = useState([]);
  const [Ref,setRef] =useState(false)
  const[goodS,setGoodS] =useState(0);
  const[badS,setBadS] =useState(0);
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
        // console.log(response.data.field_names);
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

  // useEffect(() => {
  //   fetchData();
  // }, [selectedFilename]);

  useEffect(() => {
    // console.log("178")
    const dashCount = data.filter(item => item.convertedData === 'Invalid').length;
    const totalCount = data.length;
    const percentage = (dashCount / totalCount) * 100;
    setErrorPercentage(parseFloat(percentage.toFixed(4)));
  }, [data]);

  useEffect(() => {
    const filtered = data.filter(item => item.convertedData === 'valid');
    setFilteredData(filtered);
  }, [data]);
  useEffect(() => {
    // console.log("194")
    const notRand =filteredData.filter(item => !randData.includes(item));
    setNotRandData(notRand);
  }, [randData, filteredData,confidenceLevel]);

  
  useEffect(() => {
    const numRowsToSelect = Math.ceil(filteredData.length * (parseFloat(selectedErrorOption) / 100));
    const indices = Array.from({ length: filteredData.length }, (_, index) => index);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const selectedIndices = indices.slice(0, numRowsToSelect);
    const selectedRows = selectedIndices.map(index => filteredData[index]);
    setRandData(selectedRows);
  }, [selectedErrorOption]);



  useEffect(() => {
    console.log("213")
    // setLimits(calculateConfidenceInterval(randData, confidenceLevel));
    const goodCount = notRandData.filter(item => item.originalData >= limits[0] && item.originalData <= limits[1]).length;
    setGood(goodCount);
    const badCount = notRandData.filter(item => item.originalData <= limits[0] || item.originalData >= limits[1]).length;
    setBad(badCount);
  }, [limits]);

  useEffect(() => {
    console.log("213")
    // setLimits(calculateConfidenceInterval(randData, confidenceLevel));
    const goodCount = randData.filter(item => item.originalData >= limits[0] && item.originalData <= limits[1]).length;
    setGoodS(goodCount);
    const badCount = randData.filter(item => item.originalData <= limits[0] || item.originalData >= limits[1]).length;
    setBadS(badCount);
  }, [limits]);

  useEffect(()=>{
    console.log("221")
    fetchtableData()
  },[Ref])
  useEffect(()=>{
    console.log("221")
    setLimits(calculateConfidenceInterval(randData, confidenceLevel));
  },[confidenceLevel, randData])



  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/accuracynumber/getallcols', {
        filename: selectedFilename,
        attributes: target,
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchtableData = async ()=>{
    try{
      const response = await axios.post('http://localhost:3001/api/accuracynumber/getlogs');
      // console.log("hi")
      setTableData(response.data);
    }
    catch(err){
      console.error(err);
    }
  }

  const calculateMean = (numbers) => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
  };

  const calculateStandardDeviation = (numbers) => {
    const mean = calculateMean(numbers);
    const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
    const variance = squaredDifferences.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    return Math.sqrt(variance);
  };
// const mean =0;
  const calculateConfidenceInterval = (numbers, confidenceLevel) => {
    const dates = numbers.map(item => item.originalData);
     const mean = calculateMean(dates);
    //  console.log(mean);
     setMean(mean);
    const standardDeviation = calculateStandardDeviation(dates);
    const sampleSize = dates.length;
    const standardError = standardDeviation / Math.sqrt(sampleSize);
    const zScore = zScoreLookup(confidenceLevel);
    const marginOfError = zScore * standardError;
    const lowerLimit = mean - marginOfError;
    const upperLimit = mean + marginOfError;
    return [parseFloat(lowerLimit.toFixed(3)), parseFloat(upperLimit.toFixed(3))];
  };

  const zScoreLookup = (alpha) => {
    const zScores = {
      "0.50": 0.6745,
      "0.68": 0.9945,
      "0.683": 0.9945,
      "0.90": 1.645,
      "0.95": 1.96,
      "0.99": 2.576,
      "0.998": 3.090
    };
    if (zScores.hasOwnProperty(alpha)) {
      return zScores[alpha];
    } else {
      console.warn(`Z-score for alpha ${alpha} not found in lookup table. Using approximation.`);
      return -1;
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedErrorOption(event.target.value);
  };

  const handleDropdownChangeAlpha = (event) => {
    setConfidenceLevel(event.target.value);
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const handleSave = async() =>{
    const d = {
      // confidence_level : confidenceLevel*100,
      confidence_level : parseFloat(confidenceLevel * 100).toFixed(2),
      good_percentage_r :parseFloat((good / (bad + good) * 100).toFixed(2)),
      notgood_percentage_r : parseFloat((bad / (bad + good) * 100).toFixed(2)),
      good_percentage_s :parseFloat((goodS / (badS + goodS) * 100).toFixed(2)),
      notgood_percentage_s : parseFloat((badS / (badS + goodS) * 100).toFixed(2)),
      low_bound:limits[0],
      high_bound:limits[1],
      created_date : getCurrentDateTime(),
      file_name: selectedFilename
    }
    console.log(d)
   
      try {
        const response = await axios.post('http://localhost:3001/api/accuracynumber/insertlog', d);
        // Show success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Data has been successfully inserted.',
        });
        setRef(Ref === true ? false : true);
      } catch (error) {
        // Show error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
        console.error('Error:', error);
      }
  
}

const viewData = async () => {
  try {   
    setShowModal(true); // Show modal after receiving the response
  } catch (error) {
    console.log("Error fetching data:", error);
  } 
};

const downloadTableData = () => {
  const fileName = "download"
  const worksheet = XLSX.utils.json_to_sheet(tableData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Write workbook to binary string
  const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

  // Convert binary string to Blob
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Create download link
  const downloadLink = document.createElement('a');
  const url = URL.createObjectURL(blob);
  downloadLink.setAttribute('href', url);
  downloadLink.setAttribute('download', `${fileName}.xlsx`);

  // Trigger download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);


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

const attributeSelected = ()=>{
  fetchData();
}


  return (
    <>
      <h2> Accuracy of Integer Measurement</h2>
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
        
        <div style={{ flex: "1", marginRight: "50px",marginLeft:"50px" ,marginTop:"20px" }}>
        
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
     
      <Button onClick={attributeSelected} style={{marginBottom:"50px"}}>start Test</Button>
      </center>
      {data.length !== 0 ?
        <MainContainer>
          <SectionContainer
            style={{marginLeft:"10px"}}
          >
            <h5>DataSet</h5>
            <ErrorLabel>Error Percentage: {errorPercentage}%</ErrorLabel>
            <TableWrapper>
            <Table1>
              <thead>
                <tr>
                  <TableHeader>Sr No.</TableHeader>
                  <TableHeader>Number</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <TableBodyRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.originalData}</TableCell>
                    <TableCell>{item.convertedData}</TableCell>
                  </TableBodyRow>
                ))} 
              </tbody>
            </Table1>
            </TableWrapper>
           
          </SectionContainer>

          <DataContainer
            style={{marginTop:"42px"}}
            >
             <h5>Filter Table</h5>
            <TableWrapper>
            <Table1>
              <thead>
                <tr>
                  <TableHeader>Sr No.</TableHeader>
                  {/* <TableHeader>Date(YYYY-MM-DD)</TableHeader> */}
                  <TableHeader>Number</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <TableBodyRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {/* <TableCell>{item.convertedData}</TableCell> */}
                    <TableCell>{item.originalData === '-' ? "---" : item.originalData}</TableCell>
                  </TableBodyRow>
                ))}
              </tbody>
            </Table1>
            </TableWrapper>
          </DataContainer>

          <DataContainer          >
            <h5>Baseline</h5>
            <Dropdown value={selectedErrorOption} onChange={handleDropdownChange}>
              <Option value="20">20%</Option>
              <Option value="50">50%</Option>
              <Option value="70">70%</Option>
              <Option value="90">90%</Option>
            </Dropdown>
            <TableWrapper>
            <Table1 >
              <thead>
                <tr>
                  <TableHeader>Sr No.</TableHeader>
                  {/* <TableHeader>Date(YYYY-MM-DD)</TableHeader> */}
                  <TableHeader>Number</TableHeader>
                </tr>
              </thead>
              <tbody>
                {randData.map((item, index) => (
                  <TableBodyRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {/* <TableCell>{item.convertedData}</TableCell> */}
                    <TableCell>{item.originalData === '-' ? "---" : item.originalData}</TableCell>
                  </TableBodyRow>
                ))}
              </tbody>
            </Table1>
            </TableWrapper>
          </DataContainer>

          <DataContainer>
            <h5>Confidence Interval</h5>
            <div style={{ marginRight: "10px", display: "flex" }}>
              <Dropdown value={confidenceLevel} onChange={handleDropdownChangeAlpha}>
                <Option value="0.50">50%</Option>
                <Option value="0.68">68%</Option>
                <Option value="0.683">68.3%</Option>
                <Option value="0.90">90%</Option>
                <Option value="0.95">95%</Option>
                <Option value="0.99">99%</Option>
                <Option value="0.998">99.8%</Option>
              </Dropdown>
              
            </div>

            <Lab>
              <strong>Mean: 
                
                </strong> {parseFloat((mean)).toFixed(2)}<br></br>
                 <strong>Upper Limit: </strong>{limits[0]}<br></br>
                 <strong> Lower Limit: </strong> {limits[1]}<br></br>
           
            </Lab>
            <TableWrapper
              style={{ 
                height:"343px"
              }}
            >
            <Table1>
              <thead>
                <tr>
                  <TableHeader>Sr No.</TableHeader>
                  <TableHeader>Number</TableHeader>
                  <TableHeader>Result</TableHeader>
                </tr>
              </thead>
              <tbody>
                {randData.map((item, index) => (
                  <TableBodyRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.originalData === '-' ? "---" : item.originalData}</TableCell>
                    <TableCell>
                      {item.originalData >= limits[0] && item.originalData <= limits[1] ? (
                        <>Good</>
                      ) : (
                        <>Not Good</>
                      )}
                    </TableCell>
                  </TableBodyRow>
                ))}
              </tbody>
            </Table1>
            </TableWrapper>
          </DataContainer>
          
          <DataContainer>
            <h5>Remaining Data</h5>
            <div style={{ marginRight: "10px", display: "flex" }}>
             
              <button style={{ backgroundColor: "#4CAF50", border: "none", color: "white", padding: "10px 20px", fontSize: "15px", cursor: "pointer", borderRadius: "8px",marginLeft:"10px"}} onClick={handleSave}>Save</button>
            </div>

            <Lab>
              
                
               
            <strong>Good Accuracy: </strong>{parseFloat((good / (bad + good) * 100).toFixed(2))}%<br></br>
            <strong>Not good Accuracy: </strong>{parseFloat((bad / (bad + good) * 100).toFixed(2))}%
            </Lab>
            <TableWrapper
              style={{ 
                height:"380px"
              }}
            >
            <Table1>
              <thead>
                <tr>
                  <TableHeader>Sr No.</TableHeader>
                  <TableHeader>Number</TableHeader>
                  <TableHeader>Result</TableHeader>
                </tr>
              </thead>
              <tbody>
                {notRandData.map((item, index) => (
                  <TableBodyRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.originalData === '-' ? "---" : item.originalData}</TableCell>
                    <TableCell>
                      {item.originalData >= limits[0] && item.originalData <= limits[1] ? (
                        <>Good</>
                      ) : (
                        <>Not Good</>
                      )}
                    </TableCell>
                  </TableBodyRow>
                ))}
              </tbody>
            </Table1>
            </TableWrapper>
          </DataContainer>
        </MainContainer>
        : <h4>Enter the Excel File...</h4>
      }
      <center>
        <h5 style={{marginBottom:"40px",marginTop:"50px"}}>Table data</h5>
            <DataTable
              value={tableData}
              style={{marginTop:"10px",marginLeft:"10px",width:"90%",border:"1px solid black",marginBottom:"20px" }}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "5rem" }}
            >
                <Column
                field="file_name"
                header="FileName"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="confidence_level"
                header="Confidence Level(in%)"
                style={{ width: "25%" }}
              ></Column>
               <Column
                field="created_date"
                header={
                  <>
                   Created At <br/> (YYYY-MM -DD HH:MM:SS)
                   </>
                   }
                style={{ width: "25%" }}
              ></Column>
               <Column
                field="low_bound"
                header="Lower Bound"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="high_bound"
                header="High Bound"
                style={{ width: "25%" }}
              ></Column>

              <Column
                field="good_percentage_r"
                header="Remaining data Good Accuracy (in%)"

                style={{ width: "25%" }}
              ></Column>
              <Column
                field="notgood_percentage_r"
                header="Remaining data NotGood Accuracy (in%)"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="good_percentage_s"
                header="selected data Good Accuracy (in%)"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="notgood_percentage_s"
                header="selected data NotGood Accuracy (in%)"
                style={{ width: "25%" }}
              ></Column>
             
             
             
              
              <Column
                
                header="View/Download"
                body={(rowData) => (
                  <div className="btnCon">
                    <VisibilityIcon
                      style={{ cursor: "pointer" }}
                      onClick={viewData} 
                    />
                  </div>
                )}
              />
            </DataTable>
            </center>
            <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        fullscreen={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>View Data</Modal.Title>

          
        </Modal.Header>
        <Modal.Body>
        <DataTable
              value={tableData}
              style={{marginTop:"10px",marginLeft:"10px",width:"100%",border:"1px solid black",marginBottom:"20px" }}
              tableStyle={{ minWidth: "5rem" }}
            >
              <Column
                field="file_name"
                header="FileName"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="confidence_level"
                header="Confidence Level(in%)"
                style={{ width: "25%" }}
              ></Column>
               <Column
                field="created_date"
                header="Created At"
                style={{ width: "25%" }}
              ></Column>
               <Column
                field="low_bound"
                header="Lower Bound"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="high_bound"
                header="High Bound"
                style={{ width: "25%" }}
              ></Column>

              <Column
                field="good_percentage_r"
                header="Remaining data Good Accuracy (in%)"

                style={{ width: "25%" }}
              ></Column>
              <Column
                field="notgood_percentage_r"
                header="Remaining data NotGood Accuracy (in%)"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="good_percentage_s"
                header="selected data Good Accuracy (in%)"
                style={{ width: "25%" }}
              ></Column>
              <Column
                field="notgood_percentage_s"
                header="selected data NotGood Accuracy (in%)"
                style={{ width: "25%" }}
              ></Column>
            </DataTable>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
         
          <Button variant="primary" onClick={downloadTableData}>
           Download xlsx
        </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AccuracyTime;
