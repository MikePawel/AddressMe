import React, { useState } from "react";
import "./Test.css";
import { Link } from "react-router-dom";

export default function Test() {
  const [inputValue, setInputValue] = useState("");

  const sendData = () => {
    fetch("http://localhost:8000/data", {
      method: "POST",
      body: JSON.stringify({ data: inputValue }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response from server
        console.log(data);
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  return (
    <>
      <div className="test">
        Test
        <Link to="/"> Go Home </Link>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendData}>Send Data</button>
      </div>
    </>
  );
}
