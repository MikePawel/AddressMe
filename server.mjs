import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import crypto, { publicEncrypt } from "crypto";
import { promises as fs } from "fs";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

app.use(express.json());

async function generateKeys() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  // Save keys to files
  await fs.writeFile("private_key.pem", privateKey);
  await fs.writeFile("public_key.pem", publicKey);

  return { privateKey, publicKey };
}

async function encryptMessage(message, publicKeyPath) {
  try {
    const publicKey = await fs.readFile(publicKeyPath, "utf8");

    const encryptedBuffer = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(message)
    );

    return encryptedBuffer.toString("base64");
  } catch (error) {
    throw error;
  }
}

async function decryptMessage(encryptedMessage, privateKeyPath) {
  try {
    const privateKey = await fs.readFile(privateKeyPath, "utf8");

    const decryptedBuffer = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedMessage, "base64")
    );

    return decryptedBuffer.toString("utf8");
  } catch (error) {
    throw error;
  }
}

app.post("/createKeys", async (req, res) => {
  try {
    const keys = await generateKeys();

    // Respond with a JSON object
    res.json({
      success: true,
      message: "Keys generated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error JSON object
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/encryptMessage", async (req, res) => {
  try {
    // Extract the data from the request body
    let { data } = req.body;

    // Check if data is present
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "Data is required and cannot be empty" });
    }

    // Filter out empty values from the data object
    data = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value && value.trim() !== "")
    );

    // Check if any values are present after filtering
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Data values cannot be empty" });
    }

    console.log("Data to encrypt:", data);

    const encryptedMessage = await encryptMessage(
      JSON.stringify(data), // Stringify the object before encryption
      "public_key.pem"
    );

    // Respond with a JSON object
    res.json({
      success: true,
      message: encryptedMessage,
    });
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error JSON object
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

function splitStringAtComma(inputString) {
  // Split the input string at the commas
  try {
    let splitData = inputString.split(",");

    return splitData;
  } catch (error) {
    console.error("Error:", error);
    return NaN;
  }
}

app.post("/decryptMessage", async (req, res) => {
  let { data } = req.body;
  data = splitStringAtComma(data);
  try {
    console.log("Data to decrypt:", data);

    // Decrypt each element of the array individually
    let decryptedMessageArray = [];
    for (let i = 0; i < data.length; i++) {
      const decryptedPart = await decryptMessage(data[i], "private_key.pem");
      decryptedMessageArray.push(decryptedPart);
    }

    // Merge the decrypted JSON objects into a single object
    let mergedDecryptedMessage = {};
    decryptedMessageArray.forEach((decryptedPart) => {
      const parsedDecryptedPart = JSON.parse(decryptedPart);
      mergedDecryptedMessage = {
        ...mergedDecryptedMessage,
        ...parsedDecryptedPart,
      };
    });

    console.log("Merged Decrypted Message:", mergedDecryptedMessage);

    // Convert the merged decrypted message to a JSON string
    const mergedDecryptedMessageString = JSON.stringify(mergedDecryptedMessage);

    // Respond with a JSON object containing the merged decrypted message as a string
    res.json({
      success: true,
      message: mergedDecryptedMessageString,
    });
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error JSON object
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
