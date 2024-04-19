import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DataDisplay.css";

export default function DataDisplay() {
  const [userInput, setUserInput] = useState(""); // State to hold user input

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setUserInput(event.target.value); // Update user input state
  };

  const parseUserInput = () => {
    try {
      const jsonData = JSON.parse(userInput);
      return Object.entries(jsonData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  };

  return (
    <div className="container">
      <textarea
        value={userInput}
        onChange={handleInputChange}
        style={{ width: "100px", height: "100px", resize: "none" }}
      />
      {/* Display user data */}
      <ApiResponseDisplay data={parseUserInput()} />

      <div className="lower-button">
        <Link to="/">Go Back</Link>
      </div>
    </div>
  );
}

const ApiResponseDisplay = ({ data }) => {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "80vw",
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            Name
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            Address
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(([name, address], index) => (
          <tr key={index}>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              {name}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              {address}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
