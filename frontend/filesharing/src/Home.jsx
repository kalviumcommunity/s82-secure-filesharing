import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);

  
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

  
    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:4000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("File uploaded successfully!");
            fetchFiles();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

  
    const fetchFiles = async () => {
        try {
            const response = await axios.get("http://localhost:4000/files");
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div>
            <h2>Secure File Upload</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            <h3>Uploaded Files:</h3>
            <ul>
                {files.map((file) => (
                    <li key={file._id}>
                        <a href={`http://localhost:4000${file.filepath}`} target="_blank" rel="noopener noreferrer">
                            {file.filename}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
