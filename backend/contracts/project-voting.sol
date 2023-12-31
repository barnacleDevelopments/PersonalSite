// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract ProjectVoting {
    mapping(string => uint) public projectVotes;
    mapping(address => bool) public hasVoted;
    mapping(string => string) public projects;
    mapping(address => string) public addressVotes;
    string[] public projectIds;
    address private owner;

    event ProjectAdded(string projectId, string projectName); // Event for adding a project
    event Voted(address voter, string projectId); // Event for a vote
   
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute");
        _;
    }
  
    constructor() {
        owner = msg.sender;
    }

    function add(string memory projectName, string memory projectId) public onlyOwner {
        require(bytes(projects[projectId]).length == 0, "Project already exists");
        require(bytes(projectName).length > 0, "Project name is required"); // Input validation for projectName
        require(bytes(projectId).length > 0, "Project ID is required"); // Input validation for projectId
        projects[projectId] = projectName;
        projectIds.push(projectId);
        emit ProjectAdded(projectId, projectName); // Emitting event after project addition
    }

    function vote(string memory projectId) payable public {
        require(msg.value >= 0.01 ether, "Minimum 0.01 ether");
        require(!hasVoted[msg.sender], "Already voted");
        require(bytes(projects[projectId]).length > 0, "Project does not exist"); // Check if project exists

        addressVotes[msg.sender] = projectId;
        projectVotes[projectId]++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, projectId); // Emitting event after voting
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

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}