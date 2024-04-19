import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DataDisplay.css";
import { useMetaMask } from "~/hooks/useMetaMask";
import { ethers } from "ethers";
import { contractAddress } from "~/utils/contractDetails";
import { contractABI } from "~/utils/contractDetails";

export default function DataDisplay() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const { wallet } = useMetaMask();
  const [inputValueToDecrypt, setInputValueToDecrypt] = useState("");
  const [dataForDisplay, setDataForDisplay] = useState({});

  const pullData = async () => {
    try {
      const data = await contract.getUserData(wallet.accounts[0]);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error pulling data:", error);
    }
  };

  const forwardToDecrypt = async () => {
    const pullDataToForward = await pullData();
    setInputValueToDecrypt(pullDataToForward);
    decryptKeys();
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
        const parsedData = JSON.parse(data.message);
        console.log(parsedData);
        setDataForDisplay(parsedData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      {/* Display user data */}
      <ApiResponseDisplay data={dataForDisplay} />

      <div className="lower-button">
        <Link to="/">Go Back</Link>
      </div>

      <button onClick={forwardToDecrypt} className="submit-button">
        Pull data from blockchain
      </button>
    </div>
  );
}

const ApiResponseDisplay = ({ data }) => {
  return (
    <>
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
          {/* Check if data is not empty before mapping */}
          {Object.entries(data).length > 0 &&
            Object.entries(data).map(([name, address], index) => (
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
    </>
  );
};
