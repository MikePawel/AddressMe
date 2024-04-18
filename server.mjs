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
    console.log(publicKey);

    const encryptedBuffer = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(message)
    );

    console.log(encryptedBuffer.toString("base64"));

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
  const { data } = req.body;

  try {
    console.log("Data to encrypt: " + data);
    const encryptedMessage = await encryptMessage(data, "public_key.pem");

    // Respond with a JSON object
    res.json({
      success: true,
      message: "Data encrypted successfully: " + encryptedMessage,
    });
  } catch (error) {
    console.error("Error:", error);
    // Respond with an error JSON object
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/decryptMessage", async (req, res) => {
  const { data } = req.body;

  try {
    console.log("Data to encrypt: " + data);
    const decryptedMessage = await decryptMessage(data, "private_key.pem");

    // Respond with a JSON object
    res.json({
      success: true,
      message: "Data encrypted successfully: " + decryptedMessage,
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
