// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

contract ProjectVoting {
    mapping(string => uint) public projectVotes;
    mapping(address => bool) public hasVoted;
    mapping(string => string) public projects;
    mapping(address => string) public addressVotes;
    mapping(address => string) public addressNames;
    mapping(address => string) public winners;
    string[] public winnerNames;
    string[] public projectIds;
    address private owner;
    address[] private voters;
    uint private threshold = 0.1 ether;

    event ProjectAdded(string projectId, string projectName);
    event Voted(address voter, string projectId); 
    event WinnerAnnounced(address winner, uint256 amount);

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
        emit ProjectAdded(projectId, projectName); 
    }

    function vote(string memory projectId, string memory voterName) payable public {
        require(msg.value >= 0.001 ether, "Minimum 0.001 ether");
        require(msg.value <= 0.05 ether, "Maximum 0.05 ether");
        require(!hasVoted[msg.sender], "Already voted");
        require(bytes(projects[projectId]).length > 0, "Project does not exist"); 
        addressNames[msg.sender] = voterName;
        addressVotes[msg.sender] = projectId;
        projectVotes[projectId]++;
        hasVoted[msg.sender] = true;
        voters.push(msg.sender);
        checkAndTransfer();  
        emit Voted(msg.sender, projectId);
    }

    function getWinners() public view returns (string[] memory) {
        return winners;
    }

    function voteTest() public payable returns (uint) {
        return msg.value;
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

    function checkAndTransfer() internal {
        if (address(this).balance >= threshold) {
            require(voters.length > 0, "No voters to reward");
            uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % voters.length;
            address payable luckyVoter = payable(voters[randomIndex]);
            uint256 amountToSend = address(this).balance;
            Address.sendValue(luckyVoter, amountToSend);
            winners[luckyVoter] = addressNames[luckyVoter];
            winnerNames.push(addressNames[luckyVoter]);
            emit WinnerAnnounced(luckyVoter, amountToSend);
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getThreshold() public view returns (uint256) {
        return threshold;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}