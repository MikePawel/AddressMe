import React, { useState } from "react";
import "./Encryption.css";
import { Link } from "react-router-dom";

export default function Encryption() {
  const [inputValueToEncrypt, setInputValueToEncrypt] = useState("");
  const [inputValueToDecrypt, setInputValueToDecrypt] = useState("");

  const sendData = () => {
    fetch("http://localhost:8000/createKeys", {
      method: "POST",
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

  const encryptKeys = () => {
    fetch("http://localhost:8000/encryptMessage", {
      method: "POST",
      body: JSON.stringify({ data: inputValueToEncrypt }),
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
  const decryptKeys = () => {
    fetch("http://localhost:8000/decryptMessage", {
      method: "POST",
      body: JSON.stringify({ data: inputValueToDecrypt }),
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
        <button onClick={sendData}>Create New RSA key pair</button>
        {/* Input for only encrypting data: */}
        <input
          type="text"
          value={inputValueToEncrypt}
          onChange={(e) => setInputValueToEncrypt(e.target.value)}
        />
        <button onClick={encryptKeys}>Encrypt data</button>
        {/* Input for only decrypt data: */}
        <input
          type="text"
          value={inputValueToDecrypt}
          onChange={(e) => setInputValueToDecrypt(e.target.value)}
        />
        <button onClick={decryptKeys}>Decrypt data</button>
      </div>
    </>
  );
}
