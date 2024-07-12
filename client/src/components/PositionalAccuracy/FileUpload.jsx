import { useState } from "react";
import "./FileUpload.css";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setProgress(0); // Reset progress on new file selection
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const chunkSize = 5 * 1024 * 1024; // 5MB
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    console.log(`Total Chunks: ${totalChunks}`);
    let chunkNumber = 0;
    let start = 0;
    let end = chunkSize;

    const uploadNextChunk = async () => {
      if (start < selectedFile.size) {
        end = Math.min(start + chunkSize, selectedFile.size);
        const chunk = selectedFile.slice(start, end);
        console.log(
          `Uploading chunk ${chunkNumber + 1}: size ${chunk.size} bytes`
        );
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("chunkNumber", chunkNumber);
        formData.append("totalChunks", totalChunks);
        formData.append("originalname", selectedFile.name);

        fetch("http://localhost:3001/api/positionalaccuracy/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const temp = `Chunk ${
              chunkNumber + 1
            }/${totalChunks} uploaded successfully`;
            setStatus(temp);
            setProgress(((chunkNumber + 1) / totalChunks) * 100);
            chunkNumber++;
            start = end;
            uploadNextChunk();
          })
          .catch((error) => {
            console.error("Error uploading chunk:", error);
          });
      } else {
        setSelectedFile(null);
        setStatus("File upload completed");
        setProgress(100);
      }
    };

    uploadNextChunk();
  };

  return (
    <div className="file-upload-container">
      <h2>Resumable File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button>
      {progress ? (
        <div className="progress-bar-wrapper">
          <div className="progress-bar-container">
            <div
              className={`progress-bar ${progress === 100 ? "complete" : ""}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-percentage">{progress.toFixed(2)}%</span>
        </div>
      ) : null}
      <h3>{status}</h3>
    </div>
  );
};

export default FileUpload;
