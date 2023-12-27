// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract ProjectVoting {
    mapping(uint => uint) public projectVotes;
    mapping(address => bool) public hasVoted;
    mapping(uint => string) public projects;
    uint[] public projectIds;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function addProject(string memory projectName) public {
        require(msg.sender == owner, "Only owner can add projects");        
        uint projectId = projectIds.length;
        projects[projectId] = projectName;
        projectIds.push(projectId);
    }

    function voteForProject(uint projectId) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(bytes(projects[projectId]).length > 0, "Project does not exist");

        projectVotes[projectId]++;
        hasVoted[msg.sender] = true;
    }

    function getVoteCount(uint projectId) public view returns (uint) {
        return projectVotes[projectId];
    }

    function getAllProjects() public view returns (uint[] memory) {
        return projectIds;
    }

    function getBalanceOf() public view returns (uint) {
        return address(this).balance;
    }
}