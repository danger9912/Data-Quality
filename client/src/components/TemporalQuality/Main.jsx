import React, { useState } from "react";

import OneDate from './TemporalConsistency';
import StartEndDate from './StartEndDate';
const FormatConsist = () => {
  const [oneDate, setOneDate] = useState(1);
  const [twoDate, setTwoDate] = useState(0);

  return (
    <>
      <center>
        <button
          onClick={() => {
            setOneDate(1);
            setTwoDate(0);
          }}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            marginRight: "20px",
            backgroundColor: oneDate  === 1 ? "#4CAF50" : "#ddd",
            color: oneDate  === 1 ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          One Date
        </button>
       

        <button
          onClick={() => {
            setTwoDate(1);
            setOneDate(0);
          }}
          style={{
            padding: "10px 20px",
            marginRight: "20px",
            backgroundColor: twoDate === 1 ? "#4CAF50" : "#ddd",
            color: twoDate === 1 ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Two Date
        </button>
      </center>

      {oneDate === 1 && <OneDate />}
      {twoDate === 1 && <StartEndDate />}
    </>
  );
};

export default FormatConsist;
