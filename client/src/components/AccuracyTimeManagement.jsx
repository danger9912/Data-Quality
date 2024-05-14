import React, { useState } from "react";
import { PickList } from "primereact/picklist";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, FormGroup, FormCheck } from "react-bootstrap";

const AccuracyTimeManagement = () => {
    const [source, setSource] = useState([
        { label: "tree_id", value: "tree_id" },
        { label: "species", value: "species" },
        { label: "soil_type", value: "soil_type" },
        { label: "planting_date", value: "planting_date" },
        { label: "cutting_date", value: "cutting_date" }
    ]);

    const [target, setTarget] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedDataMap, setSelectedDataMap] = useState({});

    const handlePickListChange = (e) => {
        setSource(e.source);
        setTarget(e.target);

        const tableRows = e.target.map((item, index) => (
            <tr key={index}>
                <td>{item.label}</td>
                <td>
                    <button className="btn btn-primary" onClick={() => handleAddButtonClick(item)}>Add</button>
                </td>
                <td>{selectedDataMap[item.value] ? selectedDataMap[item.value].join(", ") : ""}</td>
                <td>50</td>
                <td>20</td>
            </tr>
        ));

        setTableData(tableRows);
    };

    const handleAddButtonClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedDataMap(prevMap => ({
            ...prevMap,
            [selectedItem.value]: checked ? [...(prevMap[selectedItem.value] || []), value] : (prevMap[selectedItem.value] || []).filter(data => data !== value)
        }));
    };

    const handleAddToTable = () => {
        const updatedTableData = target.map((item, index) => {
            if (item === selectedItem) {
                // Update only the selected row's data
                return (
                    <tr key={index}>
                        <td>{selectedItem.label}</td>
                        <td>
                            {/* Maintain the Bootstrap button styling */}
                            <button className="btn btn-primary" onClick={() => handleAddButtonClick(selectedItem)}>Add</button>
                        </td>
                        <td>{selectedDataMap[selectedItem.value] ? selectedDataMap[selectedItem.value].join(", ") : ""}</td>
                        <td>{/* Add other columns as needed */}</td>
                    </tr>
                );
            }
            // If the item is not the newly added one, keep the existing row
            return tableData[index];
        });
    
        setTableData(updatedTableData);
        setShowModal(false);
    };
    


    return (
        <div>
            <h2>&nbsp;Accuracy of Time Measurement</h2>
            <center>
                <div style={{ marginTop: "2%", width: "70%" }}>
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
                        onChange={handlePickListChange}
                    />
                </div>
                <table className="table" style={{ marginTop: "1%", width: "70%" }}>
                    <thead>
                        <tr>
                            <th>Column 1</th>
                            <th>Column 2</th>
                            <th>Column 3</th>
                            <th>Column 4</th>
                            <th>Column 5</th>
                        </tr>
                    </thead>
                    <tbody>{tableData}</tbody>
                </table>
            </center>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                        <FormCheck
                                type="checkbox"
                                label="Century"
                                value="Century"
                                onChange={handleCheckboxChange}
                            />
                            <FormCheck
                                type="checkbox"
                                label="Year"
                                value="year"
                                onChange={handleCheckboxChange}
                            />
                            <FormCheck
                                type="checkbox"
                                label="Month"
                                value="month"
                                onChange={handleCheckboxChange}
                            />
                            <FormCheck
                                type="checkbox"
                                label="Date"
                                value="date"
                                onChange={handleCheckboxChange}
                            />
                            <FormCheck
                                type="checkbox"
                                label="Hour"
                                value="hour"
                                onChange={handleCheckboxChange}
                            />
                            <FormCheck
                                type="checkbox"
                                label="Minute"
                                value="minute"
                                onChange={handleCheckboxChange}
                            />
                            <FormCheck
                                type="checkbox"
                                label="Second"
                                value="second"
                                onChange={handleCheckboxChange}
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddToTable}>
                        Add to Table
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AccuracyTimeManagement;
