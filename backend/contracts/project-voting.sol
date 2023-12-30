// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract ProjectVoting {
    mapping(string => uint) public projectVotes;
    mapping(address => bool) public hasVoted;
    mapping(string => string) public projects;
    mapping(address => string) public addressVotes;
    string[] public projectIds;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function add(string memory projectName, string memory projectId) public {
        require(bytes(projects[projectId]).length == 0, "Project already exists");
        require(msg.sender == owner, "Only owner can add projects");        
        projects[projectId] = projectName;
        projectIds.push(projectId);    
    }

    function vote(string memory projectId) payable public {
        require(msg.value >= 0.01 ether, "Minimum 0.01 ether");
        require(!hasVoted[msg.sender], "Already voted");
        
        addressVotes[msg.sender] = projectId; 
        projectVotes[projectId]++;
        hasVoted[msg.sender] = true;
    }

    function getVoteCount(string memory projectId) public view returns (uint) {
        return projectVotes[projectId];
    }

    function getAll() public view returns (string[] memory) {
        return projectIds;
    }

    function checkHasVoted() public view returns (bool) {
        return hasVoted[msg.sender];
    }

    function getVote() public view returns (string memory) {
        return  addressVotes[msg.sender]; 
    }
}