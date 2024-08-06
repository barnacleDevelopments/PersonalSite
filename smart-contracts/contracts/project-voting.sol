// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ProjectVoting is VRFConsumerBaseV2{
    // Voting mappings
    mapping(uint => mapping(string => uint)) public cycleVotes; // total project votes within the current cycle
    mapping(uint => mapping(address => string)) public addressCycleChoice; // address project choice for the currrent cycle
    mapping(uint => mapping(address => bool)) public hasVotedForCycle; // has the address voted for a project in the current cycle
    mapping(uint => address[]) public cycleVoters; // list of voters of the current cycle
    mapping(address => string) public addressNames; // address display names
    mapping(string => string) public projects;

    address private owner;
    uint private threshold = 0.1 ether;
    uint public currentCycle = 1; // <= current cycle

    // Chainlink VRF Variables
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 private subscriptionId; // this can be found here https://vrf.chain.link/sepolia
    bytes32 private keyHash;
    uint32 private callbackGasLimit = 100000; // Adjust the gas limit based on the requirement
    uint16 private requestConfirmations = 3; // Minimum number of confirmations
    uint32 private numWords =  1; // Number of random values to request

    // Voting Events
    event ProjectAdded(string projectId, string projectName);
    event Voted(address voter, string name, string projectId); 
    event WinnerAnnounced(address winner, uint256 amount);

    // User Action Events
    event ActionPerformed(address voter, string[] actionCIDs);

    // Chainlink VRF Events
    event RandomNumberRequested(uint256 requestId);
    event RandomNumberReceived(uint256 randomNumber);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute");
        _;
    }
  
    constructor(
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        owner = msg.sender;
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
    }

    function add(string memory projectName, string memory projectId) public onlyOwner {
        require(bytes(projects[projectId]).length == 0, "Project already exists");
        require(bytes(projectName).length > 0, "Project name is required");
        require(bytes(projectId).length > 0, "Project ID is required"); 
        projects[projectId] = projectName;
        emit ProjectAdded(projectId, projectName);
    }

    function vote(string memory projectId, string memory voterName) payable public {
        require(msg.value >= 0.001 ether, "Minimum 0.001 ether");
        require(msg.value <= 0.05 ether, "Maximum 0.05 ether");
        bool hasVoted = hasVotedForCycle[currentCycle][msg.sender];
        require(!hasVoted, "Already voted");
        require(bytes(projects[projectId]).length > 0, "Project does not exist"); 
        addressCycleChoice[currentCycle][msg.sender] = projectId;
        cycleVotes[currentCycle][projectId]++;
        hasVotedForCycle[currentCycle][msg.sender] = true;
        cycleVoters[currentCycle].push(msg.sender);
        // checkAndTransfer();
        emit Voted(msg.sender, voterName, projectId);
    }

    function getCycleVoteCount(string memory projectId) public view returns (uint) {
        return cycleVotes[currentCycle][projectId];
    }

    function checkHasVotedForCycle() public view returns (bool) {
        return hasVotedForCycle[currentCycle][msg.sender];
    }

    function getVoteCycleChoice() public view returns (string memory) {
        return addressCycleChoice[currentCycle][msg.sender];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getThreshold() public view returns (uint256) {
        return threshold;
    }

    function checkAndTransfer() internal {
        if (address(this).balance >= threshold) {
            require(cycleVoters[currentCycle].length > 0, "No voters to reward");
            uint256 requestId = COORDINATOR.requestRandomWords(
                keyHash,
                subscriptionId,
                requestConfirmations,
                callbackGasLimit,
                numWords
            );
            emit RandomNumberRequested(requestId);
        }
    }

    function fulfillRandomWords(uint256 /* requestId */, uint256[] memory randomWords) internal override {
        uint256 randomResult = randomWords[0];
        emit RandomNumberReceived(randomWords[0]);
        uint randomIndex = randomResult % cycleVoters[currentCycle].length;
        address payable luckyVoter = payable(cycleVoters[currentCycle][randomIndex]);
        uint256 amountToSend = address(this).balance;
        emit WinnerAnnounced(luckyVoter, amountToSend);
        luckyVoter.transfer(amountToSend);
        currentCycle++;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
