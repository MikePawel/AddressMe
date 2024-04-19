import React from "react";
import { useMetaMask } from "~/hooks/useMetaMask";
import { useState } from "react";
import styles from "./Display.module.css";
import { Link } from "react-router-dom";
import { ethers } from 'ethers';

// This is an example, you might need to configure the provider based on your Ethereum network
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contractAddress = '0xFe4B974501B9eBd370ae9d73e7D7C45aEB6e7373';
const contractABI = [{"inputs":[],"name":"retrieveHash","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"inputHash","type":"string[]"}],"name":"storeHash","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const contract = new ethers.Contract(contractAddress, contractABI, signer);


export const Display = () => {
  const { wallet } = useMetaMask();
  const [formData, setFormData] = useState([
    {
      name: "",
      address: "",
    },
  ]);
  const [inputValueToDecrypt, setInputValueToDecrypt] = useState("");

  const handleInputChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedFormData = formData.reduce((acc, curr) => {
      acc[curr.name] = curr.address;
      return acc;
    }, {});
    console.log(combinedFormData);
    encryptKeys(combinedFormData);
    setFormData(
      Array.from({ length: numInputs }, () => ({ name: "", address: "" }))
    );
  };

  const handleNumInputsChange = (count) => {
    setFormData(
      Array.from({ length: count }, () => ({ name: "", address: "" }))
    );
  };

  const encryptKeys = (data) => {
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
            const tx = await contract.storeHash([data.message]);
            console.log(`Transaction hash: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
            console.log('Hash stored successfully');
        } catch (error) {
            console.error('Error storing hash:', error);
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
    <div className={styles.display}>
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

          <div style={{ paddingTop: "20px" }}>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div>
        <input
          type="text"
          value={inputValueToDecrypt}
          onChange={(e) => setInputValueToDecrypt(e.target.value)}
          placeholder="Enter data to decrypt"
        />
        <button onClick={decryptKeys} className="submit-button">
          Decrypt Data
        </button>
      </div>
      <div className="link-container">
        <Link to="/encryption">Go to Encryption page</Link>
        <Link to="/dataDisplay">Go to Data Display page</Link>
      </div>
    </div>
  );
};
