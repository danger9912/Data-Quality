import React from 'react'
import { useState,useEffect } from 'react';

import AccuracyTime from './AccuracyTime';
import AccuracyNumber from './AccuracyInteger';

const FormatConsist = () => {
    const [number, setNumber] = useState(0);
    const [date, setDate] = useState(1);

   
    
  return (
    <>
    <center>
<button
            onClick={() => {    
                setNumber(0);
                setDate(1);
               
            }}
            style={{
              marginTop:"10px",
              padding: '10px 20px',
              marginRight: '20px',
              backgroundColor: date === 1 ? '#4CAF50' : '#ddd',
              color: date === 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Date 
          </button>
          <button
             onClick={() => {    
                setNumber(1);
                setDate(0);
               
            }}
            style={{
              padding: '10px 20px',
              marginRight: '20px',
              backgroundColor: number === 1 ? '#4CAF50' : '#ddd',
              color: number === 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Number
          </button>
        
          </center>

          {number === 1 && <AccuracyNumber />}
          {date === 1 && <AccuracyTime/>}
        
      
    </>
  )
}

export default FormatConsist