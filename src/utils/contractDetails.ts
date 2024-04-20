// export const contractAddress = "0xB0e6DE365a07a10E3Ae874bED66a87207ad51489";
//new:
export const contractAddress = "0x73f43095b33e10d4F315869B1c57F2934d974763";
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
