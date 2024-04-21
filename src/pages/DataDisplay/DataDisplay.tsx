import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DataDisplay.css";
import { useMetaMask } from "~/hooks/useMetaMask";
import { ethers } from "ethers";
import { contractAddressArbitrum } from "~/utils/contractDetails";
import { contractAddressGnosis } from "~/utils/contractDetails";
import { contractAddressMorph } from "~/utils/contractDetails";
import { contractAddressAvail } from "~/utils/contractDetails";
import { contractABI } from "~/utils/contractDetails";
import { Paper } from "@mui/material";

export default function DataDisplay() {
  const { wallet } = useMetaMask();
  const [dataForDisplay, setDataForDisplay] = useState({});
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  var contract = new ethers.Contract(contractAddressMorph, contractABI, signer);

  const pullData = async () => {
    try {
      const data = await contract.getUserData(wallet.accounts[0]);
      return data;
    } catch (error) {
      console.error("Error pulling data:", error);
    }
  };
  useEffect(() => {
    // check which network the user is connected to and set the contract address accordingly
    let currentNet = parseInt(wallet.chainId, 16);
    let currentAddress = contractAddressMorph;
    if (currentNet === 421614) {
      currentAddress = contractAddressArbitrum;
    } else if (currentNet === 2710) {
      currentAddress = contractAddressMorph;
    } else if (currentNet === 202402021700) {
      currentAddress = contractAddressAvail;
    } else if (currentNet === 10200) {
      currentAddress = contractAddressGnosis;
    }
    contract = new ethers.Contract(currentAddress, contractABI, signer);
    const fetchData = async () => {
      if (wallet) {
        const pullDataToForward = await pullData();
        console.log(pullDataToForward);
        decryptKeys(pullDataToForward);
      }
    };
    fetchData();
  }, [wallet]); // Add wallet as a dependency

  // Deprecated function for connectivity testing and troubleshooting
  const forwardToDecrypt = async () => {
    const pullDataToForward = await pullData();
    decryptKeys(pullDataToForward);
  };

  const decryptKeys = (getData: any) => {
    fetch("http://localhost:8000/decryptMessage", {
      method: "POST",
      body: JSON.stringify({ data: getData }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const parsedData = JSON.parse(data.message);
        setDataForDisplay(parsedData);
      })
      .catch((error) => {
        console.error(error);
        setDataForDisplay({ null: "null" });
      });
  };

  return (
    <div className="container">
      <div className="data-display">
        <ApiResponseDisplay data={dataForDisplay} />

        <div className="lower-button">
          <Link to="/">Go Back</Link>
        </div>
      </div>

      {/* For testing purposes: */}
      {/* <button onClick={forwardToDecrypt} className="submit-button">
        Pull data from blockchain
      </button> */}
    </div>
  );
}

const ApiResponseDisplay = ({ data }) => {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            backgroundColor: "#424242",
            marginBottom: "20px",
            width: "800px",
            height: "500px",
            overflowY: "auto", // scrollable when content overflows vertically
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              fontSize: "14px",
              padding: "50px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  Address
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Sort the data by name before mapping */}

              {Object.entries(data)
                .filter(
                  ([name, address]) =>
                    name.trim() !== "" && address.trim() !== ""
                ) // Filter out empty inputs
                .sort(([nameA], [nameB]) => nameA.localeCompare(nameB)) // Sort by name
                .map(([name, address], index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                        color: "#ffffff",
                      }}
                    >
                      {name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                        color: "#ffffff",
                        position: "relative",
                      }}
                    >
                      {address}
                      <button
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        onClick={() => copyToClipboard(address)}
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Paper>
      </div>
    </>
  );
};
