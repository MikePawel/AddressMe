import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

app.use(express.json());

// Generate asymmetric keys
async function generateKeys() {
  const keys = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return keys;
}

// Encrypt function
async function encryptMessage(publicKey, message) {
  const encodedMessage = new TextEncoder().encode(message);
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encodedMessage
  );
  const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
  return btoa(String.fromCharCode.apply(null, encryptedArray));
}

// Decrypt function
async function decryptMessage(privateKey, encryptedMessage) {
  const encryptedArray = Uint8Array.from(atob(encryptedMessage), (c) =>
    c.charCodeAt(0)
  );
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedArray
  );
  return new TextDecoder().decode(decryptedBuffer);
}

app.post("/data", async (req, res) => {
  const { data } = req.body;

  try {
    const keys = await generateKeys();
    const publicKey = keys.publicKey;
    const privateKey = keys.privateKey;

    const encryptedMessage = await encryptMessage(publicKey, data);

    const decryptedMessage = await decryptMessage(privateKey, encryptedMessage);

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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
