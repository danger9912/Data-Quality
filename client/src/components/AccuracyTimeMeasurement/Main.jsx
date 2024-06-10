import React, { useState } from "react";

import AccuracyTime from './AccuracyInteger';

import AccuracyNumber from './AccuracyLatlong';

const FormatConsist = () => {
  const [height, setHeight] = useState(0);
  const [date, setDate] = useState(1);
  const [number, setNumber] = useState(0);

  return (
    <>
      <center>
        <button
          onClick={() => {
            setNumber(0);
            setDate(1);
            setHeight(0);
          }}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            marginRight: "20px",
            backgroundColor: date === 1 ? "#4CAF50" : "#ddd",
            color: date === 1 ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Lat - Long
        </button>
        <button
          onClick={() => {
            setNumber(1);
            setDate(0);
            setHeight(0);
          }}
          style={{
            padding: "10px 20px",
            marginRight: "20px",
            backgroundColor: number === 1 ? "#4CAF50" : "#ddd",
            color: number === 1 ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Number
        </button>

        <button
          onClick={() => {
            setNumber(0);
            setDate(0);
            setHeight(1);
          }}
          style={{
            padding: "10px 20px",
            marginRight: "20px",
            backgroundColor: height === 1 ? "#4CAF50" : "#ddd",
            color: height === 1 ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Height
        </button>
      </center>

      {number === 1 && <AccuracyTime />}
      {date === 1 && <AccuracyNumber />}
      {height === 1 && <AccuracyTime />}
    </>
  );
};

export default FormatConsist;
