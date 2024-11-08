// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Copyrights {
    struct Copyright {
        uint256 id;
        string name;
        string ownerName;
        string description;
        address owner;
        uint256 timestamp;
    }

    mapping(uint256 => Copyright) public copyrights;
    mapping(string => bool) private nameExists; // Mapping to check for duplicate names
    uint256 public nextId;

    event CopyrightRegistered(
        uint256 id,
        string name,
        string ownerName,
        string description,
        address owner,
        uint256 timestamp
    );

    event CopyrightTransferred(
        uint256 id,
        address newOwner
    );

    function registerCopyright(string memory name, string memory ownerName, string memory description) public {
        require(!nameExists[name], "Copyright with this name already exists"); // Check for duplicate names
        copyrights[nextId] = Copyright(nextId, name, ownerName, description, msg.sender, block.timestamp);
        nameExists[name] = true; // Mark the name as used
        emit CopyrightRegistered(nextId, name, ownerName, description, msg.sender, block.timestamp);
        nextId++;
    }

    function transferCopyright(uint256 id, address newOwner) public {
        require(copyrights[id].owner == msg.sender, "Only the owner can transfer the copyright");
        require(newOwner != address(0), "Invalid new owner address");
        copyrights[id].owner = newOwner;
        emit CopyrightTransferred(id, newOwner);
    }

    function getCopyright(uint256 id) public view returns (Copyright memory) {
        return copyrights[id];
    }
}