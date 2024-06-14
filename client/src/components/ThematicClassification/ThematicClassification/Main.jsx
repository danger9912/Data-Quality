import React, { useState } from 'react';
import State from './StateThematicClassfication';
import RailwayZones from './RailwayZonesThematicClassification';


const FormatConsist = () => {
  const [selectedFormat, setSelectedFormat] = useState('State');

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <select
        value={selectedFormat}
        onChange={handleFormatChange}
        style={{
          padding: '10px',
          backgroundColor: '#f7f7f7',
          color: '#333',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          outline: 'none',
        }}
      >
       
       
        <option value="State">State</option>
        
        <option value="Railway">Railway Zones </option>
      </select>

      {selectedFormat === "State" && <State />}
      {selectedFormat === "Railway" && <RailwayZones />}
      
    </div>
  )
}

export default FormatConsist;
