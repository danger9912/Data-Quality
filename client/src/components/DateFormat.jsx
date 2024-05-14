import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import XLSX library



const YourComponent = () => {
  const [jsonData, setJsonData] = useState([]);
  const [accuracy, setAccuracy] = useState(0);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/generaldetails/dateformat",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setJsonData(response?.data?.data);
      setAccuracy(response?.data?.accuracy);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // const handleFileChange = async (event) => {
  //   const selectedFile = event.target.files[0];
  //   const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

  //   try {
  //     let parsedData = [];
  //     if (fileExtension === 'xls' || fileExtension === 'xlsx') {
  //       const workbook = XLSX.read(await selectedFile.arrayBuffer(), { type: 'array' });
  //       const sheetName = workbook.SheetNames[0];
  //       parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  //     }  else if (fileExtension === 'csv') {
  //       const csvData = await parse(selectedFile, { header: true });
  //       parsedData = csvData.data;
  //     }

  //     setJsonData(parsedData);
  //     // Additional logic for accuracy calculation if needed
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "data");
    XLSX.writeFile(wb, "data.xlsx");
  };

  return (
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
        {
          jsonData.length !== 0
        &&
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          style={{backgroundColor:"blue"}}
          onClick={downloadExcel}
        // Disable if no data
        >
          Download Excel
        </button>}
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
                    <td
                      key={i}
                      className="px-4 py-2 border border-gray-400"
                    >
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
  );
}

export default YourComponent;
// import React, { useState } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx'; // Import XLSX library
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Modal, Button } from 'react-bootstrap';
// import VisibilityIcon from '@mui/icons-material/Visibility';

// const YourComponent = () => {
//   const [jsonData, setJsonData] = useState([]);
//   const [accuracy, setAccuracy] = useState(0);
//   const [showModal, setShowModal] = useState(false);

//   const handleFileChange = async (event) => {
//     const selectedFile = event.target.files[0];
//     const formData = new FormData();
//     formData.append("excelFile", selectedFile);

//     try {
//       const response = await axios.post(
//         "http://localhost:3001/api/generaldetails/dateformat",
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );
//       setJsonData(response.data.data);
//       setAccuracy(response.data.accuracy);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const downloadExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(jsonData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "data");
//     XLSX.writeFile(wb, "data.xlsx");
//   };

//   const viewData = () => {
//     setShowModal(true);
//   };

//   return (
//     <>
//       <div style={{ padding: "40px" }}>
//         <input
//           className="form-control uploadBtnInput"
//           id="formFile"
//           style={{ height: "2.5%", width: "355px" }}
//           onChange={handleFileChange}
//           type="file"
//           name="excelFile"
//         />
//         <div className="mt-4">
//           <h2 className="text-lg font-bold mb-2">JSON Data</h2>
//           <p>Accuracy: {accuracy.toFixed(2)}%</p>
//           {jsonData.length !== 0 && (
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               style={{ backgroundColor: "blue" }}
//               onClick={downloadExcel}
//             >
//               Download Excel
//             </button>
//           )}
//           <div className="overflow-x-auto">
//             <table className="table-auto w-full border-collapse border border-gray-400">
//               <thead>
//                 <tr>
//                   {jsonData?.length > 0 &&
//                     Object.keys(jsonData[0])?.map((key) => (
//                       <th
//                         key={key}
//                         className="px-4 py-2 bg-gray-200 border border-gray-400"
//                       >
//                         {key}
//                       </th>
//                     ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {jsonData?.map((row, index) => (
//                   <tr key={index}>
//                     {Object.values(row).map((value, i) => (
//                       <td
//                         key={i}
//                         className="px-4 py-2 border border-gray-400"
//                       >
//                         {value}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         fullscreen={true}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>View Data</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <DataTable
//             value={jsonData}
//             style={{ marginTop: "10px", marginLeft: "10px", width: "60%", border: "1px solid black", marginBottom: "20px" }}
//             tableStyle={{ minWidth: "5rem" }}
//           >
//             <Column
//               field="confidence_level"
//               header="Confidence Level(in%)"
//               style={{ width: "25%" }}
//             ></Column>
//             <Column
//               field="good_percentage"
//               header="Good Percentage (in%)"
//               style={{ width: "25%" }}
//             ></Column>
//             <Column
//               field="bad_percentage"
//               header="Bad Percentage (in%)"
//               style={{ width: "25%" }}
//             ></Column>
//           </DataTable>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={downloadExcel}>
//             Download Excel
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default YourComponent;