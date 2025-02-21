import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Optional, if you use react-select
import './App.css'; // Optional, for styling

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [apiResponse, setApiResponse] = useState(null);
    const [jsonError, setJsonError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    const backendApiUrl = 'https://my-flask-backend-app.herokuapp.com/bfhl';// Replace with your deployed backend API URL

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
        setJsonError(''); // Clear any previous JSON error
    };

    const handleSubmit = async () => {
        try {
            JSON.parse(jsonInput); // Validate JSON format
            setJsonError('');

            const parsedData = JSON.parse(jsonInput);

            const response = await axios.post(backendApiUrl, parsedData);
            setApiResponse(response.data);
            setSelectedOptions([]); // Reset selected options on new submission

        } catch (error) {
            setApiResponse(null); // Clear previous response on error
            setSelectedOptions([]);
            if (error instanceof SyntaxError) {
                setJsonError('Invalid JSON format. Please enter valid JSON.');
            } else {
                setJsonError('Error calling API: ' + error.message); // Or more specific error handling
            }
        }
    };

    const handleDropdownChange = (selected) => {
        setSelectedOptions(selected);
    };

    const dropdownOptions = [
        { value: 'alphabets', label: 'Alphabets' },
        { value: 'numbers', label: 'Numbers' },
        { value: 'highest_alphabet', label: 'Highest alphabet' },
    ];

    const rollNumber = "22BAI71191"; // Replace with your roll number
    document.title = rollNumber; // Set website title

    return (
        <div className="App">
            <h1>{rollNumber}</h1> {/* Website title as heading as well, optional */}
            <div className="input-section">
                <textarea
                    placeholder="Enter JSON data here (e.g., { 'data': ['A', 'C', 'z'] })"
                    value={jsonInput}
                    onChange={handleInputChange}
                    className="json-input"
                />
                <button onClick={handleSubmit} className="submit-button">Submit</button>
                {jsonError && <p className="error-message">{jsonError}</p>}
            </div>

            {apiResponse && (
                <div className="response-section">
                    <div className="dropdown-section">
                        <label>Select data to display:</label>
                        <Select
                            isMulti
                            options={dropdownOptions}
                            value={selectedOptions}
                            onChange={handleDropdownChange}
                            className="multi-select-dropdown"
                            placeholder="Select options..."
                        />
                    </div>

                    <div className="output-section">
                        {selectedOptions.length > 0 ? (
                            <div>
                                <h2>Response:</h2>
                                <pre>
                                    {selectedOptions.map((option) => (
                                        <div key={option.value}>
                                            {option.label}: {JSON.stringify(apiResponse[option.value], null, 2)}
                                        </div>
                                    ))}
                                </pre>
                            </div>
                        ) : (
                            <div>
                                <h2>Full Response:</h2>
                                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;