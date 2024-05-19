import React from 'react'
import { useState,useEffect } from 'react';
import Pincode from './FormatConsistency/StationCode';
import CodeNumber from './FormatConsistency/Railways';
import LatLong from './FormatConsistency/LatLong';
import FileFormat from './FormatConsistency/FileFormat';
import Date from './FormatConsistency/Date';
const FormatConsist = () => {
    const [fileFormat, setFileFormat] = useState(1);
    const [dateFormat, setDateFormat] = useState(0);
    const [railways, setRailways] = useState(0);
    const [StationCode, setStationCode] = useState(0);
    const [latlong, setLatLong] = useState(0);
   
    
  return (
    <>
    <center>
<button
            onClick={() => {    
                setRailways(0);
                setDateFormat(0);
                setFileFormat(1);
                setLatLong(0);
                setStationCode(0);
            }}
            style={{
              marginTop:"10px",
              padding: '10px 20px',
              marginRight: '20px',
              backgroundColor: fileFormat === 1 ? '#4CAF50' : '#ddd',
              color: fileFormat === 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            File Format
          </button>
          <button
             onClick={() => {    
                setRailways(0);
                setDateFormat(1);
                setFileFormat(0);
                setLatLong(0);
                setStationCode(0);
            }}
            style={{
              padding: '10px 20px',
              marginRight: '20px',
              backgroundColor: dateFormat === 1 ? '#4CAF50' : '#ddd',
              color: dateFormat === 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Date Format
          </button>
          <button
             onClick={() => {    
                setRailways(0);
                setDateFormat(0);
                setFileFormat(0);
                setLatLong(0);
                setStationCode(1);
            }}
            style={{
              padding: '10px 20px',
              marginRight: '20px',
              backgroundColor: StationCode === 1 ? '#4CAF50' : '#ddd',
              color: StationCode === 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
           Station Code Format
          </button>
          <button
              onClick={() => {    
                setRailways(0);
                setDateFormat(0);
                setFileFormat(0);
                setLatLong(1);
                setStationCode(0);
            }}
            style={{
              padding: '10px 20px',
              marginRight: '20px',
              backgroundColor: latlong === 1 ? '#4CAF50' : '#ddd',
              color: latlong === 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Lat-Long Format
          </button>
          <button
              onClick={() => {    
                setRailways(1);
                setDateFormat(0);
                setFileFormat(0);
                setLatLong(0);
                setStationCode(0);
            }}
            style={{
              padding: '10px 20px',
              marginRight: '20px',
              backgroundColor: railways === 1 ? '#4CAF50' : '#ddd',
              color: railways === 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
           Railway Code Format
          </button>
          </center>

          {StationCode === 1 && <Pincode />}
          {fileFormat === 1 && <FileFormat/>}
          {dateFormat === 1 && <Date/>}
          {railways === 1 && <CodeNumber/>}
          {latlong === 1 && <LatLong/>}
      
    </>
  )
}

export default FormatConsist