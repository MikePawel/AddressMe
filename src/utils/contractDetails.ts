export const contractAddressArbitrum =
  "0x73f43095b33e10d4F315869B1c57F2934d974763";
export const contractAddressGnosis =
  "0x222b908F6264cBf75074aB0a44975B8e66E7fe63";
export const contractAddressMorph =
  "0x222b908F6264cBf75074aB0a44975B8e66E7fe63";
export const contractAddressAvail =
  "0xFe4B974501B9eBd370ae9d73e7D7C45aEB6e7373";
export const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_data",
        type: "string",
      },
    ],
    name: "pushData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserData",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userData",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
