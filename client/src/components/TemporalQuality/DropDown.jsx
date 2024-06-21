import React, { useState } from 'react';

import { Button } from "react-bootstrap";
const Dropdown = ({ onFilter }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [inputValues, setInputValues] = useState({ input1: '', input2: '' });
  const [error, setError] = useState('');

  const options = [
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'lesser_than', label: 'Lesser Than' },
    { value: 'between_include', label: 'Between Include Border' },
    { value: 'between_exclude', label: 'Between Exclude Border' },
    { value: 'and', label: 'And' },
    { value: 'or', label: 'Or' },
    { value: 'xor', label: 'Xor' },
  ];

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setInputValues({ input1: '', input2: '' });
    setError('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });

    if (name === 'input2' && inputValues.input1 && value) {
      if (new Date(value) <= new Date(inputValues.input1)) {
        setError('Second date must be greater than the first date');
      } else {
        setError('');
      }
    }
  };

  const handleFilter = () => {
    if (selectedOption && inputValues.input1 && (selectedOption.includes('between') ? inputValues.input2 : true)) {
      onFilter(selectedOption, inputValues.input1, inputValues.input2);
    } else {
      setError('Please select a condition and enter the required dates');
    }
  };

  const styles = {
    container: {
      margin: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    select: {
      marginBottom: '15px',
      padding: '8px',
      fontSize: '16px',
    },
    inputContainer: {
      marginBottom: '10px',
      marginRight: '10px',
      width: '200px',
    },
    input: {
      display: 'block',
      marginBottom: '5px',
      padding: '8px',
      fontSize: '16px',
      width: '100%',
      boxSizing: 'border-box',
    },
    result: {
      marginTop: '20px',
    },
    error: {
      color: 'red',
    },
  };

  return (
    <div style={styles.container}>
      <label htmlFor="conditions-dropdown" style={styles.label}>Select Condition: </label>
      <select id="conditions-dropdown" value={selectedOption} onChange={handleChange} style={styles.select}>
        <option value="">--Select an option--</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {selectedOption && (
        <div>
          {(selectedOption === 'greater_than' ||
            selectedOption === 'lesser_than' ||
            selectedOption === 'and' ||
            selectedOption === 'or') ? (
            <div style={styles.inputContainer}>
              <label htmlFor="input1" style={styles.label}>Date:</label>
              <input
                type="date"
                id="input1"
                name="input1"
                value={inputValues.input1}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <div style={styles.inputContainer}>
                <label htmlFor="input1" style={styles.label}>Start Date:</label>
                <input
                  type="date"
                  id="input1"
                  name="input1"
                  value={inputValues.input1}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputContainer}>
                <label htmlFor="input2" style={styles.label}>End Date:</label>
                <input
                  type="date"
                  id="input2"
                  name="input2"
                  value={inputValues.input2}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}


      <Button onClick={handleFilter}>Filter Dates</Button>

    </div>
  );
};

export default Dropdown;
