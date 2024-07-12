import InfoIcon from "@mui/icons-material/Info";
import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";

const CardDash = ({
  omissionRate,
  fileName,
  fileFormatAccepted,
  defaultText,
  errormessage,
}) => {
  const navigate = useNavigate();
  const [smShow, setSmShow] = useState(false);

  const data = [
    {
      header: "Meta-quality",
      subHeaders: ["Confidence", "Representativity", "Homogeneity"],
    },
    {
      header: "Completeness Check",
      subHeaders: ["Omission", "Comission"],
    },
    {
      header: "Logical Consistency",
      subHeaders: [
        "Conceptual Consistency",
        "Domain Consistency",
        "Format Consistency",
        "Topology Consistency",
      ],
    },
    {
      header: "Positional Accuracy",
      subHeaders: [
        "External/Absolute Positional Accuracy",
        "Internal/Relative Positional Accuracy",
        "Gridded Data Positional Accuracy",
      ],
    },
    {
      header: "Thematic Quality",
      subHeaders: [
        "Thematic Classification Correctness",
        "Non-quantitative Attribute Correctness",
        "Quantitative Attribute Correctness",
      ],
    },
    {
      header: "Temporal Quality",
      subHeaders: [
        "Accuracy of Time Measurement",
        "Temporal Consistency",
        "Temporal validity",
      ],
    },
  ];

  const subheaderRoutes = {
    Omission: "/omission",
    Comission: "/comission",
    "Format Consistency": "/formatconsistency",
    "Quantitative Attribute Correctness": "/Quantitative",
    "Domain Consistency": "/domainconsistency",
    "Temporal validity": "/temporalvalid",
    "Accuracy of Time Measurement": "/activemeasurement",
    "Thematic Classification Correctness": "/ThematicClassification",
    "Non-quantitative Attribute Correctness": "/nonquantitative",
    "External/Absolute Positional Accuracy": "/absolutepositionalaccuracy",
    "Internal/Relative Positional Accuracy": "/relativepositionalaccuracy",
    "Gridded Data Positional Accuracy": "/griddedpositionalaccuracy",
    "Temporal Consistency": "/temporalconsist",
  };

  const borders = ["success", "danger", "info", "warning", "dark", "primary"];
  const data1 = {
    name: fileName,
  };

  const handleClick = (subHeader) => {
    const route = subheaderRoutes[subHeader];
    if (route) {
      navigate(route, { state: data1 });
    } else {
      console.error(`Route Not Define for : ${subHeader}`);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          // backgroundColor: "#FDF5E6",
        }}
      >
        {data.map((item, index) => (
          <Card
            border={borders[index % borders.length]} // Applying border color from the borders array
            key={item.header}
            style={{
              width: "13rem",
              marginTop: "1.5rem",
              marginLeft: "0.5rem",
              marginRight: "1px",
              borderWidth: "0.14rem",
              height: "90%",
            }}
          >
            <Card.Header>
              <h5>{item.header.toUpperCase()}</h5>
            </Card.Header>
            <Card.Body>
              {item.subHeaders.map((subHeader) => (
                <React.Fragment key={subHeader}>
                  <Card.Body style={{ height: "12vh", marginTop: "-2vh" }}>
                    <h6>
                      <Card.Text>
                        <button
                          style={{ all: "unset" }}
                          onClick={() => handleClick(subHeader)}
                        >
                          <Link
                            style={{
                              textDecoration: "none",
                              fontSize: "13.7px",
                            }}
                          >
                            {subHeader.toUpperCase()}
                          </Link>
                        </button>
                      </Card.Text>
                    </h6>

                    <Card.Text>
                      {subHeader === "Omission"
                        ? "Rate : " + omissionRate + " %"
                        : ""}
                    </Card.Text>

                    {subHeader === "Format Consistency" && defaultText && (
                      <Card.Text
                        style={{
                          color: fileFormatAccepted ? "green" : "red",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h6> {fileFormatAccepted ? "Accepted" : "Rejected"}</h6>
                        <InfoIcon
                          style={{ cursor: "pointer" }}
                          onMouseOver={() => setSmShow(true)}
                        />
                      </Card.Text>
                    )}
                  </Card.Body>
                  <hr />
                </React.Fragment>
              ))}
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal
        size="sm"
        show={smShow}
        onHide={() => {
          setSmShow(false);
        }}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Format Consistency
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{errormessage}</Modal.Body>
      </Modal>
    </>
  );
};

export default CardDash;
