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

     function retrieveHash2(address _address) public view returns (string[] memory) {
        return store[_address];
    }
    
}