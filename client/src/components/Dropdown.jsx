import React, { useState } from 'react';

const Dropdown = ({ onChildData }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileList, setFileList] = useState(["No file uploaded"]);

  const handleDropdownToggle = async () => {
    if (!isOpen) {
      try {
        const response = await fetch('http://localhost:3001/api/filelist');
        const data = await response.json();
        if (fileList.length) {
          setFileList(data.files);
        }
        else {
          setFileList(["No file uploaded"]);
        }
      } catch (error) {
        console.error('Error fetching file list:', error);
        setFileList(["Error"]);
      }

    }
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSelectedFile(option);
    onChildData(option);
    setIsOpen(false);
  };

  return (
    <div>
      <br/>
      <div className="dropdown">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={handleDropdownToggle}
        >
          Select File
        </button>

        <div className={`dropdown-menu${isOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuButton">
          {fileList.map((file, index) => (
            <button key={index} className="dropdown-item" onClick={() => handleOptionSelect(file)}>
              {file}
            </button>
          ))}
        </div>
      </div>
      <div className={`alert alert-warning container text-center ${selectedOption ? '' : 'd-none'}`} role="alert">
        {selectedOption ? 'Selected File : ' : ''}<strong>{selectedFile}</strong>

      </div>



    </div>
  );
};

export default Dropdown;
