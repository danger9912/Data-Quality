import React, { useState } from "react";

import AccuracyInteger from './AccuracyInteger';
import AccuracyDecimal from './AccuracyDecimal';
import UserDefined from '../UserDefined';
const FormatConsist = () => {
  const [Integer, setInteger] = useState(0);
  const [decimal, setDecimal] = useState(1);
  const [number, setNumber] = useState(0);

  return (
    <>
      <center>
        <button
          onClick={() => {
            setNumber(0);
            setDecimal(1);
            setInteger(0);
          }}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            marginRight: "20px",
            backgroundColor: decimal  === 1 ? "#4CAF50" : "#ddd",
            color: decimal  === 1 ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Decimal
        </button>
       

        <button
          onClick={() => {
            setNumber(0);
            setDecimal(0);
            setInteger(1);
          }}
          style={{
            padding: "10px 20px",
            marginRight: "20px",
            backgroundColor: Integer === 1 ? "#4CAF50" : "#ddd",
            color: Integer === 1 ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Integer
        </button>
      </center>

      {decimal === 1 && <AccuracyDecimal />}
      {Integer === 1 && <AccuracyInteger />}
    </>
  );
};

export default FormatConsist;
