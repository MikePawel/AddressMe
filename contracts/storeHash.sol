// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract DataStorage {
    mapping(address => string[]) public userData;

    // Function to push new data (hash) to the user's array
    function pushData(string memory _data) public {
        userData[msg.sender].push(_data);
    }

    // Function to get the concatenated string of the user's data array
    function getUserData(address _user) public view returns (string memory) {
        string memory concatenatedData;
        uint256 dataLength = userData[_user].length;
        for(uint256 i = 0; i < dataLength; i++){
            if (i > 0) {
                concatenatedData = string(abi.encodePacked(concatenatedData, ",", userData[_user][i]));
            } else {
                concatenatedData = userData[_user][i];
            }
        }
        return concatenatedData;
    }
}
