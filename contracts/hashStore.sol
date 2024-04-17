// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
contract HashStore {
 
    mapping(string => mapping(string => string)) private store;
 
   
    function storeHash(string memory name, string memory inputHash, string memory valueHash) public {
        store[name][inputHash] = valueHash;
    }
 
    function retrieveHash(string memory name, string memory inputHash) public view returns (string memory) {
        return store[name][inputHash];
    }
}