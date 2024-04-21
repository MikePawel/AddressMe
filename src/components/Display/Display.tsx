import React, { useEffect } from "react";
import { useMetaMask } from "~/hooks/useMetaMask";
import { useState } from "react";
import styles from "./Display.module.css";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { contractAddress } from "~/utils/contractDetails";
import { contractAddressArbitrum } from "~/utils/contractDetails";
import { contractAddressGnosis } from "~/utils/contractDetails";
import { contractAddressMorph } from "~/utils/contractDetails";
import { contractAddressAvail } from "~/utils/contractDetails";
import { contractABI } from "~/utils/contractDetails";
import Intro from "../Intro/Intro";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Paper } from "@mui/material";

export const Display = () => {
  const { wallet } = useMetaMask();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const [formData, setFormData] = useState([
    {
      name: "",
      address: "",
    },
  ]);
  const [inputValueToDecrypt, setInputValueToDecrypt] = useState("");
  const [numInputs, setNumInputs] = useState(1);

  const handleInputChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let currentNet = parseInt(wallet.chainId, 16);
    let currentAddress = contractAddress;
    if (currentNet === 421614) {
      currentAddress = contractAddressArbitrum;
    } else if (currentNet === 2710) {
      currentAddress = contractAddressMorph;
    } else if (currentNet === 202402021700) {
      currentAddress = contractAddressAvail;
    } else if (currentNet === 10200) {
      currentAddress = contractAddressGnosis;
    }

    const contract = new ethers.Contract(currentAddress, contractABI, signer);
    const combinedFormData = formData.reduce((acc, curr) => {
      acc[curr.name] = curr.address;
      return acc;
    }, {});
    console.log(combinedFormData);
    encryptKeys(contract, combinedFormData); // Pass contract instance to encryptKeys
    setFormData(
      Array.from({ length: numInputs }, () => ({ name: "", address: "" }))
    );
  };

  const handleNumInputsChange = (count) => {
    setNumInputs(count);
    setFormData(
      Array.from({ length: count }, () => ({ name: "", address: "" }))
    );
  };

  const encryptKeys = (contract, data) => {
    // Receive contract instance as parameter
    fetch("http://localhost:8000/encryptMessage", {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        console.log(data.message);

        try {
          const tx = await contract.pushData(data.message);
          console.log(`Transaction hash: ${tx.hash}`);

          // Show response message
          // <SnackbarProvider />; // You don't need this line here
          enqueueSnackbar(
            "Transaction created! Transaction hash: \n" +
              tx.hash +
              "\n Waiting for confirmation...",
            {
              variant: "info",
              style: { whiteSpace: "pre-line" },
            }
          );
          const receipt = await tx.wait();
          console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
          console.log("Hash stored successfully");
          enqueueSnackbar("Hash stored successfully!", {
            variant: "success",
            style: { whiteSpace: "pre-line" },
          });
        } catch (error) {
          console.error("Error storing hash:", error);
        }
      })
      .catch((error) => {
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
        console.log(data);
        const parsedData = JSON.parse(data.message);
        console.log(parsedData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "50px",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          backgroundColor: "#424242",
          marginBottom: "20px",
          width: "800px",
          height: "500px",
          overflowY: "auto", // scrollable when content overflows vertically
          color: "white", // Text color white
        }}
      >
        <div className={styles.display}>
          {/* Button that creates a new RSA key Pair */}
          <Intro />

          <div style={{ paddingTop: "50px" }}></div>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {formData.map((data, index) => (
                <div className="input-group" key={index}>
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <label className="form-label">Address:</label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) =>
                      handleInputChange(index, "address", e.target.value)
                    }
                  />
                </div>
              ))}
              <div style={{ paddingTop: "10px" }}></div>
              <div className="input-group">
                <button
                  type="button"
                  style={{ width: "50%" }}
                  onClick={() => handleNumInputsChange(formData.length - 1)}
                  className="submit-button"
                  disabled={formData.length === 1}
                >
                  -
                </button>
                <button
                  type="button"
                  style={{ width: "50%" }}
                  onClick={() => handleNumInputsChange(formData.length + 1)}
                  className="submit-button"
                >
                  +
                </button>
              </div>

              <div
                style={{
                  paddingTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button type="submit">Submit to Blockchain</button>
              </div>
            </form>
          </div>
          {/* decryption testing: */}
          {/* <div>
        <input
          type="text"
          value={inputValueToDecrypt}
          onChange={(e) => setInputValueToDecrypt(e.target.value)}
          placeholder="Enter data to decrypt"
        />
        <button onClick={decryptKeys} className="submit-button">
          Decrypt Data
        </button>
      </div> */}
        </div>
      </Paper>
      <div className="lower-button">
        {/* Encryption page was used for test and could be used */}
        {/* <Link to="/encryption">Go to Encryption page</Link> */}
        <Link to="/dataDisplay">Data Display page</Link>
      </div>
    </div>
  );
};
