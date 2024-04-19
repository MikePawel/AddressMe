// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

contract HashStore {

    mapping(address => string[]) private store;

   
    function storeHash(string[] memory inputHash) public {
        store[msg.sender] = inputHash;
    }

    function retrieveHash() public view returns (string[] memory) {
        return store[msg.sender];
    }
    
}